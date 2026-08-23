import { build, context } from 'esbuild'
import { createRequire } from 'node:module'

const require2 = createRequire(import.meta.url)
const watch = process.argv.includes('--watch')

const common = { bundle: true, charset: 'utf8', logLevel: 'info', legalComments: 'none' }

const host = {
  entryPoints: ['src/extension.js'],
  outfile: 'dist/extension.js',
  platform: 'node',
  format: 'cjs',
  external: ['vscode'],
  target: ['node18'],
  ...common,
}

const web = {
  entryPoints: ['src/webview/entry.js'],
  outfile: 'dist/webview.js',
  platform: 'browser',
  format: 'iife',
  target: ['chrome110'],
  define: { 'process.env.NODE_ENV': '"production"' },
  // mermaid 包主入口是 core 版(动态 import 各图表类型),iife 无法拆包;
  // 直接用全量 min bundle,避免运行时再加载任何图表模块
  alias: { mermaid: require2.resolve('mermaid/dist/mermaid.esm.min.mjs') },
  ...common,
}

if (watch) {
  const [hc, wc] = await Promise.all([context(host), context(web)])
  await Promise.all([hc.watch(), wc.watch()])
  console.log('[build] watching…')
} else {
  await Promise.all([build(host), build(web)])
  console.log('[build] done: dist/extension.js + dist/webview.js')
}
