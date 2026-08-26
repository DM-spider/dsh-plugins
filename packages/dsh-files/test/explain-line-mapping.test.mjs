import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import vm from 'node:vm'

import { apply } from '../lib/index.js'

const ROOT = 'D:/workspace'
const FILE = ROOT + '/sample.py'

const createHarness = (content, respond) => {
  const routes = new Map()
  const calls = []
  const llm = {
    listModels: async () => [{ model: 'deepseek-v4-flash' }],
    stream: async function * (input) {
      calls.push(input)
      yield { type: 'text-delta', text: JSON.stringify(respond(input, calls.length)) }
      yield { type: 'finish', reason: { kind: 'stop' } }
    },
  }
  const fs = {
    resolve: async (path) => ({ targetKey: String(path).replace(/\\/g, '/') }),
    stat: async () => ({ type: 'file', size: Buffer.byteLength(content), mtimeMs: 1 }),
    readText: async () => content,
  }
  const webServer = {
    register: ({ path, handler }) => { routes.set(path, handler) },
  }
  const ctx = {
    fs,
    get: (name) => ({ llm, webServer })[name],
    effect: (setup) => setup(),
    on: () => {},
  }
  apply(ctx)

  const request = async (options = { refresh: true }) => {
    const body = JSON.stringify({ path: FILE, root: ROOT, ...options })
    const req = {
      method: 'POST',
      url: '/plugins/dsh-files/explain',
      async * [Symbol.asyncIterator] () { yield Buffer.from(body) },
    }
    let status = 0
    let payload = ''
    const res = {
      destroyed: false,
      writableEnded: false,
      writeHead: (value) => { status = value },
      end: (value) => { payload = String(value); res.writableEnded = true },
    }
    await routes.get('/plugins/dsh-files/explain')(req, res)
    assert.equal(status, 200)
    return JSON.parse(payload)
  }
  return { calls, request }
}

const invokeExplain = async (content, respond) => {
  const harness = createHarness(content, respond)
  return { calls: harness.calls, data: await harness.request() }
}

test('单次解读给每行添加绝对行号并保留明确步骤范围', async () => {
  const content = ['def sample():', '    value = 1', '    return value'].join('\n')
  const { calls, data } = await invokeExplain(content, () => ({
    functions: [{
      name: 'sample', start: 1, end: 3, signature: 'def sample():', summary: 'sample',
      flow: [
        { start: 2, end: 2, text: '准备值`value`' },
        { start: 3, end: 3, text: '返回值`value`' },
      ],
      formula: '',
    }],
    callEdges: [],
  }))

  assert.match(calls[0].messages[0].content[0].text, /1\| def sample\(\):/)
  assert.match(calls[0].messages[0].content[0].text, /3\|     return value/)
  assert.match(calls[0].system, /处理依据或条件 \+ 核心动作 \+ 本步骤结果/)
  assert.match(calls[0].system, /行号只写入 start\/end,供客户端点击映射/)
  assert.match(calls[0].system, /不得概括 start\/end 范围之外的代码/)
  assert.deepEqual(data.functions[0].flowSteps.map(({ start, end }) => [start, end]), [[2, 2], [3, 3]])
})

test('分段解读在 Explain 截取源码前校正 Outline 函数范围', async () => {
  const lines = Array.from({ length: 520 }, (_, i) => '# filler ' + (i + 1))
  lines[509] = 'def target():'
  lines[510] = '    value = 1'
  lines[511] = '    return value'
  const content = lines.join('\n')

  const { calls, data } = await invokeExplain(content, (input) => {
    if (input.system.includes('代码结构分析师')) {
      return {
        functions: [{ name: 'target', start: 450, end: 520, signature: 'def target():' }],
      }
    }
    return {
      functions: [{
        name: 'target', summary: 'target',
        flow: [{ start: 511, end: 511, text: '准备值`value`' }], formula: '',
      }],
      callEdges: [],
    }
  })

  assert.equal(calls.length, 2)
  const explainText = calls[1].messages[0].content[0].text
  assert.match(explainText, /target \(第 510 – 512 行\)/)
  assert.match(explainText, /510\| def target\(\):/)
  assert.doesNotMatch(explainText, /448\|/)
  assert.match(calls[1].system, /处理依据或条件 \+ 核心动作 \+ 本步骤结果/)
  assert.match(calls[1].system, /行号只写入 start\/end,供客户端点击映射/)
  assert.deepEqual(data.functions[0].flowSteps.map(({ start, end }) => [start, end]), [[511, 511]])
})

test('补全 Outline 失败窗口时也在 Explain 前校正函数范围', async () => {
  const lines = Array.from({ length: 520 }, (_, i) => '# filler ' + (i + 1))
  lines[509] = 'def retry_target():'
  lines[510] = '    return 1'
  const content = lines.join('\n')
  let outlineAttempts = 0
  const harness = createHarness(content, (input) => {
    if (input.system.includes('代码结构分析师')) {
      outlineAttempts++
      if (outlineAttempts === 1) throw new Error('temporary outline failure')
      return {
        functions: [{ name: 'retry_target', start: 450, end: 520, signature: 'def retry_target():' }],
      }
    }
    return {
      functions: [{
        name: 'retry_target', summary: 'retry target',
        flow: [{ start: 511, end: 511, text: '返回结果' }], formula: '',
      }],
      callEdges: [],
    }
  })

  const first = await harness.request()
  assert.equal(first.failedGroups.length, 1)
  const second = await harness.request({ retry: true })
  assert.equal(second.failedGroups.length, 0)
  const explainText = harness.calls[2].messages[0].content[0].text
  assert.match(explainText, /retry_target \(第 510 – 511 行\)/)
  assert.match(explainText, /510\| def retry_target\(\):/)
})

test('Python 多行签名回到 def 行、结束于下一同级函数前并包含闭合行', async () => {
  const content = [
    'class Meter:',
    '    def add_llm_call(self):',
    '        self.calls.append({',
    '            "model": "x",',
    '        })',
    '',
    'def window_nav(holdings: list[dict], cash: float,',
    '               all_dates: list, evald: int) -> tuple:',
    '    """计算窗口净值。"""',
    '    nav = cash',
    '    return nav',
    '',
    'def build_report_skeleton():',
    '    return "report"',
  ].join('\n')
  const { data } = await invokeExplain(content, () => ({
    functions: [
      {
        name: 'Meter.add_llm_call', start: 2, end: 4,
        signature: 'def add_llm_call(self):', summary: '记录调用',
        flow: [{ start: 3, end: 5, text: '追加记录`calls`' }], formula: '',
      },
      {
        name: 'window_nav', start: 8, end: 14,
        signature: 'def window_nav(holdings: list[dict], cash: float,\n               all_dates: list, evald: int) -> tuple:',
        summary: '计算净值', flow: [{ start: 10, end: 11, text: '计算净值`nav`' }], formula: '',
      },
      {
        name: 'build_report_skeleton', start: 13, end: 14,
        signature: 'def build_report_skeleton():', summary: '生成报告',
        flow: [{ start: 14, end: 14, text: '返回报告' }], formula: '',
      },
    ],
    callEdges: [],
  }))

  assert.deepEqual(data.functions.map(({ name, start, end }) => [name, start, end]), [
    ['Meter.add_llm_call', 2, 5],
    ['window_nav', 7, 11],
    ['build_report_skeleton', 13, 14],
  ])
})

test('大文件分段路径不会让多行签名函数吞并后续同级函数', async () => {
  const lines = Array.from({ length: 520 }, (_, i) => '# filler ' + (i + 1))
  lines[499] = 'def window_nav(holdings: list[dict], cash: float,'
  lines[500] = '               all_dates: list, evald: int) -> tuple:'
  lines[501] = '    """计算窗口净值。"""'
  lines[502] = '    nav = cash'
  lines[503] = '    return nav'
  lines[504] = ''
  lines[505] = 'def build_report_skeleton():'
  lines[506] = '    return "report"'
  const content = lines.join('\n')

  const { calls, data } = await invokeExplain(content, (input) => {
    if (input.system.includes('代码结构分析师')) {
      return {
        functions: [
          {
            name: 'window_nav', start: 501, end: 520,
            signature: 'def window_nav(holdings: list[dict], cash: float,\n               all_dates: list, evald: int) -> tuple:',
          },
          {
            name: 'build_report_skeleton', start: 506, end: 520,
            signature: 'def build_report_skeleton():',
          },
        ],
      }
    }
    return {
      functions: [
        {
          name: 'window_nav', summary: '计算净值',
          flow: [{ start: 503, end: 504, text: '计算净值`nav`' }], formula: '',
        },
        {
          name: 'build_report_skeleton', summary: '生成报告',
          flow: [{ start: 507, end: 507, text: '返回报告' }], formula: '',
        },
      ],
      callEdges: [],
    }
  })

  assert.equal(calls.length, 2)
  assert.match(calls[1].messages[0].content[0].text, /window_nav \(第 500 – 504 行\)/)
  assert.match(calls[1].messages[0].content[0].text, /build_report_skeleton \(第 506 – 507 行\)/)
  assert.deepEqual(data.functions.map(({ name, start, end }) => [name, start, end]), [
    ['window_nav', 500, 504],
    ['build_report_skeleton', 506, 507],
  ])
})

test('客户端只把函数头映射到摘要，函数体严格按步骤范围命中', async () => {
	const path = new URL('../lib/client.js', import.meta.url)
	let source = await readFile(path, 'utf8')
	source = source.replace('exports.apply = apply;', 'exports.__test = { stepPartitionIndex, guideItemIndex, jumpTargetLine }; exports.apply = apply;')
  let definition
  const sandbox = {
    window: { __ModuleLoader__: { load: (value) => { definition = value } } },
  }
  vm.runInNewContext(source, sandbox)
  const module = definition.factory(() => ({}))
  const steps = [
    { start: 10, end: 12, text: '读取共享值`value`' },
    { start: 20, end: 22, text: '再次使用共享值`value`' },
  ]
  assert.equal(module.__test.stepPartitionIndex(11, steps), 0)
	assert.equal(module.__test.stepPartitionIndex(21, steps), 1)
	assert.equal(module.__test.stepPartitionIndex(16, steps), -1)
	assert.equal(module.__test.stepPartitionIndex(11, [{ start: 0, end: 0, text: '无效范围' }]), -1)
	const backtestSteps = [
		{ start: 497, end: 503, text: '准备回测数据' },
		{ start: 509, end: 515, text: '生成调仓日' },
	]
	assert.equal(module.__test.guideItemIndex(495, 495, 495, backtestSteps), -2)
	assert.equal(module.__test.guideItemIndex(504, 495, 495, backtestSteps), -1)
	assert.equal(module.__test.guideItemIndex(506, 495, 495, backtestSteps), -1)
	assert.equal(module.__test.guideItemIndex(510, 495, 495, backtestSteps), 1)
	assert.equal(module.__test.guideItemIndex(11, 1, 1, steps), 0)

  const content = [
    'def window_nav(a,',
    '               b):',
    '    return a + b',
    '',
    'def window_nav_extra():',
    '    return 0',
    '',
    'def build_report_skeleton():',
    '    return "report"',
  ].join('\n')
  assert.equal(module.__test.jumpTargetLine({ name: 'window_nav', start: 1 }, content), 1)
  assert.equal(module.__test.jumpTargetLine({ name: 'window_nav', start: 2 }, content), 2)
})
