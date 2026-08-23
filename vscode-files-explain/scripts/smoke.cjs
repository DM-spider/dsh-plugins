/**
 * 冒烟测试:用桩 fs(与 FsAdapter 同契约,Node 原生实现)驱动移植后的
 * services.js 分发器,验证 list/read/search/raw/explain 五条路由、
 * 工作区越界 403、二进制识别与 raw base64 转换。
 *
 * 运行:node scripts/smoke.cjs(vscode 模块不参与,可在 CI 直接跑)
 */
const path = require('node:path')
const os = require('node:os')
const fsmod = require('node:fs')
const esbuild = require('esbuild')

// services.js 是 ESM(与主 bundle 相同),先用 esbuild 转成临时 CJS 再加载,
// 测的正是打包产物同一条代码路径
const bundled = path.join(os.tmpdir(), 'vfe-services-smoke.cjs')
esbuild.buildSync({
  entryPoints: [path.join(__dirname, '..', 'src', 'host', 'services.js')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: bundled,
  logLevel: 'silent',
})
const { createServices } = require(bundled)

const normKey = (s) => String(s || '').replace(/\\/g, '/').replace(/\/+$/, '')
const stubFs = {
  async resolve(p) { return { targetKey: path.resolve(String(p)) } },
  async stat(t) {
    try {
      const st = fsmod.statSync(t.targetKey)
      return { type: st.isDirectory() ? 'directory' : 'file', size: st.size, mtimeMs: st.mtimeMs }
    } catch { return undefined }
  },
  async listDir(t) {
    const names = fsmod.readdirSync(t.targetKey)
    return names.map((name) => {
      const full = path.join(t.targetKey, name)
      const st = fsmod.statSync(full)
      return { name, type: st.isDirectory() ? 'directory' : 'file', size: st.isDirectory() ? null : st.size, target: { targetKey: full } }
    })
  },
  async readText(t) {
    const buf = fsmod.readFileSync(t.targetKey)
    if (buf.subarray(0, 8192).includes(0)) { const e = new Error('binary'); e.code = 'FS_NOT_TEXT'; throw e }
    return buf.toString('utf8')
  },
  async readBytes(t, offset, maxBytes) {
    let buf = fsmod.readFileSync(t.targetKey)
    if (offset !== undefined) buf = buf.subarray(offset)
    if (maxBytes !== undefined && buf.length > maxBytes) throw new Error('too large')
    return buf
  },
  processPath(t) { return normKey(t.targetKey) },
}
const noLlm = {
  resolveRoute: async () => { throw new Error('没有可用的模型') },
  stream: async function* () { throw new Error('没有可用的模型') },
}

let failed = 0
const check = (name, cond, extra) => {
  if (cond) console.log('  ✓ ' + name)
  else { failed += 1; console.error('  ✗ ' + name, extra === undefined ? '' : JSON.stringify(extra)) }
}

async function main() {
  const root = fsmod.mkdtempSync(path.join(os.tmpdir(), 'vfe-smoke-'))
  const outside = fsmod.mkdtempSync(path.join(os.tmpdir(), 'vfe-out-'))
  fsmod.writeFileSync(path.join(root, 'a.md'), '# hello\n\n世界\n')
  fsmod.writeFileSync(path.join(root, 'b.png'), Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 1, 2, 3]))
  fsmod.mkdirSync(path.join(root, 'sub'))
  fsmod.writeFileSync(path.join(root, 'sub', 'x.txt'), 'x-content')
  fsmod.writeFileSync(path.join(outside, 'evil.txt'), 'evil')

  const services = createServices({ fs: stubFs, llm: noLlm })
  const norm = (p) => normKey(path.resolve(p))

  const list = await services.handle('list', { path: root, root })
  check('list 200 + 条目齐全', list.status === 200 && list.body.entries.some((e) => e.name === 'a.md') && list.body.entries.some((e) => e.name === 'sub'), list)

  const read = await services.handle('read', { path: path.join(root, 'a.md'), root })
  check('read 200 + 内容一致', read.status === 200 && read.body.content.includes('世界'), read)

  const readBin = await services.handle('read', { path: path.join(root, 'b.png'), root })
  check('read 二进制 → binary:true', readBin.status === 200 && readBin.body.binary === true, readBin)

  const raw = await services.handle('raw', { path: path.join(root, 'b.png'), root })
  check('raw → base64 + image/png', raw.status === 200 && raw.body.mime === 'image/png' && raw.body.base64.length > 0, raw.status)

  const search = await services.handle('search', { root, q: 'x.txt' })
  check('search 命中 x.txt', search.status === 200 && search.body.matches.some((m) => m.name === 'x.txt'), search)

  const evil = await services.handle('read', { path: path.join(outside, 'evil.txt'), root })
  check('越界 read → 403', evil.status === 403, evil)

  const evilList = await services.handle('list', { path: outside, root })
  check('越界 list → 403', evilList.status === 403, evilList)

  const missing = await services.handle('list', { path: path.join(root, 'no-such'), root })
  check('不存在目录 → 404', missing.status === 404, missing)

  const unknown = await services.handle('nope', {})
  check('未知消息类型 → 404', unknown.status === 404, unknown)

  const explain = await services.handle('explain', { path: path.join(root, 'a.md'), root })
  // 模型不可用时解读流水线优雅降级:200 + 空结果 + warnings 携带指引
  // (与 DSH 版行为一致,不把模型错误当 500 抛给 UI)
  check('explain 无模型 → 200 优雅降级(警告带指引)', explain.status === 200 && Array.isArray(explain.body.warnings) && explain.body.warnings.join('').includes('模型') && explain.body.functions.length === 0, explain)

  fsmod.rmSync(root, { recursive: true, force: true })
  fsmod.rmSync(outside, { recursive: true, force: true })
  console.log(failed === 0 ? '\n全部通过 ✓' : '\n失败 ' + failed + ' 项')
  process.exit(failed === 0 ? 0 : 1)
}

main().catch((err) => { console.error(err); process.exit(1) })
