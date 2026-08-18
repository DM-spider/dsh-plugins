// gen-material-icons.mjs — regenerates the inlined Material Icon Theme icon
// set inside dsh-file-explorer's client bundle (between the
// [MATERIAL_ICONS_BEGIN]/[MATERIAL_ICONS_END] markers).
//
// Source: the locally installed VS Code extension "Material Icon Theme"
// (github.com/PKief/vscode-material-icon-theme, MIT License). Icons are
// sanitized on the way in: only whitelisted shape elements and attributes
// are kept, and ids / url(#) references are prefixed per icon so gradient
// defs can never collide when several icons share one page.
//
// Usage:
//   node gen-material-icons.mjs
//   (optionally set MATERIAL_ICON_DIR / DSH_FE_CLIENT env vars to override
//    the extension path and the client bundle path)
import { readFileSync, writeFileSync } from 'node:fs';

const EXT_DIR = process.env.MATERIAL_ICON_DIR
  || 'C:/Users/employee/.vscode/extensions/pkief.material-icon-theme-5.37.0/icons';
const CLIENT_PATH = process.env.DSH_FE_CLIENT
  || 'D:/DeepSeekHarness/dsh-home/profiles/web/node_modules/dsh-file-explorer/lib/client.js';

// icon key -> icon file name (without .svg)
const ICONS = {
  markdown: 'markdown',
  drawio: 'drawio',
  javascript: 'javascript',
  react: 'react',
  typescript: 'typescript',
  react_ts: 'react_ts',
  python: 'python',
  c: 'c',
  cpp: 'cpp',
  java: 'java',
  go: 'go',
  rust: 'rust',
  console: 'console',
  powershell: 'powershell',
  database: 'database',
  php: 'php',
  ruby: 'ruby',
  swift: 'swift',
  kotlin: 'kotlin',
  html: 'html',
  css: 'css',
  sass: 'sass',
  vue: 'vue',
  json: 'json',
  yaml: 'yaml',
  toml: 'toml',
  xml: 'xml',
  table: 'table',
  settings: 'settings',
  word: 'word',
  document: 'document',
  tex: 'tex',
  powerpoint: 'powerpoint',
  pdf: 'pdf',
  image: 'image',
  svg: 'svg',
  audio: 'audio',
  video: 'video',
  zip: 'zip',
  exe: 'exe',
  dll: 'dll',
  lock: 'lock',
  log: 'log',
  git: 'git',
};

// Self-closing element whitelist and per-element attribute whitelist.
const VOID = { path: 1, circle: 1, rect: 1, polygon: 1, polyline: 1, stop: 1 };
const ATTRS = {
  path: ['d', 'fill', 'stroke', 'stroke-width', 'fill-rule', 'clip-rule', 'opacity'],
  circle: ['cx', 'cy', 'r', 'fill', 'stroke', 'stroke-width', 'opacity'],
  rect: ['x', 'y', 'width', 'height', 'rx', 'ry', 'fill', 'stroke', 'stroke-width', 'opacity'],
  polygon: ['points', 'fill', 'opacity'],
  polyline: ['points', 'fill', 'opacity'],
  defs: [],
  g: ['fill', 'opacity'],
  linearGradient: ['id', 'x1', 'y1', 'x2', 'y2', 'gradientUnits', 'gradientTransform'],
  stop: ['offset', 'stop-color', 'stop-opacity'],
};

const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Strip everything but the whitelisted shape markup; prefix ids and url(#)
// references with a per-icon namespace.
function normalize(inner, prefix) {
  const ids = new Map();
  let out = '';
  const tagRe = /<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
  let m;
  while ((m = tagRe.exec(inner)) !== null) {
    const close = m[1] === '/';
    const tag = m[2];
    const allowed = ATTRS[tag];
    if (allowed === undefined) continue; // unknown tag: drop tag, keep children
    if (close) { out += '</' + tag + '>'; continue }
    const kept = [];
    const attrRe = /([a-zA-Z-]+)\s*=\s*"([^"]*)"/g;
    let am;
    while ((am = attrRe.exec(m[3])) !== null) {
      const name = am[1];
      let value = am[2];
      if (allowed.indexOf(name) === -1) continue;
      if (name === 'id') {
        const nid = prefix + value;
        ids.set(value, nid);
        value = nid;
      } else if ((name === 'fill' || name === 'stroke') && value.startsWith('url(#')) {
        const ref = value.slice(5, -1);
        value = 'url(#' + (ids.get(ref) || prefix + ref) + ')';
      }
      kept.push(name + '="' + escapeAttr(value) + '"');
    }
    out += '<' + tag + (kept.length ? ' ' + kept.join(' ') : '') + (VOID[tag] ? '/>' : '>');
  }
  return out;
}

function buildSnippet() {
  const entries = [];
  for (const [key, file] of Object.entries(ICONS)) {
    const path = EXT_DIR.replace(/[\\/]+$/, '') + '/' + file + '.svg';
    let raw;
    try { raw = readFileSync(path, 'utf8'); }
    catch { throw new Error('missing icon file: ' + path); }
    const vb = /viewBox="([^"]+)"/.exec(raw);
    const viewBox = vb ? vb[1] : '0 0 24 24';
    const body = normalize(raw.slice(raw.indexOf('>') + 1).replace(/<\/svg>\s*$/i, ''), 'fei-' + key + '-');
    if (!/d=/.test(body)) throw new Error('icon ' + key + ' produced no path data');
    entries.push('\t\t\t' + JSON.stringify(key) + ': { viewBox: ' + JSON.stringify(viewBox) + ', body: ' + JSON.stringify(body) + ' }');
  }
  return '// AUTO-GENERATED from PKief/vscode-material-icon-theme v5.37.0 (MIT License).\n'
    + '\t\t// Regenerate with tools/gen-material-icons.mjs — do not edit by hand.\n'
    + '\t\tconst MATERIAL_ICONS = {\n' + entries.join(',\n') + '\n\t\t};';
}

const client = readFileSync(CLIENT_PATH, 'utf8');
const re = /\/\/ \[MATERIAL_ICONS_BEGIN\][\s\S]*?\/\/ \[MATERIAL_ICONS_END\]/;
if (!re.test(client)) throw new Error('markers not found in ' + CLIENT_PATH);
const patched = client.replace(re, () => '// [MATERIAL_ICONS_BEGIN]\n' + buildSnippet() + '\n\t\t// [MATERIAL_ICONS_END]');
writeFileSync(CLIENT_PATH, patched);
console.log('OK: injected ' + Object.keys(ICONS).length + ' icons into ' + CLIENT_PATH);
