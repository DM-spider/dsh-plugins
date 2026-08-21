/**
 * dsh-code-guide — host half.
 *
 * Registers the /plugins/code-guide/* HTTP routes for the code reading
 * companion panel (list / explain). `explain` works in two phases:
 *
 *  1. OUTLINE — the model lists every function definition with absolute
 *     line numbers (name + range only, tiny output).
 *  2. EXPLAIN — the file is walked in function-group windows; each model
 *     call explains exactly the listed functions of its window (one entry
 *     per function, keyed by name), plus caller→callee edges.
 *
 * The host merges by name so the client gets a strict 1:1 mirror of the
 * source functions and builds the mermaid call graph itself. The source
 * code is only ever DISPLAYED, never executed.
 *
 * @module dsh-code-guide
 */
export const name = 'code-guide'
export const inject = ['fs']

const MAX_EXPLAIN_BYTES = 1000000
// Small/medium scripts take the SIMPLE path: one single model call returns
// every function (1:1 with the source, nothing extra) in one shot. Only when
// that fails (e.g. output cap) or the file is large does the chunked
// two-phase pipeline take over.
const SINGLE_CALL_MAX_LINES = 500
const SINGLE_CALL_MAX_TOKENS = 24000
const OUTLINE_WINDOW = 1200          // lines per outline call (small output each)
const OUTLINE_CONCURRENCY = 3
const EXPLAIN_WINDOW_SPAN = 400      // max line span per explanation call
const EXPLAIN_CONCURRENCY = 3
const OUTLINE_MAX_TOKENS = 8000
const EXPLAIN_MAX_TOKENS = 24000
const MAX_GRAPH_NODES = 120
const MAX_GRAPH_EDGES = 200

const SINGLE_PROMPT = [
  '你是一位资深代码讲解老师,面向初学者做逐函数解读。用户会贴出一段完整源代码。',
  '你只做解读,不运行代码、不修改代码;源码里有几个函数就解读几个,一个不多一个不少。',
  '请输出严格合法的 JSON(不要输出 JSON 之外的任何内容,不要 Markdown 代码围栏),结构如下:',
  '{',
  '  "functions": [',
  '    {"name": "函数名(类方法写成 Class.method)", "start": 起始行号, "end": 结束行号, "signature": "函数定义行的原始内容(去掉行首缩进,逐字照抄;装饰器则从第一行装饰器开始)", "summary": "一句话:这个函数做什么", "flow": [{"start": 本步骤对应的起始行号, "end": 本步骤对应的结束行号, "text": "这一步做什么,必须引用代码里真实出现的变量名/参数名/数据结构名,变量名用反引号包裹(如 `df`、`result`、`seen`、`raw_types`)"}], "formula": "关键公式或核心算法说明;没有则为空字符串"}',
  '  ],',
  '  "callEdges": [["调用方函数名", "被调用函数名"]]',
  '}',
  '要求:',
  '- start/end 是函数在源码中的真实行号(从 1 开始)',
  '- signature 必须逐字照抄源码,这用于精确定位行号,绝不能改写',
  '- 一个不漏:装饰器、lambda 赋值、嵌套函数、类方法都要列出来,按行号升序,不要重复',
  '- 如果代码里确实存在函数,严禁返回空数组;仔细逐段找,找到为止',
  '- flow 是数组,按执行顺序拆步骤;每个步骤的 start/end 是该步骤对应的代码行范围(函数内、从小到大、不重叠);没有步骤则 flow 为空数组',
  '- flow 每一步都要带上真实变量名并用反引号包裹;严禁泛泛写"遍历列表"而不指明遍历哪个变量',
  '- 解读要通俗,说人话,重点讲"数据怎么进、怎么流转、得到什么"',
  '- callEdges 只列代码里实际出现的调用关系,没有就为空数组',
].join('\n')

const OUTLINE_PROMPT = [
  '你是一位代码结构分析师。用户会贴出一个大文件的一段(可能很长)。',
  '任务:列出本段代码中所有函数/方法的定义,不解读、不运行、不修改。',
  '请输出严格合法的 JSON(不要输出 JSON 之外的任何内容,不要 Markdown 代码围栏),结构如下:',
  '{',
  '  "functions": [{"name": "函数名(类方法写成 Class.method)", "start": 起始行号, "end": 结束行号, "signature": "函数定义行的原始内容(去掉行首缩进,逐字照抄;装饰器则从第一行装饰器开始)"}]',
  '}',
  '要求:',
  '- start/end 是函数在完整文件中的真实绝对行号(从 1 开始),用户会告诉你本段的起始行号',
  '- signature 必须逐字照抄源码,这用于精确定位行号,绝不能改写',
  '- 一个不漏:装饰器、lambda 赋值、嵌套函数、类方法都要列出来',
  '- 如果代码里确实存在函数,严禁返回空数组;仔细逐段找,找到为止',
  '- 不要重复,按行号升序排列',
].join('\n')

const EXPLAIN_PROMPT = [
  '你是一位资深代码讲解老师,面向初学者做逐函数解读。',
  '用户会给出:一段源代码片段 + 本段要解读的函数清单(函数名与绝对行号)。',
  '你只做解读,不运行代码、不修改代码。',
  '请输出严格合法的 JSON(不要输出 JSON 之外的任何内容,不要 Markdown 代码围栏),结构如下:',
  '{',
  '  "functions": [',
  '    {"name": "必须与清单完全一致的函数名", "summary": "一句话:这个函数做什么", "flow": [{"start": 本步骤对应的起始行号, "end": 本步骤对应的结束行号, "text": "这一步做什么,必须引用代码里真实出现的变量名/参数名/数据结构名,变量名用反引号包裹(如 `df`、`result`、`seen`、`raw_types`)"}], "formula": "关键公式或核心算法说明;没有则为空字符串"}',
  '  ],',
  '  "callEdges": [["调用方函数名", "被调用函数名"]]',
  '}',
  '要求:',
  '- functions 与给出的清单一一对应:一个不能少、一个不能多,name 严格一致',
  '- flow 是数组,按执行顺序拆步骤;每个步骤的 start/end 是该步骤对应的代码行范围(函数内、从小到大、不重叠);没有步骤则 flow 为空数组',
  '- flow 每一步都要带上真实变量名并用反引号包裹;严禁泛泛写"遍历列表"而不指明遍历哪个变量',
  '- 解读要通俗,说人话,重点讲"数据怎么进、怎么流转、得到什么"',
  '- callEdges 只列本段代码里实际出现的调用关系,没有就为空数组',
].join('\n')

export function apply(ctx) {
  const fs = ctx.fs
  const message = (err) => String((err && err.message) || err)

  const readBody = async (req) => {
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    return Buffer.concat(chunks).toString('utf8')
  }
  const send = (res, status, obj) => {
    res.writeHead(status, {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    })
    res.end(JSON.stringify(obj))
  }
  const param = (req, key) => {
    try {
      return new URL(req.url ?? '/', 'http://x').searchParams.get(key)
    } catch {
      return null
    }
  }

  // Resolve the model route for code explanations (memoized per process):
  // prefer the fast flash model (deepseek-official / deepseek-v4-flash) when
  // registered; fall back to the default model selection, then to the first
  // registered provider/model. Explanations do not need heavy reasoning.
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
    return routePromise
  }

  // One-shot model call through the resolved route. Consumes raw stream
  // chunks by hand so this bundle needs no runtime imports.
  const llmCall = async (system, userText, maxTokens, signal) => {
    const llm = ctx.get('llm')
    if (llm === undefined) throw new Error('llm 服务不可用')
    const route = await resolveRoute()
    const provider = route.provider
    const model = route.model
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
        source: { kind: 'plugin', plugin: 'dsh-code-guide' },
      }],
      maxTokens,
      temperature: 0.2,
      // 解读只是"把函数用中文讲清楚",不需要推理;关闭思考,否则默认
      // reasoningEffort=max 的推理 token 会烧光输出预算导致 max-tokens
      reasoningEffort: 'off',
      signal,
    })) {
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
    return JSON.parse(s)
  }

  // Phase 1: function outline (name + absolute line range) for the whole
  // file, walked in bounded windows.
  const outline = async (lines, baseName, langHint) => {
    const totalLines = lines.length
    const merged = []
    const seen = new Set()
    const warnings = []
    let route = ''
    const jobs = []
    for (let start = 0; start < totalLines; start += OUTLINE_WINDOW) {
      jobs.push({ start, end: Math.min(start + OUTLINE_WINDOW, totalLines) })
    }
    for (const job of jobs) {
      try {
        const code = lines.slice(job.start, job.end).join('\n')
        const userText = '完整文件名: ' + baseName + (langHint ? ' (语言/类型: ' + langHint + ')' : '')
          + '\n本段覆盖完整文件的第 ' + (job.start + 1) + ' 行到第 ' + job.end + ' 行,行号请按完整文件计算。'
          + '\n\n```\n' + code + '\n```'
        const { text, provider, model } = await llmCall(OUTLINE_PROMPT, userText, OUTLINE_MAX_TOKENS)
        route = provider + '/' + model
        const parsed = parseJson(text)
        const fns = Array.isArray(parsed.functions) ? parsed.functions : []
        for (const f of fns) {
          const name = String((f && f.name) || '').trim()
          if (!name || seen.has(name)) continue
          seen.add(name)
          merged.push({
            name,
            start: Math.max(1, Number(f && f.start) || 1),
            end: Math.max(1, Number(f && f.end) || 1),
            signature: String((f && f.signature) || ''),
          })
        }
      } catch (err) {
        warnings.push('第 ' + (job.start + 1) + ' 行起的函数清单失败: ' + message(err))
      }
    }
    merged.sort((a, b) => a.start - b.start || a.end - b.end)
    return { functions: merged, route, warnings }
  }

  // Phase 2: explain the outlined functions in grouped windows.
  const explain = async (lines, outlineFunctions, baseName, langHint) => {
    // Group consecutive functions so each window's line span stays bounded;
    // a single oversized function gets its own window (body capped).
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
    const warnings = []
    let cursor = 0
    const worker = async () => {
      while (cursor < windows.length) {
        const w = windows[cursor]
        cursor++
        const from = Math.max(1, w.minStart - 2)
        const to = Math.min(lines.length, w.maxEnd + 2)
        const code = lines.slice(from - 1, to).join('\n')
        const listText = w.funcs.map((f) => '- ' + f.name + ' (第 ' + f.start + ' – ' + f.end + ' 行)').join('\n')
        const userText = '完整文件名: ' + baseName + (langHint ? ' (语言/类型: ' + langHint + ')' : '')
          + '\n\n本段要解读的函数清单(必须一一对应):\n' + listText
          + '\n\n源代码片段(完整文件第 ' + from + ' 行到第 ' + to + ' 行):\n```\n' + code + '\n```'
        try {
          const { text } = await llmCall(EXPLAIN_PROMPT, userText, EXPLAIN_MAX_TOKENS)
          const parsed = parseJson(text)
          const fns = Array.isArray(parsed.functions) ? parsed.functions : []
          for (const f of fns) {
            const name = String((f && f.name) || '').trim()
            if (!name) continue
            explanations.set(name, {
              summary: String((f && f.summary) || ''),
              // flow 保持原始值:新格式是数组(步骤+行号),老格式是字符串,
              // 绝不能 String() 强转,否则数组变 [object Object]
              flow: (f && f.flow) || '',
              formula: String((f && f.formula) || ''),
            })
          }
          const edges = Array.isArray(parsed.callEdges) ? parsed.callEdges : []
          for (const e of edges) {
            if (Array.isArray(e) && e.length >= 2) {
              const a = String(e[0]).trim()
              const b = String(e[1]).trim()
              if (a && b && a !== b) edgeSet.add(a + '\u0000' + b)
            }
          }
        } catch (err) {
          warnings.push('第 ' + from + ' 行起的一组函数解读失败: ' + message(err))
        }
      }
    }
    await Promise.all(Array.from({ length: Math.min(EXPLAIN_CONCURRENCY, windows.length) }, () => worker()))

    const functions = outlineFunctions.map((f) => {
      const e = explanations.get(f.name)
      return {
        name: f.name,
        start: f.start,
        end: f.end,
        signature: f.signature || '',
        summary: e ? e.summary : '',
        flow: e ? e.flow : '',
        formula: e ? e.formula : '',
      }
    })
    return { functions, edgeSet, warnings, windows: windows.length }
  }

  // Simple path: ONE model call for the whole (small/medium) script.
  // Output is strictly 1:1 with the source functions, nothing extra.
  const analyzeSingle = async (lines, baseName, langHint) => {
    const code = lines.join('\n')
    const userText = '完整文件名: ' + baseName + (langHint ? ' (语言/类型: ' + langHint + ')' : '')
      + '\n\n```\n' + code + '\n```'
    const { text, provider, model } = await llmCall(SINGLE_PROMPT, userText, SINGLE_CALL_MAX_TOKENS)
    const parsed = parseJson(text)
    const fns = Array.isArray(parsed.functions) ? parsed.functions : []
    const seen = new Set()
    const functions = []
    for (const f of fns) {
      const name = String((f && f.name) || '').trim()
      if (!name || seen.has(name)) continue
      seen.add(name)
      functions.push({
        name,
        start: Math.max(1, Number(f && f.start) || 1),
        end: Math.max(1, Number(f && f.end) || 1),
        signature: String((f && f.signature) || ''),
        summary: String((f && f.summary) || ''),
        // flow 保持原始值(新格式为数组),严禁 String() 强转
        flow: (f && f.flow) || '',
        formula: String((f && f.formula) || ''),
      })
    }
    functions.sort((a, b) => a.start - b.start || a.end - b.end)
    // An empty function list on a code file means the model didn't follow
    // through — treat it as a failure so the caller falls back / warns.
    if (functions.length === 0) throw new Error('模型未识别到任何函数')
    const edgeSet = new Set()
    const edges = Array.isArray(parsed.callEdges) ? parsed.callEdges : []
    for (const e of edges) {
      if (Array.isArray(e) && e.length >= 2) {
        const a = String(e[0]).trim()
        const b = String(e[1]).trim()
        if (a && b && a !== b) edgeSet.add(a + '\u0000' + b)
      }
    }
    return {
      functions,
      edgeSet,
      warnings: [],
      chunks: 1,
      route: provider + '/' + model,
    }
  }

  // Chunked fallback for large scripts: outline + grouped explanation.
  const analyzeChunked = async (lines, baseName, langHint) => {
    const outlineRes = await outline(lines, baseName, langHint)
    const explainRes = await explain(lines, outlineRes.functions, baseName, langHint)
    return {
      functions: explainRes.functions,
      edgeSet: explainRes.edgeSet,
      warnings: outlineRes.warnings.concat(explainRes.warnings),
      chunks: explainRes.windows,
      route: outlineRes.route,
    }
  }

  // Deterministic call-edge scan: inside each function's line range, every
  // occurrence of "knownFunctionName(" counts as a call. Complements the
  // model-reported edges so a missed call (e.g. main -> _load_main_module)
  // still lands in the graph. Text-only, no extra model calls.
  const scanEdges = (functions, lines) => {
    const edges = new Set()
    const names = (functions || []).map((f) => f.name).filter((n) => n && n.length >= 2)
    if (names.length < 2) return edges
    const regexes = new Map()
    for (const n of names) {
      const esc = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      try { regexes.set(n, new RegExp('(?<![A-Za-z0-9_$])' + esc + '\\s*\\(', 'm')) } catch { /* skip */ }
    }
    // 函数体范围用"本函数起始行 → 下一函数起始行"精确定界(起始行已用
    // 签名修正),最后一个函数延伸到文件末尾,不依赖模型猜的结束行
    for (let ci = 0; ci < functions.length; ci++) {
      const caller = functions[ci]
      const nextStart = ci + 1 < functions.length ? functions[ci + 1].start : lines.length + 1
      const from = Math.max(1, caller.start)
      const to = Math.min(lines.length, nextStart - 1, caller.start + 2000)
      if (to < from) continue
      const body = lines.slice(from - 1, to).join('\n')
      for (const callee of names) {
        if (callee === caller.name) continue
        const re = regexes.get(callee)
        if (re && re.test(body)) edges.add(caller.name + '\u0000' + callee)
      }
    }
    return edges
  }

  const buildCallGraph = (functions, edgeSet) => {
    const known = new Set((functions || []).map((f) => f.name))
    // 节点:渲染全部函数(即使没有任何调用边的孤立函数也显示),
    // 上限 MAX_GRAPH_NODES
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
    for (const name of nodeNames) {
      const id = 'n' + (nodeIds.size + 1)
      nodeIds.set(name, id)
      rows.push('  ' + id + '["' + String(name).replace(/"/g, "'") + '"]')
    }
    for (const key of edges) {
      const [a, b] = key.split('\u0000')
      if (nodeIds.has(a) && nodeIds.has(b)) rows.push('  ' + nodeIds.get(a) + ' --> ' + nodeIds.get(b))
    }
    return rows.join('\n')
  }

  // Cheap heuristic: does the content look like source code at all?
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

  // Line-range correction: the model counts lines loosely, so we re-locate
  // each function by its verbatim signature (first line, whitespace-free
  // match) near the claimed start. For Python files the END line is then
  // derived structurally: a function ends where indentation returns to the
  // level of its def line (not merely "the line before the next def").
  const correctRanges = (functions, lines, langHint) => {
    const norm = (s) => String(s).replace(/\s+/g, '')
    for (const f of functions) {
      if (!f.signature) continue
      const sig = norm(String(f.signature).split('\n')[0])
      if (sig.length < 4) continue
      let found = -1
      const lo = Math.max(1, f.start - 10)
      const hi = Math.min(lines.length, f.start + 10)
      for (let i = lo; i <= hi; i++) {
        if (norm(lines[i - 1]).startsWith(sig)) { found = i; break }
      }
      if (found === -1) {
        for (let i = 1; i <= lines.length; i++) {
          if (norm(lines[i - 1]).startsWith(sig)) { found = i; break }
        }
      }
      if (found > 0) f.start = found
      if (f.end < f.start) f.end = f.start
    }
    functions.sort((a, b) => a.start - b.start || a.end - b.end)
    const isPython = langHint === 'py' || langHint === 'pyw'
      || /^\s*def\s/m.test(lines.slice(0, Math.min(200, lines.length)).join('\n'))
    if (isPython) {
      // 缩进规则:函数在缩进回到 def 行层级时结束
      for (const f of functions) {
        const defLine = lines[f.start - 1] ?? ''
        const dm = /^(\s*)/.exec(defLine)
        const defIndent = dm ? dm[1].length : 0
        if (!/^\s*def\s/.test(defLine) && !/^\s*@/.test(defLine)) continue
        let lastContent = f.start
        for (let ln = f.start + 1; ln <= lines.length; ln++) {
          const line = lines[ln - 1]
          if (/^\s*$/.test(line)) continue
          // 多行签名/长表达式的续行收尾符(只含括号逗号冒号)不算回到基级
          if (/^\s*[)\]},]+/.test(line)) continue
          const indent = /^(\s*)/.exec(line)[1].length
          if (indent <= defIndent) break
          lastContent = ln
        }
        if (lastContent >= f.start) f.end = lastContent
      }
    } else {
      for (let i = 1; i < functions.length; i++) {
        const prev = functions[i - 1]
        const cur = functions[i]
        if (prev.end >= cur.start) prev.end = Math.max(cur.start - 1, prev.start)
      }
    }
    return functions
  }

  // Normalize per-step flow arrays: keep only valid steps, clamp their line
  // ranges into the function range, and force monotonic non-overlap so the
  // client can map a clicked code line to the exact explanation step.
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
          start: Math.max(1, Math.round(Number((s && s.start) || 0)) || 1),
          end: Math.max(1, Math.round(Number((s && s.end) || 0)) || 1),
          text: stepTextOf(s),
        }))
        .filter((s) => s.text)
        .sort((a, b) => a.start - b.start)
      const out = []
      let prevEnd = f.start - 1
      for (const s of steps) {
        const st = Math.min(Math.max(s.start, prevEnd + 1), f.end)
        const en = Math.min(Math.max(s.end, st), f.end)
        if (st > f.end) break
        out.push({ start: st, end: en, text: s.text })
        prevEnd = en
      }
      if (out.length > 0) f.flowSteps = out
      else { f.flowSteps = null; f.flow = '' }
    }
    return functions
  }

  // Anchor-based step alignment: the model's per-step line ranges drift, so
  // we re-derive them deterministically — each step anchors at the FIRST line
  // in the function where one of its backticked variables appears (steps are
  // walked in model order with a moving cursor, so anchors stay monotonic).
  // Step range = [anchor_i, anchor_{i+1} - 1], last step extends to fn end.
  const anchorFlowSteps = (functions, lines) => {
    const tokenRe = (tok) => {
      const esc = tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      try { return new RegExp('(?<![A-Za-z0-9_$])' + esc + '(?![A-Za-z0-9_$])') } catch { return null }
    }
    const tokensOf = (text) => {
      const out = []
      const re = /`([^`]+)`/g
      let m
      while ((m = re.exec(String(text))) !== null) {
        const v = m[1].trim()
        if (!v) continue
        out.push(v)
        const first = /^[A-Za-z_$][\w$]*/.exec(v)
        if (first && first[0] !== v) out.push(first[0])
      }
      return out
    }
    for (const f of functions) {
      const steps = f.flowSteps
      if (!Array.isArray(steps) || steps.length === 0) continue
      const body = lines.slice(f.start - 1, f.end)
      let cursor = f.start
      const out = []
      for (const st of steps) {
        const toks = tokensOf(st.text)
        let anchor = -1
        for (const tok of toks) {
          const re = tokenRe(tok)
          if (!re) continue
          for (let i = cursor - f.start; i < body.length; i++) {
            if (re.test(body[i])) { anchor = f.start + i; break }
          }
          if (anchor > 0) break
        }
        if (anchor === -1) anchor = Math.max(cursor, Math.min(st.start, f.end))
        out.push({ start: anchor, end: anchor, text: st.text })
        cursor = Math.max(cursor, anchor + 1)
      }
      for (let i = 0; i < out.length; i++) {
        out[i].end = i + 1 < out.length ? Math.max(out[i + 1].start - 1, out[i].start) : f.end
      }
      f.flowSteps = out
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
      ctx.effect(() => webServer.register({ kind: 'exact', path, handler }), 'code-guide: ' + path)
    }

    route('/plugins/code-guide/list', async (req, res) => {
      const path = param(req, 'path')
      if (!path) {
        send(res, 400, { error: 'missing path' })
        return
      }
      try {
        const target = await fs.resolve(path)
        const info = await fs.stat(target)
        if (info === undefined || info.type !== 'directory') {
          send(res, 404, { error: 'not-a-directory' })
          return
        }
        const entries = await fs.listDir(target)
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

    // Plain file read: the source pane loads this directly and instantly —
    // no LLM involved. The explanation endpoint runs fully in parallel.
    route('/plugins/code-guide/read', async (req, res) => {
      const path = param(req, 'path')
      if (!path) {
        send(res, 400, { error: 'missing path' })
        return
      }
      try {
        const target = await fs.resolve(path)
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
        send(res, 200, { content, size })
      } catch (err) {
        send(res, 500, { error: message(err) })
      }
    })

    route('/plugins/code-guide/explain', async (req, res) => {
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
      if (!path) {
        send(res, 400, { error: 'missing path' })
        return
      }
      try {
        const target = await fs.resolve(path)
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
        const hit = cache.get(path)
        if (hit && hit.mtime === mtime && !body.refresh) {
          send(res, 200, hit.data)
          return
        }
        const baseName = path.split(/[\\/]/).pop()
        const langHint = path.includes('.') ? path.slice(path.lastIndexOf('.') + 1).toLowerCase() : ''
        const lines = content.replace(/\r\n/g, '\n').split('\n')

        let result
        if (lines.length <= SINGLE_CALL_MAX_LINES) {
          try {
            result = await analyzeSingle(lines, baseName, langHint)
          } catch (err) {
            // 单次调用失败(如输出超限、未识别到函数)时自动回退到分段解读
            result = await analyzeChunked(lines, baseName, langHint)
            result.warnings.unshift('单次解读失败,已自动回退分段解读: ' + message(err))
          }
        } else {
          result = await analyzeChunked(lines, baseName, langHint)
        }
        // 仍为空:用正则判断文件到底像不像代码,给出可操作的提示
        if (result.functions.length === 0) {
          if (looksLikeCode(content)) {
            result.warnings.push('该文件疑似代码,但模型未识别到函数;可点「重新解读」重试')
          } else {
            result.warnings.push('该文件看起来不是代码(纯文本/配置),没有函数是正常的')
          }
        }
        // 用签名反查修正行号(模型数行不准),再夹紧区间
        result.functions = correctRanges(result.functions, lines, langHint)
        result.functions = normalizeFlowSteps(result.functions)
        result.functions = anchorFlowSteps(result.functions, lines)
        // 调用边 = 模型报告 ∪ 程序化扫描(补全模型漏掉的调用关系)
        const scanned = scanEdges(result.functions, lines)
        for (const key of scanned) result.edgeSet.add(key)
        const callGraph = buildCallGraph(result.functions, result.edgeSet)
        const data = {
          path,
          functions: result.functions,
          callGraph,
          warnings: result.warnings,
          chunks: result.chunks,
          model: result.route,
        }
        cache.set(path, { mtime, data })
        send(res, 200, data)
      } catch (err) {
        send(res, 500, { error: message(err) })
      }
    })
  }

  registerWeb()
  ctx.on('internal/service', (name) => {
    if (name === 'webServer' || name === 'httpServer' || name === 'llm' || name === 'agentDefaultModel') registerWeb()
  })
}
