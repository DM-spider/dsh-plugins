/**
 * vscode-files-explain — webview 入口(shim + 挂载层)。
 *
 * panel-vendored.js 是 dsh-files/lib/client.js 的整文件拷贝,原样打包;
 * 本文件只提供它预期的运行环境:
 *   1. window.__ModuleLoader__.load —— 模块装载器桩(react 由 bundle 提供)
 *   2. fetch → postMessage 路由(/plugins/dsh-files/* 五条接口,签名不变)
 *   3. window.__GenuiAssets__.mermaid —— mermaid 引擎(bundle 内置)
 *   4. <img>/<iframe> 的 /raw 字节流 URL —— MutationObserver 换成 data URI
 *   5. 设计 token 映射(--dsw-alias-* → --vscode-*,共 11 个)
 *   6. 工作区/会话 props 桩(useWorkspaces/useSessions,喂给 GuidePanel)
 */
const vscode = acquireVsCodeApi()
const React = require('react')
const ReactDOM = require('react-dom/client')
const mermaidMod = require('mermaid')
const mermaid = mermaidMod.default || mermaidMod

// ---------- 设计 token 映射:DSH 的 11 个别名 → VS Code 主题变量 ----------
const tokenStyle = document.createElement('style')
tokenStyle.textContent = `
:root {
  --dsw-alias-bg-layer-1: var(--vscode-sideBar-background);
  --dsw-alias-bg-layer-2: var(--vscode-editor-background);
  --dsw-alias-bg-overlay: var(--vscode-sideBar-background);
  --dsw-alias-border-l1: var(--vscode-panel-border);
  --dsw-alias-border-l2: var(--vscode-panel-border);
  --dsw-alias-brand-primary: var(--vscode-focusBorder);
  --dsw-alias-interactive-bg-hover: var(--vscode-list-hoverBackground);
  --dsw-alias-label-primary: var(--vscode-foreground);
  --dsw-alias-label-secondary: var(--vscode-descriptionForeground);
  --dsw-alias-state-error-primary: var(--vscode-errorForeground);
  --dsw-alias-state-success-primary: var(--vscode-testing-iconPassed, #73c991);
}`
document.head.appendChild(tokenStyle)

// ---------- mermaid 引擎(bundle 内置,替换 @omdsh-dev/dsh-genui) ----------
let mmdSeq = 0
mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'strict' })
window.__GenuiAssets__ = {
  mermaid: {
    renderMermaid: async (code) => {
      const { svg } = await mermaid.render('dshf-mmd-' + (++mmdSeq), String(code))
      return svg
    },
  },
}

// ---------- postMessage 请求层(带 id 关联,Promise 语义) ----------
let seq = 0
const pendingMap = new Map()
function request(type, payload) {
  return new Promise((resolve) => {
    const id = 'm' + (++seq)
    pendingMap.set(id, resolve)
    vscode.postMessage({ id, type, payload: payload || {} })
  })
}

// ---------- 工作区/会话 props 桩 ----------
let wsState = { items: [], recentWorkspaceId: null }
const wsListeners = new Set()
function notifyWs() { for (const l of wsListeners) l() }
const useWorkspaces = (sel) => {
  const [v, setV] = React.useState(() => sel(wsState))
  React.useEffect(() => {
    const l = () => setV(sel(wsState))
    wsListeners.add(l)
    return () => { wsListeners.delete(l) }
  }, [])
  return v
}
const useSessions = (sel) => sel({ current: null })

window.addEventListener('message', (e) => {
  const m = e.data
  if (!m || typeof m !== 'object') return
  if (m.type === 'workspace/folders') {
    wsState = {
      items: Array.isArray(m.body && m.body.items) ? m.body.items : [],
      recentWorkspaceId: (m.body && m.body.active) || null,
    }
    notifyWs()
    return
  }
  if (m.id) {
    const done = pendingMap.get(m.id)
    if (done) {
      pendingMap.delete(m.id)
      done(m.body)
    }
  }
})
vscode.postMessage({ id: null, type: 'workspace/init' })

// ---------- fetch shim:把 /plugins/dsh-files/* 请求路由到 postMessage ----------
const realFetch = window.fetch ? window.fetch.bind(window) : null
window.fetch = (url, opts) => {
  const u = String(url)
  if (u.indexOf('/plugins/dsh-files/') !== 0) {
    if (realFetch) return realFetch(url, opts)
    return Promise.reject(new Error('fetch 不可用'))
  }
  let type = 'unknown'
  let payload = {}
  if (u.indexOf('/plugins/dsh-files/explain') === 0) {
    type = 'explain'
    try { payload = JSON.parse((opts && opts.body) || '{}') } catch { payload = {} }
  } else {
    const m = u.match(/^\/plugins\/dsh-files\/(list|search|read|raw)\?(.+)$/)
    if (m) {
      type = m[1]
      for (const [k, v] of new URLSearchParams(m[2])) payload[k] = v
    }
  }
  return Promise.resolve({ json: () => request(type, payload) })
}

// ---------- /raw 字节流:img/iframe 的 src 无法走 fetch,用观察器换 data URI ----------
const rawCache = new Map()
const rawPending = new Set()
const isRawEl = (n) => !!n && (n.tagName === 'IMG' || n.tagName === 'IFRAME')
const rawObserver = new MutationObserver((muts) => {
  const els = new Set()
  for (const mu of muts) {
    if (mu.type === 'childList') {
      for (const n of mu.addedNodes) {
        if (n.nodeType !== 1) continue
        if (isRawEl(n)) els.add(n)
        if (n.querySelectorAll) n.querySelectorAll('img, iframe').forEach((c) => { if (isRawEl(c)) els.add(c) })
      }
    } else if (mu.type === 'attributes' && isRawEl(mu.target)) {
      els.add(mu.target)
    }
  }
  for (const el of els) {
    const src = el.getAttribute('src') || ''
    const m = src.match(/^\/plugins\/dsh-files\/raw\?(.+)$/)
    if (!m) continue
    const payload = {}
    for (const [k, v] of new URLSearchParams(m[1])) payload[k] = v
    const key = (payload.path || '') + '\u0000' + (payload.root || '')
    if (rawCache.has(key)) {
      el.setAttribute('src', rawCache.get(key))
      continue
    }
    if (rawPending.has(key)) continue
    rawPending.add(key)
    request('raw', payload).then((body) => {
      rawPending.delete(key)
      const uri = body && body.base64 ? 'data:' + (body.mime || 'application/octet-stream') + ';base64,' + body.base64 : ''
      rawCache.set(key, uri)
      if (el.isConnected) el.setAttribute('src', uri)
    }).catch(() => {
      rawPending.delete(key)
      rawCache.set(key, '')
      if (el.isConnected) el.setAttribute('src', '')
    })
  }
})
rawObserver.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['src'] })

// ---------- 模块装载器桩 + 面板挂载 ----------
let panelExports = null
window.__ModuleLoader__ = {
  load: (spec) => {
    panelExports = spec.factory((name) => {
      if (name === 'react') return React
      throw new Error('panel 请求了未预期的模块: ' + name)
    })
  },
}
require('./panel-vendored.js')

let mountComponent = null
const fakeSlots = {
  register(opts, Component) {
    if (opts && opts.id === 'dsh-files') mountComponent = Component
    return () => {}
  },
  inject(name, cb) {
    // 只挂载 shell.overlay(右侧面板);标题栏开关按钮是 DSH 专属,直接忽略
    if (name === 'shell.overlay') {
      try { return cb() } catch (err) { console.error('[dsh-files] shell.overlay 注册失败', err) }
    }
    return () => {}
  },
}
const fakeCtx = {
  get: (n) => (n === 'slots' ? fakeSlots : undefined),
  effect: () => () => {},
  on: () => () => {},
}
if (panelExports && typeof panelExports.apply === 'function') panelExports.apply(fakeCtx)

const rootEl = document.createElement('div')
document.body.appendChild(rootEl)
const root = ReactDOM.createRoot(rootEl)
const shimProps = { useSessions, useWorkspaces }
if (mountComponent) {
  root.render(React.createElement(mountComponent, shimProps))
} else {
  rootEl.textContent = '文件解读面板加载失败(未注册 shell.overlay 组件)'
}
