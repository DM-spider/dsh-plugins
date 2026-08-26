/**
 * dsh-files — host half.
 *
 * Registers the /plugins/dsh-files/* HTTP routes for the files sidebar:
 * list (file tree), read (file content), search (filename search), and
 * explain (per-function AI explanations + mermaid call graph). `explain`
 * runs in two phases:
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
 * @module dsh-files
 */
// vscode-files-explain 移植注记:DSH 版的 name/inject 导出不再需要。
// 本文件导出 createServices({ fs, llm }),fs/llm 分别由
// FsAdapter(vscode.workspace.fs 包装)与 LlmAdapter(DeepSeek/Copilot)提供。

const MAX_EXPLAIN_BYTES = 1000000
// Small/medium scripts take the SIMPLE path: one single model call returns
// every function (1:1 with the source, nothing extra) in one shot. Only when
// that fails (e.g. output cap) or the file is large does the chunked
// two-phase pipeline take over.
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

const SINGLE_PROMPT = [
  '你是一位资深代码讲解老师,面向初学者做逐函数解读。用户会贴出一段完整源代码。',
  '你只做解读,不运行代码、不修改代码;源码里有几个函数就解读几个,一个不多一个不少。',
  '请输出严格合法的 JSON(不要输出 JSON 之外的任何内容,不要 Markdown 代码围栏),结构如下:',
  '{',
  '  "functions": [',
  '    {"name": "函数名(类方法写成 Class.method)", "start": 起始行号, "end": 结束行号, "signature": "函数定义行的原始内容(去掉行首缩进,逐字照抄,绝不能改写;装饰器则从第一行装饰器开始)", "summary": "一句话:这个函数做什么", "flow": [{"start": 本步骤对应的起始行号, "end": 本步骤对应的结束行号, "text": "这一步做什么,必须引用代码里真实出现的变量名/参数名/数据结构名,变量名用反引号包裹(如 `df`、`result`、`seen`、`raw_types`)"}], "formula": "关键公式或核心算法说明;没有则为空字符串"}',
  '  ],',
  '  "callEdges": [["调用方函数名", "被调用函数名"]]',
  '}',
  '要求:',
  '- start/end 是函数在源码中的真实行号(从 1 开始)',
  '- 一个不漏:装饰器、lambda 赋值、嵌套函数、类方法都要列出来,按行号升序,不要重复;如果代码里确实存在函数,严禁返回空数组,仔细逐段找,找到为止',
  '- flow 是数组,按执行顺序拆步骤;每个步骤的 start/end 是该步骤对应的代码行范围(函数内、从小到大、不重叠);没有步骤则 flow 为空数组',
  '- flow 步骤严禁泛泛写"遍历列表"而不指明遍历哪个变量',
  '- flow 中引用函数调用时,反引号只包裹函数名本身(如 `train_scorecards`),不要带参数和括号;参数如需说明,作为普通文本写在步骤里',
  '- 解读要通俗,说人话,重点讲"数据怎么进、怎么流转、得到什么"',
  '- callEdges 只列代码里实际出现的调用关系,没有就为空数组',
].join('\n')

const OUTLINE_PROMPT = [
  '你是一位代码结构分析师。用户会贴出一个大文件的一段(可能很长)。',
  '任务:列出本段代码中所有函数/方法的定义,不解读、不运行、不修改。',
  '请输出严格合法的 JSON(不要输出 JSON 之外的任何内容,不要 Markdown 代码围栏),结构如下:',
  '{',
  '  "functions": [{"name": "函数名(类方法写成 Class.method)", "start": 起始行号, "end": 结束行号, "signature": "函数定义行的原始内容(去掉行首缩进,逐字照抄,绝不能改写;装饰器则从第一行装饰器开始)"}]',
  '}',
  '要求:',
  '- start/end 是函数在完整文件中的真实绝对行号(从 1 开始),用户会告诉你本段的起始行号',
  '- 一个不漏:装饰器、lambda 赋值、嵌套函数、类方法都要列出来,按行号升序,不要重复;如果代码里确实存在函数,严禁返回空数组,仔细逐段找,找到为止',
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
  '- flow 步骤严禁泛泛写"遍历列表"而不指明遍历哪个变量',
  '- flow 中引用函数调用时,反引号只包裹函数名本身(如 `train_scorecards`),不要带参数和括号;参数如需说明,作为普通文本写在步骤里',
  '- 解读要通俗,说人话,重点讲"数据怎么进、怎么流转、得到什么"',
  '- callEdges 只列本段代码里实际出现的调用关系,没有就为空数组',
].join('\n')

export function createServices(deps) {
  const ctx = { get: (name) => (name === 'llm' ? deps.llm : undefined) }
  const fs = deps.fs
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

  // Resolve the model route for code explanations (memoized per process).
  // 移植后路由决策下沉到 LlmAdapter:配置了 DeepSeek key 就用 DeepSeek,
  // 否则尝试 GitHub Copilot(vscode.lm);都不可用时抛出带指引的错误。
  let routePromise = null
  const resolveRoute = async () => {
    if (routePromise !== null) return routePromise
    // 失败不缓存:模型服务瞬断恢复后,下一次解读重试解析,而不是永久失败
    routePromise = deps.llm.resolveRoute().catch((err) => { routePromise = null; throw err })
    return routePromise
  }

  // One-shot model call through the resolved route. Consumes raw stream
  // chunks by hand so this bundle needs no runtime imports.
  const LLM_CALL_TIMEOUT_MS = 120000
  const llmCall = async (system, userText, maxTokens, signal) => {
    const route = await resolveRoute()
    const llm = deps.llm // LlmAdapter 的 stream 契约与 DSH llm 服务逐字节兼容
    const provider = route.provider
    const model = route.model
    // 上游挂起防护:120s 超时(flash 快模型正常几秒~几十秒)。signal 传入
    // stream,流式实现会在中断时停止迭代,解读不会永久 pending
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
      // 解读只是"把函数用中文讲清楚",不需要推理;关闭思考,否则默认
      // reasoningEffort=max 的推理 token 会烧光输出预算导致 max-tokens
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
    try {
      return JSON.parse(s)
    } catch (err) {
      let repaired = s
        .replace(/\\\r?\n/g, '\\n')
        .replace(/\\\t/g, '\\t')
        .replace(/\\u(?![0-9a-fA-F]{4})/g, 'u')
      let prev
      do {
        prev = repaired
        repaired = repaired.replace(/\\([^"\\\/bfnrtu])/g, '$1')
      } while (repaired !== prev)
      repaired = repaired.replace(/([\w\]])\["([^"]{1,80})"\]/g, '$1[\\"$2\\"]')
      if (repaired === s) throw err
      return JSON.parse(repaired)
    }
  }

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
          if (!name) continue
          // 同名不同函数(如多个类的 run/__init__)必须都保留;
          // 用 名字#起始行 近似去重,只压掉同一函数被模型重复报告
          const key = name + '#' + (Math.max(1, Number(f && f.start) || 1))
          if (seen.has(key)) continue
          seen.add(key)
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
          // 按清单一一对应(以清单序号对齐,而不是按 name:同名函数必须各归各)
          for (let k = 0; k < fns.length && k < w.funcs.length; k++) {
            const wf = w.funcs[k]
            const f = fns[k]
            explanations.set(wf.name + '#' + wf.start, {
              summary: String((f && f.summary) || ''),
              // flow 保持原始值:新格式是数组(步骤+行号),老格式是字符串,
              // 绝不能 String() 强转,否则数组变 [object Object]
              flow: (f && f.flow) || '',
              formula: String((f && f.formula) || ''),
            })
          }
          collectEdges(parsed, edgeSet)
        } catch (err) {
          warnings.push('第 ' + from + ' 行起的一组函数解读失败: ' + message(err))
        }
      }
    }
    await Promise.all(Array.from({ length: Math.min(EXPLAIN_CONCURRENCY, windows.length) }, () => worker()))

    const functions = outlineFunctions.map((f) => {
      const e = explanations.get(f.name + '#' + f.start)
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
      if (!name) continue
      const key = name + '#' + (Math.max(1, Number(f && f.start) || 1))
      if (seen.has(key)) continue
      seen.add(key)
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
    collectEdges(parsed, edgeSet)
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
      route: outlineRes.route || 'unknown',
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
    // 只扫图上会渲染的函数名(MAX_GRAPH_NODES),并把全部备选名合并成
    // 一个正则:每个函数体只扫一遍。原来"每个 caller × 每个 callee"
    // 各自全文跑正则,大文件(几百个函数)是 O(N²×L),解读会卡数十秒
    const visible = names.slice(0, MAX_GRAPH_NODES)
    const re = new RegExp(
      '(?<![A-Za-z0-9_$])(' + visible.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\s*\\(',
      'g'
    )
    // 函数体范围用"本函数起始行 → 下一函数起始行"精确定界(起始行已用
    // 签名修正),最后一个函数延伸到文件末尾,不依赖模型猜的结束行
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
  // Decorated signatures (e.g. "@property\ndef foo"): multi-line signatures
  // never match a single physical line, so we anchor on the LAST signature
  // line (the def/function line) and then walk UP to absorb the decorator
  // lines into start — jumping to the function lands on its decorator, and
  // line-range highlight covers the whole decorated definition.
  const correctRanges = (functions, lines, langHint) => {
    const norm = (s) => String(s).replace(/\s+/g, '')
    // 预计算去空白行(函数数 × 全文件扫描时不再逐次 replace)
    const normLines = lines.map(norm)
    for (const f of functions) {
      if (!f.signature) continue
      const sigAll = String(f.signature).split('\n').map((x) => norm(x)).filter((x) => x.length >= 4)
      if (sigAll.length === 0) continue
      const anchor = sigAll[sigAll.length - 1] // def/function 行是可靠锚点
      let found = -1
      const lo = Math.max(1, f.start - 10)
      const hi = Math.min(lines.length, f.start + 10)
      for (let i = lo; i <= hi; i++) {
        if (normLines[i - 1].startsWith(anchor)) { found = i; break }
      }
      if (found === -1) {
        // 全文件回退:同名签名(如多个类的 __init__)不能取"第一个",
        // 选 未被其他函数区间占用 且 离模型原始行号最近 的候选
        let best = -1
        let bestDist = Infinity
        let bestOcc = 1
        for (let i = 1; i <= lines.length; i++) {
          if (!normLines[i - 1].startsWith(anchor)) continue
          const occupied = functions.some((g) => g !== f && i > g.start && i <= g.end)
          const dist = Math.abs(i - f.start)
          const occ = occupied ? 1 : 0
          if (occ < bestOcc || (occ === bestOcc && dist < bestDist)) { best = i; bestDist = dist; bestOcc = occ }
        }
        found = best
      }
      if (found > 0) {
        // 向前收装饰器/注解行(@ 开头),让 start 覆盖整个装饰定义
        let s = found
        while (s > 1 && /^\s*@/.test(lines[s - 2])) s--
        f.start = s
      }
      if (f.end < f.start) f.end = f.start
    }
    functions.sort((a, b) => a.start - b.start || a.end - b.end)
    const isPython = langHint === 'py' || langHint === 'pyw'
      || /^\s*def\s/m.test(lines.slice(0, Math.min(200, lines.length)).join('\n'))
    if (isPython) {
      // 缩进规则:函数在缩进回到 def 行层级时结束。
      // start 可能是装饰器行,缩进基准必须取 def 行本身
      for (const f of functions) {
        let defIdx = -1
        for (let k = f.start; k <= Math.min(lines.length, f.start + 20); k++) {
          if (/^\s*(?:async\s+)?def\s/.test(lines[k - 1])) { defIdx = k; break }
        }
        if (defIdx < 0) continue
        const dm = /^(\s*)/.exec(lines[defIdx - 1])
        const defIndent = dm ? dm[1].length : 0
        let lastContent = defIdx
        // 三引号字符串可跨行且中间行常顶格:顶格行不能算"缩进回到基级",
        // 否则函数体被提前截断
        let inTriple = null
        for (let ln = defIdx + 1; ln <= lines.length; ln++) {
          const line = lines[ln - 1]
          if (inTriple) {
            const closeIdx = line.indexOf(inTriple)
            if (closeIdx >= 0) {
              inTriple = null
              lastContent = ln
              // 同一行闭合后还有内容:按正常缩进逻辑继续判断该行
              if (line.slice(closeIdx + 3).trim() === '') continue
            } else {
              lastContent = ln
              continue
            }
          }
          if (/^\s*$/.test(line)) continue
          // 多行签名/长表达式的续行收尾符(只含括号逗号冒号)不算回到基级
          if (/^\s*[)\]},]+/.test(line)) continue
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
    } else {
      // 花括号语言:从函数定义向后找"括号深度归零处的 {"作为函数体起点,
      // 再做花括号配对精确计算函数体结束行(剥离字符串/行注释/块注释干扰)。
      // 单行箭头函数等无花括号的形式保持模型给的 end
      // 找"函数体的 {":仅当签名括号已闭合(paren=0)时才接受;若某行扫完
      // 括号已闭合却仍无 {,说明是单行箭头函数等无花括号形式,立即放弃,
      // 避免跨行误配到下一个函数或普通代码的 {
      const bodyBraceLine = (fromLine) => {
        // start 可能被上收到装饰器行(@ 开头):先跳过,否则首行 paren=0
        // 且无 { 会被误判为"无花括号形式"整体放弃配对
        let first = fromLine
        while (first <= Math.min(lines.length, fromLine + 30) && /^\s*@/.test(lines[first - 1])) first++
        let paren = 0
        // 字符串/块注释跨行保持:JS 模板串(`)可跨行,块注释 /* */ 跨行,
        // 否则第二行起的 { ( 会被当成代码计进括号配对
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
    const tokenRe = (tok) => new RegExp('(?<![A-Za-z0-9_$])' + tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![A-Za-z0-9_$])')
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
  const routes = new Map()
  const registerWeb = () => {
    if (registered) return
    registered = true
    const route = (path, handler) => {
      routes.set(path, handler)
    }

    // 工作区包含校验:DSH 宿主 fs 的 cwd 只是解析基准、不等于工作区根
    // (客户端按工作区的绝对路径发请求),所以边界由客户端显式给出:
    // 每个路由携带 root(工作区根,来自客户端文件树),目标路径必须位于
    // root 之内;缺 root 或越界一律 403。../ 穿越与任意绝对路径
    // 都被同一条规则挡住
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
          // listDir 返回已解析的真实目标:符号链接目录指向自身或祖先
          // 会在树里形成环路,直接不展示;同目录多个链接指向同一真实
          // 目录也只保留第一个(展开状态按路径共享,重复展示无意义)
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

    // Plain file read: the source pane loads this directly and instantly —
    // no LLM involved. The explanation endpoint runs fully in parallel.
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
          // 大文件:先探测前 8KB 判二进制(zip/rar 等通常超限),
          // 二进制按"无法预览"约定返回,而不是"文件过大"
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
        // 二进制/非 UTF-8(FS_NOT_TEXT)是"无法预览",不是错误:
        // 不把宿主内部错误原文透传给用户
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

    // 图片/PDF 预览:按扩展名返回原始字节流(<img>/<iframe> 直接加载)。
    // 文本读取(readText)会拒绝二进制文件,图片/PDF 必须走这里
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
        // 命中缓存直接返回(缓存值可能是 data 或 in-flight promise)
        const hit = cache.get(path)
        if (hit && hit.mtime === mtime && !body.refresh) {
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
        const generate = async () => {
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
          return {
            path,
            functions: result.functions,
            callGraph,
            warnings: result.warnings,
            chunks: result.chunks,
            model: result.route || 'unknown',
          }
        }
        // LRU 上限:长期多项目使用不无限膨胀
        if (cache.size >= MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value)
        const entry = { mtime, promise: null }
        entry.promise = generate().then((data) => {
          // 生成期间文件可能又变过(新 mtime 产生新 entry):旧结果不覆盖
          if (cache.get(path) === entry) cache.set(path, { mtime, data })
          return data
        }).catch((err) => {
          if (cache.get(path) === entry) cache.delete(path)
          throw err
        })
        cache.set(path, entry)
        const data = await entry.promise
        send(res, 200, data)
      } catch (err) {
        // 二进制/非 UTF-8:按"无法解读"约定返回,不透传宿主内部错误
        if (err && err.code === 'FS_NOT_TEXT') {
          send(res, 200, { binary: true })
          return
        }
        send(res, 500, { error: message(err) })
      }
    })
  }

  registerWeb()

  // postMessage 分发器:把 {type, payload} 包装成原 HTTP 路由期望的 req/res
  // 形态(req.url 查询串、req 异步迭代 body、res.writeHead/end),五条路由的
  // 处理函数因此一行未改。raw 的二进制响应在这里统一转成 {base64, mime}。
  const handle = (type, payload) => new Promise((resolve) => {
    const handler = routes.get('/plugins/dsh-files/' + type)
    if (!handler) {
      resolve({ status: 404, body: { error: '未知消息类型: ' + type } })
      return
    }
    const qs = new URLSearchParams()
    for (const [k, v] of Object.entries(payload || {})) {
      if (v !== undefined && v !== null) qs.set(k, String(v))
    }
    const bodyText = JSON.stringify(payload || {})
    const req = {
      url: '/plugins/dsh-files/' + type + '?' + qs.toString(),
      method: type === 'explain' ? 'POST' : 'GET',
      [Symbol.asyncIterator]: async function* () { yield Buffer.from(bodyText, 'utf8') },
    }
    const res = {
      destroyed: false,
      writableEnded: false,
      writeHead(status, headers) { this._status = status; this._headers = headers },
      end(chunk) { this.writableEnded = true; this._body = chunk },
    }
    const finish = () => {
      const ct = String((res._headers && res._headers['content-type']) || '')
      const status = res._status || 200
      if (ct.indexOf('json') >= 0) {
        let body = null
        try { body = JSON.parse(String(res._body || '')) } catch { body = { error: 'bad-json' } }
        resolve({ status, body })
      } else {
        const bytes = Buffer.isBuffer(res._body) ? res._body : Buffer.from(String(res._body || ''))
        resolve({ status, body: { base64: bytes.toString('base64'), mime: ct } })
      }
    }
    Promise.resolve(handler(req, res)).then(finish, (err) => {
      res._status = 500
      res._headers = { 'content-type': 'application/json; charset=utf-8' }
      res._body = Buffer.from(JSON.stringify({ error: String((err && err.message) || err) }), 'utf8')
      finish()
    })
  })

  return { handle }
}
