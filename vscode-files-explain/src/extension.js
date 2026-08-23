/**
 * vscode-files-explain — 扩展宿主入口。
 *
 * dsh-files 的 VS Code 移植版:活动栏侧边栏 webview 视图 + postMessage 路由,
 * 全部业务逻辑在 ./host/services.js(原 dsh-files/lib/index.js 平移)。
 */
const vscode = require('vscode')
const { createFsAdapter } = require('./host/fsAdapter')
const { createLlmAdapter } = require('./host/llmAdapter')
const { createServices } = require('./host/services')

function buildHtml(webview, extensionUri) {
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'webview.js'))
  const nonce = Array.from({ length: 32 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('')
  const csp = [
    "default-src 'none'",
    `img-src ${webview.cspSource} data: blob:`,
    `style-src ${webview.cspSource} 'unsafe-inline'`,
    `script-src 'nonce-${nonce}'`,
    `font-src ${webview.cspSource} data:`,
  ].join('; ')
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<style>html,body{width:100%;height:100%;margin:0;padding:0;overflow:hidden}</style>
</head>
<body>
<script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`
}

// 工作区清单 → 面板预期格式(items 里 workspaceId/path/title/sessionIds 四字段)
function foldersPayload() {
  const items = (vscode.workspace.workspaceFolders || []).map((f) => ({
    workspaceId: f.uri.fsPath,
    path: f.uri.fsPath,
    title: f.name,
    sessionIds: [],
  }))
  return { items, active: items.length > 0 ? items[0].workspaceId : null }
}

function activate(context) {
  const fs = createFsAdapter()
  const llm = createLlmAdapter(context)
  const services = createServices({ fs, llm })
  let currentView = null

  const pushFolders = () => {
    if (!currentView) return
    currentView.webview.postMessage({ id: null, type: 'workspace/folders', body: foldersPayload() }).catch(() => {})
  }

  const provider = {
    resolveWebviewView(view) {
      currentView = view
      view.webview.options = { enableScripts: true }
      view.webview.html = buildHtml(view.webview, context.extensionUri)
      view.webview.onDidReceiveMessage(async (m) => {
        if (!m || typeof m !== 'object') return
        // 无 id 的控制消息:webview 启动后主动索要工作区清单
        if (m.type === 'workspace/init') {
          pushFolders()
          return
        }
        if (!m.id || !m.type) return
        try {
          const r = await services.handle(m.type, m.payload || {})
          await view.webview.postMessage({ id: m.id, status: r.status, body: r.body })
        } catch (err) {
          await view.webview.postMessage({ id: m.id, status: 500, body: { error: String((err && err.message) || err) } })
        }
      })
      pushFolders()
    },
  }

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('dshFiles.view', provider, {
      webviewOptions: { retainContextWhenHidden: true },
    }),
    vscode.workspace.onDidChangeWorkspaceFolders(() => pushFolders()),
  )
}

function deactivate() {}

module.exports = { activate, deactivate }
