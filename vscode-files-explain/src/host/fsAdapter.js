/**
 * FsAdapter — 把 vscode.workspace.fs 包装成 dsh-files 宿主侧 fs 服务的接口形态:
 * resolve/stat/listDir/readText/readBytes/processPath + targetKey,
 * 使 services.js 的五条路由处理函数可以不改一行直接工作。
 *
 * 差异说明(相对 DSH 沙箱 fs):
 *  - resolve 只做路径归一化,不承诺存在性(存在性由 stat 调用方检查);
 *  - listDir 不解析符号链接真实目标(环路过滤按原始路径比对,工作区内
 *    符号链接目录仍会显示,但展开路径各自独立,不会成环);
 *  - 文件大小按需并发 stat 补齐(每批 64 个),大目录展开代价可控。
 */
const vscode = require('vscode')

const normKey = (s) => String(s || '').replace(/\\/g, '/').replace(/\/+$/, '')

function createFsAdapter() {
  async function resolve(path) {
    const p = String(path || '')
    const uri = p.startsWith('file:') ? vscode.Uri.parse(p) : vscode.Uri.file(p)
    return { targetKey: uri.fsPath }
  }

  async function stat(target) {
    try {
      const st = await vscode.workspace.fs.stat(vscode.Uri.file(target.targetKey))
      return {
        type: (st.type & vscode.FileType.Directory) !== 0 ? 'directory' : 'file',
        size: typeof st.size === 'number' ? st.size : undefined,
        mtimeMs: typeof st.mtime === 'number' ? st.mtime : undefined,
      }
    } catch {
      return undefined
    }
  }

  async function listDir(target) {
    const base = vscode.Uri.file(target.targetKey)
    const raw = await vscode.workspace.fs.readDirectory(base)
    const files = raw.filter(([, ft]) => (ft & vscode.FileType.Directory) === 0)
    const sizeOf = new Map()
    for (let i = 0; i < files.length; i += 64) {
      const batch = files.slice(i, i + 64)
      await Promise.all(batch.map(async ([name]) => {
        try {
          const st = await vscode.workspace.fs.stat(vscode.Uri.joinPath(base, name))
          sizeOf.set(name, st.size)
        } catch { /* 权限/竞态:大小留空 */ }
      }))
    }
    const entries = raw.map(([name, ft]) => {
      const isDir = (ft & vscode.FileType.Directory) !== 0
      return {
        name,
        type: isDir ? 'directory' : 'file',
        size: isDir ? null : (typeof sizeOf.get(name) === 'number' ? sizeOf.get(name) : null),
        target: { targetKey: vscode.Uri.joinPath(base, name).fsPath },
      }
    })
    entries.sort((a, b) => (a.type === b.type
      ? a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
      : a.type === 'directory' ? -1 : 1))
    return entries
  }

  async function readText(target) {
    const bytes = await vscode.workspace.fs.readFile(vscode.Uri.file(target.targetKey))
    // 二进制判据与 DSH 版一致:前 8KB 含 NUL 即拒绝(services.js 按 FS_NOT_TEXT 处理)
    if (bytes.subarray(0, 8192).includes(0)) {
      const err = new Error('binary file')
      err.code = 'FS_NOT_TEXT'
      throw err
    }
    return Buffer.from(bytes).toString('utf8')
  }

  async function readBytes(target, offset, maxBytes) {
    let bytes = await vscode.workspace.fs.readFile(vscode.Uri.file(target.targetKey))
    if (offset !== undefined) bytes = bytes.subarray(offset)
    if (maxBytes !== undefined && bytes.length > maxBytes) {
      throw new Error('文件超过预览上限 ' + Math.round(maxBytes / 1024 / 1024) + 'MB')
    }
    return Buffer.from(bytes)
  }

  function processPath(target) {
    return normKey(target.targetKey)
  }

  return { resolve, stat, listDir, readText, readBytes, processPath }
}

module.exports = { createFsAdapter }
