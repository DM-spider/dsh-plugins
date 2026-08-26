/**
 * dsh-files — host half.
 * /plugins/dsh-files/* 路由:list(文件树)/ read(读文件)/ search(文件名搜索)/
 * raw(图片等字节流)/ explain(逐函数 AI 解读 + mermaid 调用图)。
 * explain 两阶段:OUTLINE 列出全部函数定义(名+绝对行号)→ EXPLAIN 按窗口
 * 分组解读,合并后与源码函数 1:1 对应。源码只展示,绝不执行。
 * @module dsh-files
 */
export const name = 'dsh-files'
export const inject = ['fs']

const MAX_EXPLAIN_BYTES = 1000000
// 小/中脚本走单次调用;失败(输出超限等)或大文件才回退两阶段分段
const SINGLE_CALL_MAX_LINES = 500
const SINGLE_CALL_MAX_TOKENS = 24000
const OUTLINE_WINDOW = 1200          // lines per outline call (small output each)
const EXPLAIN_WINDOW_SPAN = 400      // max line span per explanation call
const EXPLAIN_CONCURRENCY = 3
const OUTLINE_MAX_TOKENS = 8000
const EXPLAIN_MAX_TOKENS = 24000
const MAX_GRAPH_NODES = 120
const MAX_GRAPH_EDGES = 200
const MAX_CACHE_ENTRIES = 64
const MAX_RAW_BYTES = 20 * 1024 * 1024 // 图片预览字节流上限

const FLOW_TEXT_RULES = [
  '- flow 每个步骤的 text 必须是一句完整说明,采用“处理依据或条件 + 核心动作 + 本步骤结果”的结构;某部分确实不存在时可以省略',
  '- flow 的 text 不得出现 start/end、“第 X 行”或其他行号描述;行号只写入 start/end,供客户端点击映射',
  '- flow 的 text 要解释关键变量在业务流程中的含义,再用反引号标注源码里的真实变量名/函数名;不得只是把赋值语句改写成“根据 X 计算 Y”',
  '- flow 的 text 必须说明当前范围内的重要条件分支、回退策略和异常处理,但不得概括 start/end 范围之外的代码',
  '- flow 写作示例:写“根据决策日索引`i0`和评测天数`evald`,确定次一交易日为买入日`w0`、评测期末交易日为结束日`w1`,并截取窗口日期`window_dates`”,不要只写“根据`i0`和`evald`计算`w0`和`w1`”',
]

const SINGLE_PROMPT = [
  '你是一位资深代码讲解老师,面向初学者做逐函数解读。用户会贴出一段完整源代码,每行格式为“绝对行号| 源码”。',
  '你只做解读,不运行代码、不修改代码;源码里有几个函数就解读几个,一个不多一个不少。',
  '请输出严格合法的 JSON(不要输出 JSON 之外的任何内容,不要 Markdown 代码围栏),结构如下:',
  '{',
  '  "functions": [',
    '    {"name": "函数名(类方法写成 Class.method)", "start": 起始行号, "end": 结束行号, "signature": "函数定义行的原始内容(去掉行首缩进,逐字照抄,绝不能改写;装饰器则从第一行装饰器开始)", "summary": "一句话:这个函数做什么", "flow": [{"start": 本步骤对应的起始行号, "end": 本步骤对应的结束行号, "text": "先用通俗语言描述目的,关键标识符用反引号紧跟在描述后面做注释"}], "formula": "关键公式或核心算法说明,多条公式用分号分隔,每条格式为 代码公式 → 中文公式(用中文变量名重写),只对公式左侧的结果变量用反引号包裹,右侧表达式不加反引号;没有则为空字符串。示例: `profit` = sell_price - buy_price → 利润 = 卖出价 - 买入价; `sharpe` = mean(returns) / std(returns) → 夏普比率 = 收益均值 / 收益标准差"}',
  '  ],',
  '  "callEdges": [["调用方函数名", "被调用函数名"]]',
  '}',
  '要求:',
  '- 每行开头的“绝对行号|”只是定位标签,不是源码内容;signature 不得包含该标签',
  '- start/end 必须直接引用源码行首标签中的绝对行号,不得自行计数或估算',
  '- 一个不漏:装饰器、lambda 赋值、嵌套函数、类方法都要列出来,按行号升序,不要重复;如果代码里确实存在函数,严禁返回空数组,仔细逐段找,找到为止',
  '- flow 是数组,按执行顺序拆步骤;每个步骤的 start/end 必须精确引用行首标签,范围位于函数体内、从小到大、不重叠;没有步骤则 flow 为空数组',
  '- flow 行号会被客户端直接用于源码映射,偏差 1 行也会映射错误;短函数可少拆,其余每步不超过函数有效代码行数的约 1/3',
  '- flow 写作风格:业务描述在前,代码标识符在后做注释。写"初始化全局配置`build_config`：从参数构建运行配置`config`，分配批次号`run_id`",不要写"调用 `build_config` 生成 `config`，生成 `run_id`"',
  ...FLOW_TEXT_RULES,
  '- flow 中每个步骤必须引用代码里真实出现的变量名/函数名,用反引号包裹;反引号只包裹标识符本身(如 `train_scorecards`),不带参数和括号',
  '- flow 步骤严禁泛泛写"遍历列表"而不指明遍历哪个变量',
  '- 严禁把正则原文(如 /^[...$/、re.compile("…"))写进解读文本,用自然语言描述匹配规则;不要输出含反斜杠的路径/转义序列',
  '- 解读要通俗,说人话,重点讲"数据怎么进、怎么流转、得到什么"',
  '- callEdges 只列代码里实际出现的调用关系,没有就为空数组',
].join('\n')

const OUTLINE_PROMPT = [
  '你是一位代码结构分析师。用户会贴出一个大文件的一段(可能很长),每行格式为“绝对行号| 源码”。',
  '任务:列出本段代码中所有函数/方法的定义,不解读、不运行、不修改。',
  '请输出严格合法的 JSON(不要输出 JSON 之外的任何内容,不要 Markdown 代码围栏),结构如下:',
  '{',
  '  "functions": [{"name": "函数名(类方法写成 Class.method)", "start": 起始行号, "end": 结束行号, "signature": "函数定义行的原始内容(去掉行首缩进,逐字照抄,绝不能改写;装饰器则从第一行装饰器开始)"}]',
  '}',
  '要求:',
  '- 每行开头的“绝对行号|”只是定位标签,不是源码内容;signature 不得包含该标签',
  '- start/end 必须直接引用源码行首标签中的绝对行号,不得自行计数或估算',
  '- 一个不漏:装饰器、lambda 赋值、嵌套函数、类方法都要列出来,按行号升序,不要重复;如果代码里确实存在函数,严禁返回空数组,仔细逐段找,找到为止',
].join('\n')

const EXPLAIN_PROMPT = [
  '你是一位资深代码讲解老师,面向初学者做逐函数解读。',
  '用户会给出:一段源代码片段 + 本段要解读的函数清单(函数名与绝对行号)。',
  '你只做解读,不运行代码、不修改代码。',
  '请输出严格合法的 JSON(不要输出 JSON 之外的任何内容,不要 Markdown 代码围栏),结构如下:',
  '{',
  '  "functions": [',
    '    {"name": "必须与清单完全一致的函数名", "summary": "一句话:这个函数做什么", "flow": [{"start": 本步骤对应的起始行号, "end": 本步骤对应的结束行号, "text": "先用通俗语言描述目的,关键标识符用反引号紧跟在描述后面做注释"}], "formula": "关键公式或核心算法说明,多条公式用分号分隔,每条格式为 代码公式 → 中文公式(用中文变量名重写),只对公式左侧的结果变量用反引号包裹,右侧表达式不加反引号;没有则为空字符串。示例: `profit` = sell_price - buy_price → 利润 = 卖出价 - 买入价; `sharpe` = mean(returns) / std(returns) → 夏普比率 = 收益均值 / 收益标准差"}',
  '  ],',
  '  "callEdges": [["调用方函数名", "被调用函数名"]]',
  '}',
  '要求:',
  '- functions 与给出的清单一一对应:一个不能少、一个不能多,name 严格一致',
  '- 源码每行开头的“绝对行号|”只是定位标签,不是源码内容',
  '- flow 是数组,按执行顺序拆步骤;每个步骤的 start/end 必须直接引用源码行首标签中的绝对行号,范围位于函数体内、从小到大、不重叠;不得自行计数或估算;没有步骤则 flow 为空数组',
  '- flow 行号会被客户端直接用于源码映射,偏差 1 行也会映射错误;短函数可少拆,其余每步不超过函数有效代码行数的约 1/3',
  '- flow 写作风格:业务描述在前,代码标识符在后做注释。写"初始化全局配置`build_config`：从参数构建运行配置`config`，分配批次号`run_id`",不要写"调用 `build_config` 生成 `config`，生成 `run_id`"',
  ...FLOW_TEXT_RULES,
  '- flow 中每个步骤必须引用代码里真实出现的变量名/函数名,用反引号包裹;反引号只包裹标识符本身(如 `train_scorecards`),不带参数和括号',
  '- flow 步骤严禁泛泛写"遍历列表"而不指明遍历哪个变量',
  '- 严禁把正则原文(如 /^[...$/、re.compile("…"))写进解读文本,用自然语言描述匹配规则;不要输出含反斜杠的路径/转义序列',
  '- 解读要通俗,说人话,重点讲"数据怎么进、怎么流转、得到什么"',
  '- callEdges 只列本段代码里实际出现的调用关系,没有就为空数组',
].join('\n')

export function apply(ctx) {
  const fs = ctx.fs
  const message = (err) => String((err && err.message) || err)

  const MAX_BODY_BYTES = 1048576
  const readBody = async (req) => {
    const chunks = []
    let size = 0
    for await (const chunk of req) {
      size += chunk.length
      if (size > MAX_BODY_BYTES) throw new Error('request body too large')
      chunks.push(chunk)
    }
    return Buffer.concat(chunks).toString('utf8')
  }
  const send = (res, status, obj) => {
    // 客户端可能已断开(关页签/刷新):向已销毁的响应写入会抛错,直接吞掉
    if (!res || res.destroyed || res.writableEnded) return
    try {
      res.writeHead(status, {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      })
      res.end(JSON.stringify(obj))
    } catch { /* response gone — client already left */ }
  }
  const param = (req, key) => new URL(req.url ?? '/', 'http://x').searchParams.get(key)

  // 模型路由:优先 deepseek-v4-flash(解读不需要推理),未注册时回退
  // 默认选择,再回退第一个供应商/模型;失败不缓存,服务恢复后可重试
  let routePromise = null
  const resolveRoute = async () => {
    if (routePromise !== null) return routePromise
    routePromise = (async () => {
      const llm = ctx.get('llm')
      if (llm === undefined) throw new Error('llm 服务不可用')
      const PREFERRED = { provider: 'deepseek-official', model: 'deepseek-v4-flash' }
      try {
        if (llm.listModels) {
          const models = await llm.listModels(PREFERRED.provider)
          const hit = (models || []).find((m) => String(m.model || m.id || m.name) === PREFERRED.model)
          if (hit) return PREFERRED
        }
      } catch { /* provider not registered — fall through */ }
      const sel = ctx.get('agentDefaultModel')
      if (sel !== undefined && typeof sel.currentSelection === 'function') {
        try {
          const cur = sel.currentSelection()
          if (cur && cur.provider && cur.model) return { provider: cur.provider, model: cur.model }
        } catch { /* fall through */ }
      }
      const providers = llm.listProviders ? llm.listProviders() : []
      if (providers.length === 0) throw new Error('没有注册任何模型供应商')
      const p0 = providers[0]
      const provider = p0.provider || p0.id || p0.name || String(p0)
      if (llm.listModels) {
        const models = await llm.listModels(provider)
        const m0 = models && models[0]
        if (m0) return { provider, model: m0.model || m0.id || m0.name || String(m0) }
      }
      throw new Error('无法解析模型路由')
    })()
    // 失败不缓存:模型服务瞬断恢复后,下一次解读重试解析
    routePromise = routePromise.catch((err) => { routePromise = null; throw err })
    return routePromise
  }

  // 单次模型调用:手工消费原始流,本 bundle 无需任何运行时 import
  const LLM_CALL_TIMEOUT_MS = 120000
  const llmCall = async (system, userText, maxTokens, signal) => {
    const route = await resolveRoute()
    const llm = ctx.get('llm')
    const provider = route.provider
    const model = route.model
    // 上游挂起防护:120s 超时;signal 传给 stream,中断时停止迭代
    const timeoutSignal = typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
      ? AbortSignal.timeout(LLM_CALL_TIMEOUT_MS)
      : null
    const sig = signal || timeoutSignal
    let text = ''
    let finish = null
    for await (const chunk of llm.stream({
      provider,
      model,
      system,
      messages: [{
        id: 'cg-msg-1',
        role: 'user',
        content: [{ type: 'text', text: userText }],
        source: { kind: 'plugin', plugin: 'dsh-files' },
      }],
      maxTokens,
      temperature: 0.2,
      // 必须关思考:默认 reasoningEffort=max 的推理 token 会烧光输出预算
      reasoningEffort: 'off',
      signal: sig,
    })) {
      if (sig && sig.aborted) throw new Error('解读请求超时')
      if (chunk.type === 'text-delta') text += chunk.text
      else if (chunk.type === 'finish') finish = chunk
    }
    if (finish !== null && finish.reason && finish.reason.kind !== 'stop') {
      const f = finish.reason
      throw new Error('模型调用结束: ' + f.kind + (f && f.failure && f.failure.message ? ' - ' + f.failure.message : ''))
    }
    return { text, provider, model }
  }

  const parseJson = (raw) => {
    let s = String(raw).trim()
    const f = s.indexOf('{')
    const l = s.lastIndexOf('}')
    if (f >= 0 && l > f) s = s.slice(f, l + 1)
    // 报错时附带坏处前后 80 字符的原文片段
    const decorate = (err, src) => {
      const m = /position (\d+)/.exec(String(err.message))
      if (!m) return err
      const pos = Number(m[1])
      const snip = src.slice(Math.max(0, pos - 40), Math.min(src.length, pos + 40))
        .replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t')
      return new Error(err.message + ' ｜坏处上下文: …' + snip + '…')
    }
    try {
      return JSON.parse(s)
    } catch (err) {
      // 模型常输出坏转义(路径 \s、正则双重转义 \\s、反斜杠续行):
      // 按序修复并迭代消除到稳定(每轮至少少一个反斜杠,必收敛)
      let repaired = s
        .replace(/\\\r?\n/g, '\\n')
        .replace(/\\\t/g, '\\t')
        .replace(/\\u(?![0-9a-fA-F]{4})/g, 'u')
      let prev
      do {
        prev = repaired
        repaired = repaired.replace(/\\([^"\\\/bfnrtu])/g, '$1')
      } while (repaired !== prev)
      // 模型有时在解读文本中输出 Python 下标语法 spec["edges"],
      // 内层双引号会截断 JSON 字符串值;前缀必须是 \w 或 ],
      // 避免误伤合法 JSON 数组(数组 [ 前是 : 或 , 等非 \w 字符)
      repaired = repaired.replace(/([\w\]])\["([^"]{1,80})"\]/g, '$1[\\"$2\\"]')
      if (repaired === s) throw decorate(err, s)
      try {
        return JSON.parse(repaired)
      } catch (err2) {
        throw decorate(err2, repaired)
      }
    }
  }

  // 给模型的源码统一加绝对行号。标签只用于定位,真实源码与客户端仍保持原样。
  const numberedCode = (lines, from = 1, to = lines.length) => {
    const lo = Math.max(1, from)
    const hi = Math.min(lines.length, Math.max(lo, to))
    return lines.slice(lo - 1, hi).map((line, i) => (lo + i) + '| ' + line).join('\n')
  }

  // outline / explain 两阶段共用的 user 消息模板(全量与补全复用,避免漂移)
  const outlineUserText = (baseName, langHint, from, to, code) =>
    '完整文件名: ' + baseName + (langHint ? ' (语言/类型: ' + langHint + ')' : '')
    + '\n本段覆盖完整文件的第 ' + from + ' 行到第 ' + to + ' 行,行号请按完整文件计算。'
    + '\n\n```\n' + code + '\n```'
  const explainUserText = (baseName, langHint, listText, from, to, code) =>
    '完整文件名: ' + baseName + (langHint ? ' (语言/类型: ' + langHint + ')' : '')
    + '\n\n本段要解读的函数清单(必须一一对应):\n' + listText
    + '\n\n源代码片段(完整文件第 ' + from + ' 行到第 ' + to + ' 行):\n```\n' + code + '\n```'

  // callEdges → edgeSet 键(a\u0000b):只保留两端非空且互异的成对数组
  const collectEdges = (parsed, edgeSet) => {
    const edges = Array.isArray(parsed.callEdges) ? parsed.callEdges : []
    for (const e of edges) {
      if (Array.isArray(e) && e.length >= 2) {
        const a = String(e[0]).trim()
        const b = String(e[1]).trim()
        if (a && b && a !== b) edgeSet.add(a + '\u0000' + b)
      }
    }
  }

  // Phase 1:按窗口列出全部函数定义(名+绝对行号);失败结构化记录窗口
  // 范围,供「补全解读」精确重跑
  const outline = async (lines, baseName, langHint) => {
    const totalLines = lines.length
    const merged = []
    const seen = new Set()
    const failures = []
    let route = ''
    const jobs = []
    for (let start = 0; start < totalLines; start += OUTLINE_WINDOW) {
      jobs.push({ start, end: Math.min(start + OUTLINE_WINDOW, totalLines) })
    }
    for (const job of jobs) {
      try {
        const code = numberedCode(lines, job.start + 1, job.end)
        const { text, provider, model } = await llmCall(OUTLINE_PROMPT,
          outlineUserText(baseName, langHint, job.start + 1, job.end, code), OUTLINE_MAX_TOKENS)
        route = provider + '/' + model
        const parsed = parseJson(text)
        const fns = Array.isArray(parsed.functions) ? parsed.functions : []
        for (const f of fns) {
          const name = String((f && f.name) || '').trim()
          if (!name) continue
          const start = Math.max(1, Number(f && f.start) || 1)
          // okey = 名字#起始行:同名函数(多个类的 __init__)靠起始行区分,
          // 只压掉同一函数被重复报告;行号修正后 start 会变但 okey 不变,
          // 是跨阶段稳定标识,补全解读靠它原位写回
          const okey = name + '#' + start
          if (seen.has(okey)) continue
          seen.add(okey)
          merged.push({
            name,
            start,
            end: Math.max(1, Number(f && f.end) || 1),
            signature: String((f && f.signature) || ''),
            okey,
          })
        }
      } catch (err) {
        failures.push({
          phase: 'outline',
          from: job.start + 1,
          to: job.end,
          funcs: [],
          text: '第 ' + (job.start + 1) + ' 行起的函数清单失败: ' + message(err),
        })
      }
    }
    merged.sort((a, b) => a.start - b.start || a.end - b.end)
    return { functions: merged, route, failures }
  }

  // Phase 2:把 outline 函数按行跨度分组,每组一次模型调用解释
  const explain = async (lines, outlineFunctions, baseName, langHint) => {
    // 连续函数聚组,窗口行跨度受 EXPLAIN_WINDOW_SPAN 约束;超大函数独占一组
    const windows = []
    let group = []
    let minStart = null
    let maxEnd = null
    const flush = () => {
      if (group.length > 0) windows.push({ funcs: group, minStart, maxEnd })
      group = []
      minStart = null
      maxEnd = null
    }
    for (const f of outlineFunctions) {
      const span = f.end - f.start + 1
      const nextMin = minStart === null ? f.start : Math.min(minStart, f.start)
      const nextMax = maxEnd === null ? f.end : Math.max(maxEnd, f.end)
      if (group.length > 0 && (nextMax - nextMin + 1) > EXPLAIN_WINDOW_SPAN && span <= EXPLAIN_WINDOW_SPAN) {
        flush()
      }
      if (group.length === 0) { minStart = f.start; maxEnd = f.end } else { minStart = nextMin; maxEnd = nextMax }
      group.push(f)
    }
    flush()

    const explanations = new Map()
    const edgeSet = new Set()
    const failures = []
    // 单个窗口的一次完整调用(调用+解析+合并),失败即抛
    const runWindow = async (w, from, to, code, listText) => {
      const { text } = await llmCall(EXPLAIN_PROMPT,
        explainUserText(baseName, langHint, listText, from, to, code), EXPLAIN_MAX_TOKENS)
      const parsed = parseJson(text)
      const fns = Array.isArray(parsed.functions) ? parsed.functions : []
      // 窗口列了 N 个函数却返回空列表:模型没照做,按失败处理
      if (fns.length === 0 && w.funcs.length > 0) throw new Error('模型返回了空的函数解读列表')
      // 按清单序号一一对应(而不是按 name:同名函数必须各归各)
      for (let k = 0; k < fns.length && k < w.funcs.length; k++) {
        const wf = w.funcs[k]
        const f = fns[k]
        explanations.set(wf.okey, {
          summary: String((f && f.summary) || ''),
          // flow 保持原始值(新格式是数组),String() 强转会变 [object Object]
          flow: (f && f.flow) || '',
          formula: String((f && f.formula) || ''),
        })
      }
      collectEdges(parsed, edgeSet)
    }
    let cursor = 0
    const worker = async () => {
      while (cursor < windows.length) {
        const w = windows[cursor]
        cursor++
        const from = Math.max(1, w.minStart - 2)
        const to = Math.min(lines.length, w.maxEnd + 2)
        const code = numberedCode(lines, from, to)
        const listText = w.funcs.map((f) => '- ' + f.name + ' (第 ' + f.start + ' – ' + f.end + ' 行)').join('\n')
        try {
          await runWindow(w, from, to, code, listText)
        } catch (err) {
          // 不自动重试:重试会把第二次 LLM 调用塞进首轮关键路径,拖慢整个
          // 响应;首轮快速返回,失败组交给用户点「补全解读」只补失败组
          failures.push({
            phase: 'explain',
            from,
            to,
            funcs: w.funcs,
            text: '第 ' + from + ' 行起的一组函数解读失败: ' + message(err),
          })
        }
      }
    }
    await Promise.all(Array.from({ length: Math.min(EXPLAIN_CONCURRENCY, windows.length) }, () => worker()))

    const functions = outlineFunctions.map((f) => {
      const e = explanations.get(f.okey)
      return {
        name: f.name,
        start: f.start,
        end: f.end,
        signature: f.signature || '',
        okey: f.okey,
        summary: e ? e.summary : '',
        flow: e ? e.flow : '',
        formula: e ? e.formula : '',
      }
    })
    return { functions, edgeSet, failures, windows: windows.length }
  }

  // 小/中脚本单次调用:输出与源码函数严格 1:1
  const analyzeSingle = async (lines, baseName, langHint) => {
    const code = numberedCode(lines)
    const userText = '完整文件名: ' + baseName + (langHint ? ' (语言/类型: ' + langHint + ')' : '')
      + '\n\n```\n' + code + '\n```'
    const { text, provider, model } = await llmCall(SINGLE_PROMPT, userText, SINGLE_CALL_MAX_TOKENS)
    const parsed = parseJson(text)
    const fns = Array.isArray(parsed.functions) ? parsed.functions : []
    const seen = new Set()
    const functions = []
    for (const f of fns) {
      const name = String((f && f.name) || '').trim()
      if (!name) continue
      const start = Math.max(1, Number(f && f.start) || 1)
      const okey = name + '#' + start
      if (seen.has(okey)) continue
      seen.add(okey)
      functions.push({
        name,
        start,
        end: Math.max(1, Number(f && f.end) || 1),
        signature: String((f && f.signature) || ''),
        summary: String((f && f.summary) || ''),
        // flow 保持原始值(新格式为数组),严禁 String() 强转
        flow: (f && f.flow) || '',
        formula: String((f && f.formula) || ''),
        okey,
      })
    }
    functions.sort((a, b) => a.start - b.start || a.end - b.end)
    // An empty function list on a code file means the model didn't follow
    // through — treat it as a failure so the caller falls back / warns.
    if (functions.length === 0) throw new Error('模型未识别到任何函数')
    const edgeSet = new Set()
    collectEdges(parsed, edgeSet)
    return {
      functions,
      edgeSet,
      failures: [],
      chunks: 1,
      route: provider + '/' + model,
    }
  }

  // Chunked fallback for large scripts: outline + grouped explanation.
  const analyzeChunked = async (lines, baseName, langHint) => {
    const outlineRes = await outline(lines, baseName, langHint)
    // Outline 行号决定 Explain 截取范围,必须先确定性校正,避免错误范围
    // 让第二阶段看到错误代码片段。okey 保持不变,继续作为跨阶段稳定键。
    correctRanges(outlineRes.functions, lines, langHint)
    const explainRes = await explain(lines, outlineRes.functions, baseName, langHint)
    return {
      functions: explainRes.functions,
      edgeSet: explainRes.edgeSet,
      failures: outlineRes.failures.concat(explainRes.failures),
      chunks: explainRes.windows,
      route: outlineRes.route || 'unknown',
    }
  }

  // 确定性调用边扫描:函数体内出现"已知函数名("即记为调用,补全模型漏报
  // 的边(如 main → _load_main_module)。纯文本扫描,不再调模型
  const scanEdges = (functions, lines) => {
    const edges = new Set()
    const names = (functions || []).map((f) => f.name).filter((n) => n && n.length >= 2)
    if (names.length < 2) return edges
    // 只扫图上渲染的函数名(MAX_GRAPH_NODES)并合成一个正则:每个函数体只
    // 扫一遍,避免"每个 caller × 每个 callee"的 O(N²×L) 全文件扫描
    const visible = names.slice(0, MAX_GRAPH_NODES)
    const re = new RegExp(
      '(?<![A-Za-z0-9_$])(' + visible.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\s*\\(',
      'g'
    )
    // 函数体 = [本函数起始行, 下一函数起始行)(起始行已签名修正),
    // 不依赖模型猜的结束行;单个函数体上限 2000 行
    for (let ci = 0; ci < functions.length; ci++) {
      const caller = functions[ci]
      const nextStart = ci + 1 < functions.length ? functions[ci + 1].start : lines.length + 1
      const from = Math.max(1, caller.start)
      const to = Math.min(lines.length, nextStart - 1, caller.start + 2000)
      if (to < from) continue
      const body = lines.slice(from - 1, to).join('\n')
      re.lastIndex = 0
      let m
      while ((m = re.exec(body)) !== null) {
        const callee = m[1]
        if (callee !== caller.name) edges.add(caller.name + '\u0000' + callee)
      }
    }
    return edges
  }

  const buildCallGraph = (functions, edgeSet) => {
    const known = new Set((functions || []).map((f) => f.name))
    // 节点:渲染全部函数(孤立函数也显示),上限 MAX_GRAPH_NODES
    const nodeNames = (functions || []).map((f) => f.name).slice(0, MAX_GRAPH_NODES)
    if (nodeNames.length === 0) return ''
    // 边:只保留两端都是当前脚本函数的调用关系
    const edges = Array.from(edgeSet)
      .filter((key) => {
        const [a, b] = key.split('\u0000')
        return known.has(a) && known.has(b)
      })
      .slice(0, MAX_GRAPH_EDGES)
    const nodeIds = new Map()
    const rows = ['flowchart LR']
    const cleanLabel = (s) => String(s)
      .replace(/\r?\n/g, ' ')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/#/g, '&#35;')
      .replace(/"/g, "'")
    for (const name of nodeNames) {
      const id = 'n' + (nodeIds.size + 1)
      nodeIds.set(name, id)
      rows.push('  ' + id + '["' + cleanLabel(name) + '"]')
    }
    for (const key of edges) {
      const [a, b] = key.split('\u0000')
      if (nodeIds.has(a) && nodeIds.has(b)) rows.push('  ' + nodeIds.get(a) + ' --> ' + nodeIds.get(b))
    }
    return rows.join('\n')
  }

  // 内容是否像源代码的粗判(全空时给出可操作提示用)
  const looksLikeCode = (content) => {
    const head = content.slice(0, 200000)
    const markers = [
      /\bdef\s+[A-Za-z_]\w*\s*\(/,                                    // python
      /\bclass\s+[A-Za-z_]\w*\s*[:({]/,                               // python / js / java ...
      /\bfunction\s+[A-Za-z_$]\w*\s*\(/,                              // js / php ...
      /\basync\s+function\b/,
      /(^|\n)\s*(public|private|protected|static)\s+[A-Za-z_<>\w[\],\s]*\s+[A-Za-z_]\w*\s*\(/, // java / c# / c
      /=>\s*\{/,
      /\bconst\s+[A-Za-z_$]\w*\s*=\s*(async\s*)?\(/,                  // js arrow
      /\bimport\s+(react|numpy|pandas|torch|os|sys|pathlib|\{)/,      // imports
      /^\s*(from\s+[\w.]+\s+import|package\s+[\w.]+|#include|using\s+namespace)/m,
    ]
    return markers.some((re) => re.test(head))
  }

  // 行号校正:模型数行不准,用签名(去空白)反查真实起始行;Python 的结束行
  // 按缩进规则推导(缩进回到 def 行层级即结束),花括号语言按括号配对。
  // Python 优先按函数名定位真实 def；其他语言以签名首行定位。装饰器向上
  // 吸收连续 @ 行,避免把多行签名的参数续行误当成函数起点。
  const correctRanges = (functions, lines, langHint) => {
    const norm = (s) => String(s).replace(/\s+/g, '')
    const normLines = lines.map(norm)

    // Python def 预扫描索引:{函数名 → [行号, ...]}
    // signature 匹配全部失败时按函数名直接查表,比全文件正则快且准
    const defIndex = new Map()
    const defLineRe = /^\s*(?:async\s+)?def\s+([A-Za-z_]\w*)\s*\(/
    const fnLineRe = /^\s*(?:async\s+)?function\*?\s+([A-Za-z_$]\w*)\s*\(/
    for (let i = 0; i < lines.length; i++) {
      const dm = defLineRe.exec(lines[i]) || fnLineRe.exec(lines[i])
      if (!dm) continue
      const n = dm[1]
      if (!defIndex.has(n)) defIndex.set(n, [])
      defIndex.get(n).push(i + 1)
    }

    // 搜索半径与文件大小挂钩:小文件 ±30,大文件按 10% 总行数,上限 ±120
    const searchRadius = Math.min(Math.max(30, Math.floor(lines.length * 0.1)), 120)
    const isPython = langHint === 'py' || langHint === 'pyw'
      || /^\s*def\s/m.test(lines.slice(0, Math.min(200, lines.length)).join('\n'))

    const baseNameOf = (f) => f.name && f.name.includes('.') ? f.name.split('.').pop() : f.name
    const pickClosest = (candidates, f) => {
      let best = -1
      let bestDist = Infinity
      for (const i of candidates || []) {
        const dist = Math.abs(i - f.start)
        if (dist < bestDist) { best = i; bestDist = dist }
      }
      return best
    }

    // 最近未占用候选选择器(签名回退 / 函数名兜底共用)
    const pickNearest = (candidates, f) => {
      let best = -1
      let bestDist = Infinity
      let bestOcc = 1
      for (const i of candidates) {
        const occupied = functions.some((g) => g !== f && i > g.start && i <= g.end)
        const dist = Math.abs(i - f.start)
        const occ = occupied ? 1 : 0
        if (occ < bestOcc || (occ === bestOcc && dist < bestDist)) { best = i; bestDist = dist; bestOcc = occ }
      }
      return best
    }

    for (const f of functions) {
      let found = -1
      const baseName = baseNameOf(f)

      // Python 的 def 行可从源码确定,优先级必须高于模型返回的 signature。
      // 多行签名的最后一行只是续行,不能作为函数起点。
      if (isPython && baseName) {
        const candidates = defIndex.get(baseName)
        if (candidates && candidates.length > 0) found = pickClosest(candidates, f)
      }

      // ── 阶段 A:签名锚定(原始逻辑,窗口动态化) ──
      if (found === -1 && f.signature) {
        const sigAll = String(f.signature).split('\n').map((x) => norm(x)).filter((x) => x.length >= 4)
        if (sigAll.length > 0) {
          // 首行才是定义/装饰器起点；末行在多行签名中通常只是参数续行。
          const anchor = sigAll[0]

          // A1:动态窗口局部搜索
          const lo = Math.max(1, f.start - searchRadius)
          const hi = Math.min(lines.length, f.start + searchRadius)
          for (let i = lo; i <= hi; i++) {
            if (normLines[i - 1].startsWith(anchor)) { found = i; break }
          }

          // A2:全文件 startsWith 回退
          if (found === -1) {
            const hits = []
            for (let i = 1; i <= lines.length; i++) {
              if (normLines[i - 1].startsWith(anchor)) hits.push(i)
            }
            found = pickNearest(hits, f)
          }

          // A3:全文件 includes 子串模糊匹配(anchor 被截断时兜底)
          if (found === -1 && anchor.length >= 12) {
            const hits = []
            for (let i = 1; i <= lines.length; i++) {
              if (normLines[i - 1].includes(anchor)) hits.push(i)
            }
            found = pickNearest(hits, f)
          }
        }
      }

      // ── 阶段 B:函数名兜底(signature 为空/失效时仍有修正能力) ──
      if (found === -1 && f.name) {
        const candidates = defIndex.get(baseName)
        if (candidates && candidates.length > 0) {
          found = pickNearest(candidates, f)
        }
        if (found === -1) {
          const nameEsc = baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const nameRe = new RegExp('^\\s*(?:async\\s+)?(?:def|function\\*?|class)\\s+' + nameEsc + '\\b')
          const hits = []
          for (let i = 1; i <= lines.length; i++) {
            if (nameRe.test(lines[i - 1])) hits.push(i)
          }
          found = pickNearest(hits, f)
        }
      }

      if (found > 0) {
        let s = found
        while (s > 1 && /^\s*@/.test(lines[s - 2])) s--
        f.start = s
      }
      if (f.end < f.start) f.end = f.start
    }
    functions.sort((a, b) => a.start - b.start || a.end - b.end)
    if (isPython) {
      // 缩进规则:缩进回到 def 行层级即函数结束;start 可能是装饰器行,
      // 缩进基准必须取 def 行本身
      const pythonMeta = new Map()
      for (const f of functions) {
        let defIdx = -1
        for (let k = f.start; k <= Math.min(lines.length, f.start + 20); k++) {
          if (/^\s*(?:async\s+)?def\s/.test(lines[k - 1])) { defIdx = k; break }
        }
        if (defIdx < 0) continue
        const dm = /^(\s*)/.exec(lines[defIdx - 1])
        const defIndent = dm ? dm[1].length : 0
        pythonMeta.set(f, { defIdx, defIndent })
        let lastContent = defIdx
        // 三引号字符串跨行时中间行常顶格:顶格行不能算"缩进回到基级",
        // 否则函数体被提前截断
        let inTriple = null
        for (let ln = defIdx + 1; ln <= lines.length; ln++) {
          const line = lines[ln - 1]
          if (inTriple) {
            const closeIdx = line.indexOf(inTriple)
            if (closeIdx >= 0) {
              inTriple = null
              lastContent = ln
              if (line.slice(closeIdx + 3).trim() === '') continue // 同一行闭合后还有内容:继续按缩进判断
            } else {
              lastContent = ln
              continue
            }
          }
          if (/^\s*$/.test(line)) continue
          if (/^\s*[)\]},]+/.test(line)) {
            // 续行收尾符不表示函数结束,但它仍属于函数体。
            const closeIndent = /^(\s*)/.exec(line)[1].length
            if (closeIndent > defIndent) lastContent = ln
            continue
          }
          const indent = /^(\s*)/.exec(line)[1].length
          const triple = /('''|""")/.exec(line)
          if (triple) {
            if (indent <= defIndent) break // 顶格代码行(即使含三引号):函数结束
            const rest = line.slice(triple.index + 3)
            if (rest.indexOf(triple[1]) < 0) inTriple = triple[1]
            lastContent = ln
            continue
          }
          if (indent <= defIndent) break
          lastContent = ln
        }
        if (lastContent >= f.start) f.end = lastContent
      }
      // 合法嵌套函数的缩进更深,允许区间包含；相同缩进的兄弟函数绝不
      // 应重叠,即使某个模型 end 异常也在这里确定性截断。
      const previousAtIndent = new Map()
      for (const cur of functions) {
        const cm = pythonMeta.get(cur)
        if (!cm) continue
        const prev = previousAtIndent.get(cm.defIndent)
        if (prev && prev.end >= cur.start) prev.end = Math.max(prev.start, cur.start - 1)
        previousAtIndent.set(cm.defIndent, cur)
      }

      // 保存到本次 correctRanges 的后置校验使用,不暴露到客户端。
      for (const [f, meta] of pythonMeta) f._pythonDefIndent = meta.defIndent
    } else {
      // 花括号语言:签名括号闭合处(paren=0)的 { 为函数体起点,再做花括号
      // 配对算结束行(剥离字符串/注释干扰);无花括号形式保持模型给的 end。
      // 若某行扫完括号已闭合却仍无 {,是单行箭头函数等,立即放弃,避免误配
      const bodyBraceLine = (fromLine) => {
        // start 可能被上收到装饰器行(@ 开头):先跳过,否则首行 paren=0
        // 且无 { 会被误判为"无花括号形式"整体放弃配对
        let first = fromLine
        while (first <= Math.min(lines.length, fromLine + 30) && /^\s*@/.test(lines[first - 1])) first++
        let paren = 0
        // 字符串/块注释跨行保持,否则第二行起的 { ( 会被当成代码计入配对
        let inStr = null
        let inBlock = false
        for (let ln = first; ln <= Math.min(lines.length, fromLine + 30); ln++) {
          const line = lines[ln - 1]
          for (let i = 0; i < line.length; i++) {
            const ch = line[i]
            const nx = line[i + 1]
            if (inBlock) {
              if (ch === '*' && nx === '/') { inBlock = false; i++; continue }
              continue
            }
            if (inStr) {
              if (ch === '\\') { i++; continue }
              if (ch === inStr) inStr = null
              continue
            }
            if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue }
            if (ch === '/' && nx === '/') break // 行注释
            if (ch === '/' && nx === '*') { inBlock = true; i++; continue }
            if (ch === '(') paren++
            else if (ch === ')') paren = Math.max(0, paren - 1)
            else if (ch === '{' && paren === 0) return ln
          }
          if (paren === 0) return 0
        }
        return 0
      }
      const braceEndLine = (braceLine) => {
        let depth = 0
        let inBlock = false
        let inStr = null
        for (let ln = braceLine; ln <= lines.length; ln++) {
          const line = lines[ln - 1]
          for (let i = 0; i < line.length; i++) {
            const ch = line[i]
            const nx = line[i + 1]
            if (inBlock) {
              if (ch === '*' && nx === '/') { inBlock = false; i++; continue }
              continue
            }
            if (inStr) {
              if (ch === '\\') { i++; continue }
              if (ch === inStr) inStr = null
              continue
            }
            if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue }
            if (ch === '/' && nx === '/') break // 行注释
            if (ch === '/' && nx === '*') { inBlock = true; i++; continue }
            if (ch === '{') depth++
            else if (ch === '}') {
              depth--
              if (depth === 0) return ln
            }
          }
        }
        return 0
      }
      for (const f of functions) {
        const brace = bodyBraceLine(f.start)
        if (brace <= 0) continue
        const end = braceEndLine(brace)
        if (end > 0 && end >= f.start) f.end = end
      }
      // 重叠修正兜底:函数区间不得越过下一个函数起点
      for (let i = 1; i < functions.length; i++) {
        const prev = functions[i - 1]
        const cur = functions[i]
        if (prev.end >= cur.start) prev.end = Math.max(cur.start - 1, prev.start)
      }
    }
    // 后置校验:检测 start 落在另一个函数体内部(典型场景:模型把提取出
    // 的公共函数 window_nav 行号标在了 backtest 体内的相似代码段)。
    // 发现后在 container.end 之后重新搜索同名 def/function 定义行
    functions.sort((a, b) => a.start - b.start || a.end - b.end)
    for (const f of functions) {
      const container = functions.find((g) => g !== f && f.start > g.start && f.start <= g.end)
      if (!container) continue
      // Python 中更深缩进代表合法嵌套函数,不能当作错误位置搬走。
      if (isPython && Number.isFinite(f._pythonDefIndent) && Number.isFinite(container._pythonDefIndent)
        && f._pythonDefIndent > container._pythonDefIndent) continue
      const baseName = f.name.includes('.') ? f.name.split('.').pop() : f.name
      const nameEsc = baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const nameRe = new RegExp('^\\s*(?:async\\s+)?(?:def|function\\*?|class)\\s+' + nameEsc + '\\b')
      let relocated = -1
      for (let i = container.end + 1; i <= lines.length; i++) {
        if (nameRe.test(lines[i - 1])) { relocated = i; break }
      }
      if (relocated > 0) {
        let s = relocated
        while (s > 1 && /^\s*@/.test(lines[s - 2])) s--
        f.start = s
        if (f.end < f.start) f.end = f.start
      }
    }
    for (const f of functions) delete f._pythonDefIndent
    functions.sort((a, b) => a.start - b.start || a.end - b.end)
    return functions
  }

  // 步骤流归一:保留模型从绝对行号标签读取的范围,只做类型转换、
  // 函数区间裁剪和无效值过滤。不得再按函数 start 的误差整体平移。
  const normalizeFlowSteps = (functions) => {
    const stepTextOf = (s) => {
      if (typeof s === 'string') {
        const t = s.trim()
        return t.includes('[object Object]') ? '' : t
      }
      if (Array.isArray(s)) return s.map((x) => stepTextOf(x)).filter(Boolean).join('；')
      if (!s || typeof s !== 'object') return ''
      return stepTextOf(s.text || s.step || s.desc || s.description || s.content)
    }
    for (const f of functions) {
      const raw = f.flow
      if (!Array.isArray(raw)) { f.flowSteps = null; continue }
      const steps = raw
        .map((s) => ({
          start: Math.round(Number(s && s.start)),
          end: Math.round(Number(s && s.end)),
          text: stepTextOf(s),
        }))
        .filter((s) => s.text && Number.isFinite(s.start) && Number.isFinite(s.end))
        .filter((s) => s.start <= f.end && s.end >= f.start)
        .map((s) => ({
          start: Math.min(Math.max(s.start, f.start), f.end),
          end: Math.min(Math.max(s.end, f.start), f.end),
          text: s.text,
        }))
        .filter((s) => s.end >= s.start)
        .sort((a, b) => a.start - b.start || a.end - b.end)
      const out = []
      for (const s of steps) {
        const prev = out[out.length - 1]
        if (prev && s.start <= prev.end) {
          // 保留后一步的显式起点,仅收窄前一步的重叠尾部；同起点无法
          // 无损拆分时保留先到步骤,避免把多个步骤挤到函数末行。
          if (s.start <= prev.start) continue
          prev.end = s.start - 1
        }
        out.push(s)
      }
      if (out.length > 0) f.flowSteps = out
      else { f.flowSteps = null; f.flow = '' }
    }
    return functions
  }

  // 最终范围校验:步骤必须位于实际函数体代码区。保留显式 start/end,
  // 不按 token 重定位、不填补间隙、不把最后一步强行延伸到函数末尾。
  const anchorFlowSteps = (functions, lines) => {
    const findCodeStart = (f) => {
      let ln = f.start
      while (ln <= f.end && /^\s*@/.test(lines[ln - 1])) ln++
      let parenDepth = 0
      let pastSig = false
      const sigLimit = Math.min(f.end, ln + 30)
      for (; ln <= sigLimit; ln++) {
        const line = lines[ln - 1]
        for (let i = 0; i < line.length; i++) {
          const ch = line[i]
          if (ch === '#') break
          if (ch === '/' && line[i + 1] === '/') break
          if (ch === '(' || ch === '[') parenDepth++
          else if (ch === ')' || ch === ']') parenDepth = Math.max(0, parenDepth - 1)
          else if (parenDepth === 0 && (ch === ':' || ch === '{')) pastSig = true
        }
        if (pastSig) { ln++; break }
      }
      if (!pastSig) return f.start
      if (ln <= f.end) {
        const trimmed = lines[ln - 1].trim()
        let tq = null
        if (trimmed.startsWith('"""')) tq = '"""'
        else if (trimmed.startsWith("'''")) tq = "'''"
        if (tq) {
          const rest = trimmed.slice(3)
          if (rest.indexOf(tq) >= 0) {
            ln++
          } else {
            for (ln++; ln <= f.end; ln++) {
              if (lines[ln - 1].includes(tq)) { ln++; break }
            }
          }
        }
      }
      return Math.min(ln, f.end)
    }
    for (const f of functions) {
      const steps = f.flowSteps
      if (!Array.isArray(steps) || steps.length === 0) continue
      const codeStart = findCodeStart(f)
      const out = []
      for (const st of steps) {
        const start = Math.max(st.start, codeStart)
        const end = Math.min(st.end, f.end)
        if (start > end) continue
        const prev = out[out.length - 1]
        if (prev && start <= prev.end) {
          if (start <= prev.start) continue
          prev.end = start - 1
        }
        out.push({ start, end, text: st.text })
      }
      if (out.length > 0) f.flowSteps = out
      else { f.flowSteps = null; f.flow = '' }
    }
    return functions
  }

  // path -> { mtime, data } in-memory explanation cache
  const cache = new Map()

  let registered = false
  const registerWeb = () => {
    if (registered) return
    const webServer = ctx.get('webServer') ?? ctx.get('httpServer')
    if (webServer === undefined) return
    registered = true
    const route = (path, handler) => {
      ctx.effect(() => webServer.register({ kind: 'exact', path, handler }), 'dsh-files: ' + path)
    }

    // 工作区包含校验:客户端显式携带 root(工作区根),目标路径必须在 root
    // 之内;缺 root 或越界一律 403,../ 穿越与任意绝对路径同一条规则挡住
    const normKey = (s) => String(s || '').replace(/\\/g, '/').replace(/\/+$/, '')
    const insideRoot = async (rootPath, target) => {
      if (!rootPath) return false
      try {
        const rt = await fs.resolve(rootPath)
        const rk = normKey(rt.targetKey)
        const key = normKey(target.targetKey)
        if (!rk || !key) return false
        return key === rk || key.startsWith(rk + '/')
      } catch {
        return false
      }
    }

    route('/plugins/dsh-files/list', async (req, res) => {
      const path = param(req, 'path')
      const root = param(req, 'root')
      if (!path || !root) {
        send(res, 400, { error: 'missing path/root' })
        return
      }
      try {
        const target = await fs.resolve(path)
        if (!(await insideRoot(root, target))) {
          send(res, 403, { error: 'outside-workspace' })
          return
        }
        const info = await fs.stat(target)
        if (info === undefined || info.type !== 'directory') {
          send(res, 404, { error: 'not-a-directory' })
          return
        }
        const dirKey = normKey(target.targetKey)
        const seenDirs = new Set()
        const entries = (await fs.listDir(target)).filter((e) => {
          if (e.type !== 'directory') return true
          // 符号链接目录指向自身/祖先会成环:不展示;同目标多链接只留一个
          const key = normKey(e.target && e.target.targetKey)
          if (!key) return true
          if (key === dirKey || dirKey.startsWith(key + '/')) return false
          if (seenDirs.has(key)) return false
          seenDirs.add(key)
          return true
        })
        send(res, 200, {
          entries: entries.map((e) => ({
            name: e.name,
            type: e.type,
            size: typeof e.size === 'number' ? e.size : null,
            path: fs.processPath(e.target),
          })),
        })
      } catch (err) {
        send(res, 500, { error: message(err) })
      }
    })

    // 纯文本读文件:源码窗直接即时加载,不涉及 LLM;解读端点完全并行
    route('/plugins/dsh-files/read', async (req, res) => {
      const path = param(req, 'path')
      const root = param(req, 'root')
      if (!path || !root) {
        send(res, 400, { error: 'missing path/root' })
        return
      }
      let size = 0
      try {
        const target = await fs.resolve(path)
        if (!(await insideRoot(root, target))) {
          send(res, 403, { error: 'outside-workspace' })
          return
        }
        const info = await fs.stat(target)
        if (info === undefined) {
          send(res, 404, { error: 'not-found' })
          return
        }
        if (info.type !== 'file') {
          send(res, 400, { error: 'not-a-file' })
          return
        }
        size = typeof info.size === 'number' ? info.size : 0
        if (size > MAX_EXPLAIN_BYTES) {
          // 大文件先探测前 8KB 判二进制(zip/rar 等通常超限)
          if (typeof fs.readBytes === 'function') {
            try {
              const head = await fs.readBytes(target, undefined, 8192)
              if (head.includes(0)) {
                send(res, 200, { binary: true, size })
                return
              }
            } catch { /* 探测失败:按原路径返回 tooLarge */ }
          }
          send(res, 200, { tooLarge: true, size })
          return
        }
        const content = await fs.readText(target)
        if (content.indexOf('\u0000') >= 0) {
          send(res, 200, { binary: true, size })
          return
        }
        send(res, 200, { content, size })
      } catch (err) {
        // 二进制/非 UTF-8(FS_NOT_TEXT)是"无法预览",不是错误
        if (err && err.code === 'FS_NOT_TEXT') {
          send(res, 200, { binary: true, size })
          return
        }
        send(res, 500, { error: message(err) })
      }
    })

    // 文件名搜索:按名递归匹配(限节点/结果数),目录跳过 .git/node_modules
    route('/plugins/dsh-files/search', async (req, res) => {
      const root = param(req, 'root')
      const query = String(param(req, 'q') || '').toLowerCase().trim()
      if (!root || !query) {
        send(res, 200, { matches: [], truncated: false })
        return
      }
      try {
        const maxNodes = 4000
        const maxMatches = 300
        let nodes = 0
        const matches = []
        const stack = [root]
        let truncated = false
        let rk = ''
        try { const rt = await fs.resolve(root); rk = normKey(rt.targetKey) } catch { rk = '' }
        while (stack.length > 0 && nodes < maxNodes && matches.length < maxMatches) {
          const dir = stack.pop()
          let target
          try { target = await fs.resolve(dir) } catch { continue }
          const key = normKey(target.targetKey)
          if (!rk || !key || !(key === rk || key.startsWith(rk + '/'))) continue
          let entries
          try { entries = await fs.listDir(target) } catch { continue }
          nodes += entries.length
          for (const e of entries) {
            const p = fs.processPath(e.target)
            if (e.type === 'directory') {
              if (e.name === '.git' || e.name === 'node_modules') continue
              stack.push(p)
              if (e.name.toLowerCase().includes(query)) matches.push({ name: e.name, path: p, type: 'directory', size: null })
            } else if (e.name.toLowerCase().includes(query)) {
              matches.push({ name: e.name, path: p, type: e.type, size: typeof e.size === 'number' ? e.size : null })
            }
          }
        }
        if (nodes >= maxNodes || matches.length >= maxMatches) truncated = true
        send(res, 200, { matches, truncated })
      } catch (err) {
        send(res, 500, { error: message(err) })
      }
    })

    // 图片/PDF 预览:按扩展名返回原始字节流(<img>/<iframe> 直接加载);
    // 文本读取会拒绝二进制文件,必须走这里
    const RAW_MIME = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
      gif: 'image/gif',
      svg: 'image/svg+xml',
      pdf: 'application/pdf',
    }
    route('/plugins/dsh-files/raw', async (req, res) => {
      const path = param(req, 'path')
      const root = param(req, 'root')
      if (!path || !root) {
        send(res, 400, { error: 'missing path/root' })
        return
      }
      try {
        const target = await fs.resolve(path)
        if (!(await insideRoot(root, target))) {
          send(res, 403, { error: 'outside-workspace' })
          return
        }
        const info = await fs.stat(target)
        if (info === undefined) {
          send(res, 404, { error: 'not-found' })
          return
        }
        if (info.type !== 'file') {
          send(res, 400, { error: 'not-a-file' })
          return
        }
        const ext = path.includes('.') ? path.slice(path.lastIndexOf('.') + 1).toLowerCase() : ''
        const mime = RAW_MIME[ext] || 'application/octet-stream'
        if (typeof fs.readBytes !== 'function') {
          send(res, 501, { error: 'fs backend 不支持字节读取' })
          return
        }
        const bytes = await fs.readBytes(target, undefined, MAX_RAW_BYTES)
        if (res.destroyed || res.writableEnded) return
        res.writeHead(200, {
          'content-type': mime,
          'content-length': String(bytes.length),
          'cache-control': 'no-store',
        })
        res.end(bytes)
      } catch (err) {
        send(res, 500, { error: message(err) })
      }
    })

    route('/plugins/dsh-files/explain', async (req, res) => {
      if (req.method !== 'POST') {
        send(res, 405, { error: 'use POST' })
        return
      }
      let body
      try {
        body = JSON.parse(await readBody(req))
      } catch {
        send(res, 400, { error: 'bad-json' })
        return
      }
      const path = String((body && body.path) || '')
      const root = String((body && body.root) || '')
      if (!path || !root) {
        send(res, 400, { error: 'missing path/root' })
        return
      }
      try {
        const target = await fs.resolve(path)
        if (!(await insideRoot(root, target))) {
          send(res, 403, { error: 'outside-workspace' })
          return
        }
        const info = await fs.stat(target)
        if (info === undefined) {
          send(res, 404, { error: 'not-found' })
          return
        }
        if (info.type !== 'file') {
          send(res, 400, { error: 'not-a-file' })
          return
        }
        const size = typeof info.size === 'number' ? info.size : 0
        if (size > MAX_EXPLAIN_BYTES) {
          send(res, 200, { tooLarge: true, size })
          return
        }
        const content = await fs.readText(target)
        const mtime = typeof info.mtimeMs === 'number' ? info.mtimeMs : (info.mtime ?? 0)
        if (content.indexOf('\u0000') >= 0) {
          send(res, 200, { binary: true, size })
          return
        }
        // 命中缓存直接返回(缓存值可能是 data 或 in-flight promise);
        // retry 请求不直接吃缓存,继续走下面的补全分支
        const hit = cache.get(path)
        if (hit && hit.mtime === mtime && hit.size === size && !body.refresh && !body.retry) {
          const data = hit.promise ? await hit.promise : hit.data
          send(res, 200, data)
          return
        }
        // 同一文件并发解读去重:共享同一个 in-flight promise,
        // 避免双页签/重复点击双倍烧 token(mtime 一致才算同一版文件)
        const pending = hit && hit.mtime === mtime && hit.promise ? hit.promise : null
        if (pending !== null) {
          const data = await pending
          send(res, 200, data)
          return
        }
        const baseName = path.split(/[\\/]/).pop()
        const langHint = path.includes('.') ? path.slice(path.lastIndexOf('.') + 1).toLowerCase() : ''
        const lines = content.replace(/\r\n/g, '\n').split('\n')

        // 组装客户端负载:内部稳定标识 okey 剥离后以 id 暴露,客户端 React
        // 用 id 做 key,补全合并时已渲染卡片原地更新不重挂
        const finishData = (functions, edgeSet, infoWarnings, failures, chunks, route) => {
          const callGraph = buildCallGraph(functions, edgeSet)
          const strip = (f) => {
            const out = {
              id: f.okey,
              name: f.name,
              start: f.start,
              end: f.end,
              signature: f.signature || '',
              summary: f.summary,
              flow: f.flow,
              formula: f.formula,
            }
            if (Array.isArray(f.flowSteps)) out.flowSteps = f.flowSteps // 锚定后的步骤,客户端优先读
            return out
          }
          return {
            path,
            functions: functions.map(strip),
            callGraph,
            warnings: infoWarnings,
            failedGroups: failures.map((g) => ({
              phase: g.phase,
              from: g.from,
              to: g.to,
              funcs: (g.funcs || []).map(strip),
              text: g.text,
            })),
            chunks,
            model: route || 'unknown',
          }
        }

        // 定向补全:只重跑失败窗口。outline 失败 → 重跑清单窗口并补解读
        // 新函数;explain 失败 → 重跑窗口按 okey 原位写回。完成后重跑
        // 确定性流水线(行号修正/步骤锚定/调用边/调用图)
        const retryFailed = async (hitEntry, retryLines, retryBase, retryHint) => {
          const ctx = hitEntry.ctx
          const funcs = ctx.functions
          const edgeSet = new Set(ctx.edgeSet)
          const outlineJobs = ctx.failures.filter((g) => g.phase === 'outline')
          const explainJobs = ctx.failures.filter((g) => g.phase === 'explain')
          const remaining = []
          const byKey = new Map(funcs.map((f) => [f.okey, f]))

          for (const g of outlineJobs) {
            const from = Math.min(Math.max(1, g.from), retryLines.length)
            const to = Math.min(Math.max(from, g.to), retryLines.length)
            try {
              const code = numberedCode(retryLines, from, to)
              const { text } = await llmCall(OUTLINE_PROMPT,
                outlineUserText(retryBase, retryHint, from, to, code), OUTLINE_MAX_TOKENS)
              const parsed = parseJson(text)
              const existing = new Set(funcs.map((f) => f.okey))
              const fresh = []
              for (const f of (Array.isArray(parsed.functions) ? parsed.functions : [])) {
                const name = String((f && f.name) || '').trim()
                if (!name) continue
                const start = Math.max(1, Number(f && f.start) || 1)
                const okey = name + '#' + start
                if (existing.has(okey)) continue
                existing.add(okey)
                fresh.push({
                  name,
                  start,
                  end: Math.max(1, Number(f && f.end) || 1),
                  signature: String((f && f.signature) || ''),
                  okey,
                })
              }
              if (fresh.length > 0) {
                correctRanges(fresh, retryLines, retryHint)
                const res = await explain(retryLines, fresh, retryBase, retryHint)
                funcs.push(...res.functions)
                for (const key of res.edgeSet) edgeSet.add(key)
                remaining.push(...res.failures)
              }
              // 解析成功但未发现新函数:视为该窗口已解决(可能确实没有函数)
            } catch (err) {
              remaining.push({
                phase: 'outline',
                from,
                to,
                funcs: [],
                text: '第 ' + from + ' 行起的函数清单失败: ' + message(err),
              })
            }
          }

          let rCursor = 0
          const worker = async () => {
            while (rCursor < explainJobs.length) {
              const g = explainJobs[rCursor]
              rCursor++
              const from = Math.min(Math.max(1, g.from), retryLines.length)
              const to = Math.min(Math.max(from, g.to), retryLines.length)
              const code = numberedCode(retryLines, from, to)
              const listText = g.funcs.map((f) => '- ' + f.name + ' (第 ' + f.start + ' – ' + f.end + ' 行)').join('\n')
              try {
                const { text } = await llmCall(EXPLAIN_PROMPT,
                  explainUserText(retryBase, retryHint, listText, from, to, code), EXPLAIN_MAX_TOKENS)
                const parsed = parseJson(text)
                const fns = Array.isArray(parsed.functions) ? parsed.functions : []
                for (let k = 0; k < fns.length && k < g.funcs.length; k++) {
                  const target = byKey.get(g.funcs[k].okey)
                  if (!target) continue
                  const f = fns[k]
                  target.summary = String((f && f.summary) || '')
                  target.flow = (f && f.flow) || ''
                  target.formula = String((f && f.formula) || '')
                }
                collectEdges(parsed, edgeSet)
              } catch (err) {
                remaining.push({
                  phase: 'explain',
                  from,
                  to,
                  funcs: g.funcs,
                  text: '第 ' + from + ' 行起的一组函数解读失败: ' + message(err),
                })
              }
            }
          }
          await Promise.all(Array.from({ length: Math.min(EXPLAIN_CONCURRENCY, explainJobs.length) }, () => worker()))

          correctRanges(funcs, retryLines, retryHint)
          normalizeFlowSteps(funcs)
          anchorFlowSteps(funcs, retryLines)
          for (const key of scanEdges(funcs, retryLines)) edgeSet.add(key)
          const data = finishData(funcs, edgeSet, ctx.infoWarnings, remaining, ctx.chunks, ctx.route || 'unknown')
          hitEntry.data = data
          hitEntry.ctx = {
            functions: funcs,
            edgeSet,
            infoWarnings: ctx.infoWarnings,
            failures: remaining,
            chunks: ctx.chunks,
            route: ctx.route,
          }
          return data
        }

        // 定向补全分支:缓存命中、文件未变且有失败组才走;缓存丢失
        // (如重启 harness)或文件已变时退化为全量解读,客户端无感
        if (body.retry && !body.refresh && hit && hit.mtime === mtime && hit.size === size && hit.ctx
          && Array.isArray(hit.ctx.failures) && hit.ctx.failures.length > 0 && hit.data) {
          const data = await retryFailed(hit, lines, baseName, langHint)
          send(res, 200, data)
          return
        }

        const generate = async () => {
          let result
          const infoWarnings = []
          if (lines.length <= SINGLE_CALL_MAX_LINES) {
            try {
              result = await analyzeSingle(lines, baseName, langHint)
            } catch (err) {
              // 单次调用失败(输出超限/未识别到函数)自动回退分段
              result = await analyzeChunked(lines, baseName, langHint)
              infoWarnings.push('单次解读失败,已自动回退分段解读: ' + message(err))
            }
          } else {
            result = await analyzeChunked(lines, baseName, langHint)
          }
          if (result.functions.length === 0) {
            infoWarnings.push(looksLikeCode(content)
              ? '该文件疑似代码,但模型未识别到函数;可点「重新解读」重试'
              : '该文件看起来不是代码(纯文本/配置),没有函数是正常的')
          }
          // 确定性流水线:签名修正行号 → 步骤归一 → 变量锚定 → 调用边
          result.functions = correctRanges(result.functions, lines, langHint)
          result.functions = normalizeFlowSteps(result.functions)
          result.functions = anchorFlowSteps(result.functions, lines)
          for (const key of scanEdges(result.functions, lines)) result.edgeSet.add(key)
          return {
            functions: result.functions,
            edgeSet: result.edgeSet,
            infoWarnings,
            failures: result.failures,
            chunks: result.chunks,
            route: result.route || 'unknown',
            size,
          }
        }
        // LRU 上限:长期多项目使用不无限膨胀
        if (cache.size >= MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value)
        const entry = { mtime, promise: null }
        entry.promise = generate().then((res) => {
          const data = finishData(res.functions, res.edgeSet, res.infoWarnings, res.failures, res.chunks, res.route)
          // 生成期间文件又变过(新 mtime 产生新 entry):旧结果不覆盖
          if (cache.get(path) === entry) {
            cache.set(path, {
              mtime,
              size: res.size,
              data,
              ctx: {
                functions: res.functions,
                edgeSet: res.edgeSet,
                infoWarnings: res.infoWarnings,
                failures: res.failures,
                chunks: res.chunks,
                route: res.route,
              },
            })
          }
          return data
        }).catch((err) => {
          if (cache.get(path) === entry) cache.delete(path)
          throw err
        })
        cache.set(path, entry)
        const data = await entry.promise
        send(res, 200, data)
      } catch (err) {
        // 二进制/非 UTF-8:按"无法解读"约定返回
        if (err && err.code === 'FS_NOT_TEXT') {
          send(res, 200, { binary: true })
          return
        }
        send(res, 500, { error: message(err) })
      }
    })
  }

  registerWeb()
  ctx.on('internal/service', (name) => {
    if (name === 'webServer' || name === 'httpServer' || name === 'llm' || name === 'agentDefaultModel') registerWeb()
  })
}
