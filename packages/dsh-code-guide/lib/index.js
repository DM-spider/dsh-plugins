/**
 * dsh-code-guide — host half.
 *
 * Registers the /plugins/code-guide/* HTTP routes for the code reading
 * companion panel (list / explain). `explain` reads the file and asks the
 * host LLM route (the default model selection) for a per-function plain
 * language breakdown plus a mermaid call graph, with a small in-memory
 * cache keyed by path + mtime.
 *
 * @module dsh-code-guide
 */
export const name = 'code-guide'
export const inject = ['fs']

const MAX_EXPLAIN_BYTES = 1000000
// Code passed to the model is capped separately: the panel still shows the
// whole file (up to 10000 lines client-side), but a very long file is only
// analyzed up to this many chars to stay inside model context.
const LLM_CODE_CAP = 400000

const SYSTEM_PROMPT = [
  '你是一位资深代码讲解老师,面向初学者做逐函数解读。用户会贴出一段源代码。',
  '请输出严格合法的 JSON(不要输出 JSON 之外的任何内容,不要 Markdown 代码围栏,不要注释),结构如下:',
  '{',
  '  "functions": [',
  '    {"name": "函数名(类方法写成 Class.method)", "start": 起始行号, "end": 结束行号, "summary": "一句话:这个函数做什么", "flow": "执行流程与数据流转(通俗中文,分步骤,解释为什么这样做)", "formula": "关键公式或核心算法说明;没有则为空字符串"}',
  '  ],',
  '  "callGraph": "mermaid 源码(flowchart 或 graph),展示函数之间的调用关系,只输出 mermaid 语句本身"',
  '}',
  '要求:',
  '- start/end 是该函数在源代码中的真实行号(从 1 开始),不要估算偏差',
  '- 按代码出现顺序列出主要函数;没有函数(纯配置/文本)时 functions 为空数组',
  '- 解读要通俗,说人话,重点讲"数据怎么进、怎么流转、得到什么"',
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

  // One-shot model call through the host LLM service. Uses the default
  // model selection (agentDefaultModel) when available, otherwise the first
  // registered provider/model. Consumes raw stream chunks by hand so this
  // bundle needs no runtime imports.
  const llmCall = async (system, userText, maxTokens, signal) => {
    const llm = ctx.get('llm')
    if (llm === undefined) throw new Error('llm 服务不可用')
    let provider = null
    let model = null
    const sel = ctx.get('agentDefaultModel')
    if (sel !== undefined && typeof sel.currentSelection === 'function') {
      try {
        const cur = sel.currentSelection()
        if (cur && cur.provider && cur.model) { provider = cur.provider; model = cur.model }
      } catch { /* fall through */ }
    }
    if (provider === null) {
      const providers = llm.listProviders ? llm.listProviders() : []
      if (!providers || providers.length === 0) throw new Error('没有注册任何模型供应商')
      const p0 = providers[0]
      provider = p0.provider || p0.id || p0.name || String(p0)
      if (llm.listModels) {
        const models = await llm.listModels(provider)
        const m0 = models && models[0]
        model = m0 ? (m0.model || m0.id || m0.name || String(m0)) : null
      }
    }
    if (!provider || !model) throw new Error('无法解析模型路由')
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
        const langHint = path.includes('.') ? path.slice(path.lastIndexOf('.') + 1).toLowerCase() : ''
        const baseName = path.split(/[\\/]/).pop()
        const llmTruncated = content.length > LLM_CODE_CAP
        const codeForLlm = llmTruncated ? content.slice(0, LLM_CODE_CAP) : content
        const userText = '文件名: ' + baseName + (langHint ? ' (语言/类型: ' + langHint + ')' : '')
          + (llmTruncated ? ' (文件很长,只发给你前 ' + LLM_CODE_CAP + ' 个字符,解读这部分即可)' : '')
          + '\n\n```\n' + codeForLlm + '\n```'
        const { text, provider, model } = await llmCall(SYSTEM_PROMPT, userText, 6000)
        const parsed = parseJson(text)
        const rawFunctions = Array.isArray(parsed.functions) ? parsed.functions : []
        const functions = rawFunctions.map((f) => ({
          name: String((f && f.name) || ''),
          start: Math.max(1, Number(f && f.start) || 1),
          end: Math.max(1, Number(f && f.end) || 1),
          summary: String((f && f.summary) || ''),
          flow: String((f && f.flow) || ''),
          formula: String((f && f.formula) || ''),
        })).filter((f) => f.name)
        const callGraph = String(parsed.callGraph || '')
        const data = { path, content, size, functions, callGraph, model: provider + '/' + model, llmTruncated }
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
