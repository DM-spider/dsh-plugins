/**
 * LlmAdapter — 把「解读模型调用」抽象成 dsh-files 宿主侧 llm 服务的最小接口:
 * resolveRoute() 与 stream({...}),双通道:
 *   1. DeepSeek(设置 dsh-files-explain.apiKey,OpenAI 兼容端点)— 与 DSH 版同源模型;
 *   2. GitHub Copilot(vscode.lm)— 无需 key,但要求用户安装并登录 Copilot。
 *
 * stream 产出两种块:{type:'text-delta', text} 与 {type:'finish', reason:{kind}},
 * 与 services.js 的 llmCall 消费端逐字节兼容(含 finish.reason.kind !== 'stop'
 * 时的失败透传)。
 */
const vscode = require('vscode')

const textOf = (messages) => (Array.isArray(messages) ? messages : [])
  .map((m) => {
    const c = m && m.content
    if (typeof c === 'string') return c
    if (Array.isArray(c)) return c.map((p) => (p && p.type === 'text' ? p.text : '')).join('')
    return ''
  })
  .join('\n')

function createLlmAdapter(context) {
  const cfg = () => vscode.workspace.getConfiguration('dsh-files-explain')
  const getKey = async () => {
    try {
      const sk = await context.secrets.get('dsh-files-explain.apiKey')
      if (sk) return sk
    } catch { /* secrets 不可用时回落到设置项 */ }
    return String(cfg().get('apiKey') || '').trim()
  }

  let routePromise = null
  const resolveRoute = async () => {
    if (routePromise !== null) return routePromise
    routePromise = (async () => {
      const key = await getKey()
      if (key) {
        return { provider: 'deepseek', model: String(cfg().get('model') || 'deepseek-chat'), apiKey: key }
      }
      const models = await vscode.lm.selectChatModels({ vendor: 'copilot' })
      const m0 = models && models[0]
      if (m0) return { provider: 'copilot', model: String(m0.name || 'copilot'), copilotModel: m0 }
      throw new Error('没有可用的模型:请在设置「dsh-files-explain.apiKey」里配置 DeepSeek API Key,或安装并登录 GitHub Copilot')
    })()
    // 失败不缓存:配置/登录状态恢复后,下一次解读重试解析
    routePromise = routePromise.catch((err) => { routePromise = null; throw err })
    return routePromise
  }

  async function* copilotStream(route, opts, userText) {
    const model = route.copilotModel
    // Copilot 的 LanguageModelChatMessage 只有 user/assistant 两种角色,
    // system 提示折叠进 user 消息开头
    const content = (opts.system ? opts.system + '\n\n' : '') + userText
    const messages = [vscode.LanguageModelChatMessage.User(content)]
    const tokenSource = new vscode.CancellationTokenSource()
    const abort = () => tokenSource.cancel()
    if (opts.signal) {
      if (opts.signal.aborted) abort()
      else opts.signal.addEventListener('abort', abort, { once: true })
    }
    try {
      // reasoningEffort(vscode.lm 不支持)有意忽略:解读不需要推理
      const resp = await model.sendRequest(messages, {
        modelOptions: { temperature: opts.temperature ?? 0.2, max_tokens: opts.maxTokens },
      }, tokenSource.token)
      for await (const part of resp.text) {
        if (opts.signal && opts.signal.aborted) throw new Error('解读请求超时')
        yield { type: 'text-delta', text: String(part) }
      }
      yield { type: 'finish', reason: { kind: 'stop' } }
    } finally {
      if (opts.signal) opts.signal.removeEventListener('abort', abort)
      tokenSource.dispose()
    }
  }

  async function* deepseekStream(route, opts, userText) {
    const base = String(cfg().get('baseUrl') || 'https://api.deepseek.com').replace(/\/+$/, '')
    const payload = {
      model: route.model,
      messages: [
        ...(opts.system ? [{ role: 'system', content: opts.system }] : []),
        { role: 'user', content: userText },
      ],
      temperature: opts.temperature ?? 0.2,
      max_tokens: opts.maxTokens,
      stream: true,
    }
    const ctrl = new AbortController()
    const abort = () => ctrl.abort()
    if (opts.signal) {
      if (opts.signal.aborted) abort()
      else opts.signal.addEventListener('abort', abort, { once: true })
    }
    let resp
    try {
      resp = await fetch(base + '/chat/completions', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: 'Bearer ' + route.apiKey },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      })
    } finally {
      if (opts.signal) opts.signal.removeEventListener('abort', abort)
    }
    if (!resp.ok) {
      const t = await resp.text().catch(() => '')
      throw new Error('DeepSeek API ' + resp.status + ': ' + t.slice(0, 300))
    }
    const reader = resp.body.getReader()
    const dec = new TextDecoder()
    let buf = ''
    let sentFinish = false
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buf += dec.decode(value, { stream: true })
      let i
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i).trim()
        buf = buf.slice(i + 1)
        if (!line.startsWith('data:')) continue
        const data = line.slice(5).trim()
        if (data === '[DONE]') continue
        let j
        try { j = JSON.parse(data) } catch { continue }
        const ch = j.choices && j.choices[0]
        if (!ch) continue
        const d = ch.delta
        if (d && d.content) yield { type: 'text-delta', text: String(d.content) }
        if (ch.finish_reason) {
          sentFinish = true
          const reason = ch.finish_reason === 'stop'
            ? { kind: 'stop' }
            : { kind: ch.finish_reason, failure: ch.finish_reason === 'length' ? { message: '达到 max_tokens 上限' } : undefined }
          yield { type: 'finish', reason }
        }
      }
    }
    if (!sentFinish) yield { type: 'finish', reason: { kind: 'stop' } }
  }

  async function* stream(opts) {
    const route = await resolveRoute()
    const userText = textOf(opts.messages)
    if (route.provider === 'copilot') yield* copilotStream(route, opts, userText)
    else yield* deepseekStream(route, opts, userText)
  }

  return { resolveRoute, stream }
}

module.exports = { createLlmAdapter }
