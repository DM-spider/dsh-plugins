window.__ModuleLoader__.load({
	id: "dsh-files",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		var react = require("react");

		// ---------- styles ----------
		const CSS = `
html {
  --cg-width: 560px;
  --cg-shift: calc(var(--cg-width) + 12px);
}
html[data-cg-panel-open] [data-phase=active] {
  box-sizing: border-box;
  padding-right: var(--cg-shift);
}
.cg-panel {
  position: fixed; top: 0; right: 0; bottom: 0; z-index: 100;
  display: flex; flex-direction: column;
  background: var(--dsw-alias-bg-overlay);
  border-left: 1px solid var(--dsw-alias-border-l1);
  box-shadow: -4px 0 16px rgba(0,0,0,.12);
  color: var(--dsw-alias-label-primary);
  font-size: 13px; line-height: 1.45;
  max-width: calc(100vw - 90px);
  pointer-events: auto;
  box-sizing: border-box;
}
.cg-panel * { box-sizing: border-box; }
.cg-resize {
  position: absolute; left: -4px; top: 0; bottom: 0; width: 8px;
  cursor: col-resize; z-index: 5; touch-action: none;
}
.cg-resize:hover { background: var(--dsw-alias-brand-primary); opacity: .35; }
.cg-collapse-tab {
  position: absolute; left: -17px; top: 50%; transform: translateY(-50%);
  width: 18px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  padding: 0;
  border: 1px solid var(--dsw-alias-border-l1); border-right: none;
  border-radius: 7px 0 0 7px;
  background: var(--dsw-alias-bg-overlay);
  color: var(--dsw-alias-label-secondary);
  box-shadow: -3px 0 8px rgba(0,0,0,.10);
  cursor: pointer; z-index: 6;
}
.cg-collapse-tab:hover { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-brand-primary); }
.cg-drag-capture {
  position: fixed; inset: 0; z-index: 9999; cursor: col-resize;
  background: transparent;
}
.cg-header {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 8px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  flex: none;
}
.cg-title { font-weight: 600; flex: 1; padding: 0 4px; }
.cg-iconbtn {
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; padding: 0;
  border: none; border-radius: 5px;
  background: transparent; color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}
.cg-iconbtn:hover { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); }
.cg-body { flex: 1; display: flex; min-height: 0; }
.cg-tree {
  flex: none; overflow: hidden; user-select: none;
  display: flex; flex-direction: column;
}
.cg-trow {
  display: flex; align-items: center; gap: 3px;
  padding: 2px 6px; margin: 0 2px;
  border-radius: 4px; cursor: pointer; white-space: nowrap;
}
.cg-trow:hover { background: var(--dsw-alias-bg-layer-1); }
.cg-trow-sel { background: var(--dsw-alias-bg-layer-2); }
.cg-trow-name { overflow: hidden; text-overflow: ellipsis; font-size: 12px; }
.cg-trow-dir { color: var(--dsw-alias-brand-primary); }
.cg-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.cg-split { flex: 1; display: flex; min-height: 0; }
.cg-divider {
  flex: none; width: 5px; position: relative;
  cursor: col-resize; touch-action: none; z-index: 1;
}
.cg-divider::before {
  content: ''; position: absolute; left: -4px; right: -4px; top: 0; bottom: 0;
}
.cg-divider::after {
  content: ''; position: absolute; left: 2px; right: 2px; top: 0; bottom: 0;
  background: var(--dsw-alias-border-l1);
  transition: background .12s ease;
}
.cg-divider:hover::after, .cg-divider-on::after { background: var(--dsw-alias-brand-primary); }
.cg-code-pane { flex: none; display: flex; flex-direction: column; min-width: 0; overflow: hidden; position: relative; }
.cg-tabsbar {
  display: flex; align-items: stretch; gap: 2px;
  padding: 3px 6px 0; flex: none;
  overflow-x: auto; overflow-y: hidden; scrollbar-width: thin;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-1);
}
.cg-filetab {
  display: flex; align-items: center; gap: 4px;
  padding: 3px 5px 3px 7px; flex: none; max-width: 170px; min-width: 0;
  border: 1px solid var(--dsw-alias-border-l1); border-bottom: none;
  border-radius: 6px 6px 0 0;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
  font-size: 11px; cursor: pointer; user-select: none;
}
.cg-filetab:hover { color: var(--dsw-alias-label-primary); }
.cg-filetab-on {
  background: var(--dsw-alias-bg-overlay);
  color: var(--dsw-alias-label-primary);
  border-top: 1px solid var(--dsw-alias-brand-primary);
}
.cg-filetab-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* 预览文件(VSCode 风格):页签栏斜体,双击固定后变正体 */
.cg-filetab-preview .cg-filetab-name { font-style: italic; }
.cg-filetab-dot { color: var(--dsw-alias-brand-primary); flex: none; }
.cg-filetab-x {
  display: flex; align-items: center; justify-content: center;
  width: 14px; height: 14px; margin: 0; padding: 0; flex: none;
  border: none; border-radius: 3px; background: transparent;
  color: var(--dsw-alias-label-secondary); cursor: pointer;
}
.cg-filetab-x:hover { background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); }
.cg-pane-head {
  display: flex; align-items: center; gap: 6px;
  padding: 4px 8px; flex: none;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-secondary); font-size: 12px;
}
.cg-pane-head .cg-pane-title { font-weight: 600; color: var(--dsw-alias-label-primary); flex: none; }
.cg-pane-path { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; }
.cg-tabs .cg-tab-close { margin-left: auto; }
.cg-code {
  flex: 1; overflow: auto; margin: 0;
  font-family: ui-monospace, SFMono-Regular, Consolas, 'Courier New', monospace;
  font-size: 14px; line-height: 21px;
  background: var(--dsw-alias-bg-layer-1);
}
.cg-line { display: flex; white-space: pre; min-width: max-content; cursor: pointer; }
.cg-line:hover { background: var(--dsw-alias-bg-layer-2); }
.cg-ln {
  flex: none; width: 52px; padding-right: 10px; text-align: right;
  color: var(--dsw-alias-label-secondary); user-select: none;
  border-right: 1px solid var(--dsw-alias-border-l1); margin-right: 10px;
  background: var(--dsw-alias-bg-overlay);
  position: sticky; left: 0;
}
.cg-code-text { padding-right: 14px; }
.cg-hl .cg-tok-c { color: var(--cg-hl-comment, #7f848e); font-style: italic; }
.cg-hl .cg-tok-s { color: var(--cg-hl-string, #98c379); }
.cg-hl .cg-tok-n { color: var(--cg-hl-number, #d19a66); }
.cg-hl .cg-tok-k { color: var(--cg-hl-keyword, #c678dd); }
.cg-hl .cg-tok-b { color: var(--cg-hl-builtin, #56b6c2); }
.cg-hl .cg-tok-t { color: var(--cg-hl-type, #e5c07b); }
.cg-hl .cg-tok-f { color: var(--cg-hl-func, #61afef); }
.cg-hl .cg-tok-p { color: var(--cg-hl-prop, #e06c75); }
.cg-hl .cg-tok-o { color: var(--cg-hl-operator, #abb2bf); }
.cg-hl .cg-tok-a { color: var(--cg-hl-attr, #d19a66); }
.cg-hl .cg-tok-d { color: var(--cg-hl-directive, #c678dd); }
.cg-line-hi { background: var(--dsw-alias-interactive-bg-hover); }
.cg-line-hi .cg-ln { color: var(--dsw-alias-brand-primary); font-weight: 700; }
.cg-line-jump { animation: cg-line-jump 2s ease-out 1; }
@keyframes cg-line-jump {
  0% { background: rgba(59, 130, 246, .45); }
  100% { background: transparent; }
}
.cg-guide-pane { flex: 1 1 auto; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }
.cg-tabs { display: flex; gap: 2px; padding: 4px 8px 0; flex: none; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.cg-tab {
  padding: 4px 10px; border: none; border-bottom: 2px solid transparent;
  background: transparent; color: var(--dsw-alias-label-secondary);
  font-size: 12px; cursor: pointer;
}
.cg-tab:hover { color: var(--dsw-alias-label-primary); }
.cg-tab-on { color: var(--dsw-alias-brand-primary); border-bottom-color: var(--dsw-alias-brand-primary); font-weight: 600; }
.cg-guide { flex: 1; overflow: auto; padding: 8px; }
.cg-card {
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px;
  padding: 8px 10px; margin-bottom: 8px;
  background: var(--dsw-alias-bg-layer-1);
}
/* 主解读区(函数名 + 摘要)是卡片内唯一可点击跳转的区域 */
.cg-card-main { cursor: pointer; border-radius: 6px; }
.cg-card-main:hover { background: var(--dsw-alias-interactive-bg-hover); }
.cg-card-on { border-color: var(--dsw-alias-brand-primary); box-shadow: 0 0 0 1px var(--dsw-alias-brand-primary); }
.cg-item-flash { animation: cg-card-flash 2s ease-out 1; }
@keyframes cg-card-flash {
  0% { background: rgba(59, 130, 246, .28); border-color: var(--dsw-alias-brand-primary); }
  100% { background: transparent; }
}
.cg-card-head { display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px; }
.cg-card-name { font-weight: 700; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 12.5px; color: var(--dsw-alias-brand-primary); word-break: break-all; }
.cg-card-lines { flex: none; color: var(--dsw-alias-label-secondary); font-size: 11px; }
.cg-card-summary { margin: 2px 0 6px; }
.cg-card-label {
  font-size: 11px; font-weight: 700; color: var(--dsw-alias-label-secondary);
  margin-top: 8px; padding-top: 6px;
  border-top: 1px dashed var(--dsw-alias-border-l2);
  letter-spacing: .3px;
}
.cg-card-flow-md { margin: 2px 0; color: var(--dsw-alias-label-primary); }
.cg-card-flow-md ol { margin: 0; padding-left: 20px; }
.cg-card-flow-md li { margin: 3px 0; line-height: 1.55; }
.cg-card-flow-md p { margin: 3px 0; }
.cg-card-flow-md code {
  background: var(--dsw-alias-bg-layer-2); border-radius: 3px; padding: 0 4px;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 11.5px;
  color: var(--dsw-alias-brand-primary);
}
.cg-card-flow-md strong { font-weight: 700; }
.cg-var { cursor: pointer; }
.cg-var:hover { text-decoration: underline; }
.cg-var-hit {
  border-radius: 2px; padding: 0 1px;
  animation: cg-flash 2s ease-in-out 1 both;
}
@keyframes cg-flash {
  0% { background-color: rgba(59, 130, 246, .95); color: #fff; }
  100% { background-color: transparent; color: inherit; }
}
/* 文件内搜索命中高亮:普通命中黄、当前命中橙 */
.cg-find-hit {
  background-color: rgba(250, 204, 21, .28);
  border-radius: 2px; padding: 0 1px;
}
.cg-find-cur {
  background-color: rgba(249, 115, 22, .5);
  outline: 1px solid rgba(249, 115, 22, .85);
  border-radius: 2px; padding: 0 1px;
}
.cg-findbar {
  display: flex; align-items: center; gap: 6px; flex: none;
  padding: 5px 8px; border-bottom: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-1);
}
.cg-find-input {
  flex: 1; min-width: 60px; padding: 4px 8px;
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 4px;
  background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary);
  font-size: 12px; outline: none;
}
.cg-find-input:focus { border-color: var(--dsw-alias-brand-primary); }
.cg-find-count {
  flex: none; font-size: 11px; color: var(--dsw-alias-label-secondary);
  white-space: nowrap; min-width: 46px; text-align: right;
}
.cg-find-nav { width: 22px; height: 22px; font-size: 11px; font-weight: 600; }
/* 图片预览 */
.cg-imgbox {
  flex: 1; overflow: auto; display: flex; align-items: center; justify-content: center;
  background: var(--dsw-alias-bg-layer-1); padding: 12px; min-height: 0;
}
.cg-imgbox-img {
  max-width: 100%; max-height: 100%; object-fit: contain;
  border-radius: 6px; box-shadow: 0 2px 10px rgba(0, 0, 0, .25);
}
/* PDF 预览 */
.cg-pdfbox { flex: 1; display: flex; flex-direction: column; min-height: 0; background: var(--dsw-alias-bg-layer-1); }
.cg-pdf-frame { flex: 1; width: 100%; border: none; background: #525659; }
/* md 目录浮层 */
.cg-outline {
  position: absolute; right: 8px; top: 68px; width: 250px; max-height: 62%;
  overflow: auto; z-index: 30; padding: 4px;
  background: var(--dsw-alias-bg-overlay);
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, .35);
}
.cg-outline-head {
  padding: 2px 8px 6px; font-size: 11px; font-weight: 600;
  color: var(--dsw-alias-label-secondary); border-bottom: 1px solid var(--dsw-alias-border-l1);
  margin-bottom: 4px;
}
.cg-outline-row {
  display: flex; align-items: center; gap: 6px; padding: 3px 8px;
  border-radius: 4px; cursor: pointer; font-size: 12px;
  color: var(--dsw-alias-label-primary); user-select: none;
}
.cg-outline-row:hover { background: var(--dsw-alias-bg-layer-2); }
.cg-outline-on { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-brand-primary); }
.cg-outline-kind {
  flex: none; width: 34px; font-size: 10px;
  color: var(--dsw-alias-brand-primary); opacity: .85;
}
.cg-outline-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cg-outline-line { flex: none; font-size: 10px; color: var(--dsw-alias-label-secondary); }
.cg-btn-on {
  border-color: var(--dsw-alias-brand-primary) !important;
  color: var(--dsw-alias-brand-primary) !important;
}
.cg-card-formula {
  margin: 4px 0 0; padding: 6px 8px;
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 6px;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 12px;
  white-space: pre-wrap; word-break: break-word;
}
.cg-empty { color: var(--dsw-alias-label-secondary); padding: 16px 12px; font-size: 12px; }
.cg-error { color: var(--dsw-alias-state-error-primary); padding: 12px; font-size: 12px; white-space: pre-wrap; }
.cg-meta { padding: 4px 10px; color: var(--dsw-alias-label-secondary); font-size: 11px; flex: none; border-top: 1px solid var(--dsw-alias-border-l1); }
.cg-toggle {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; padding: 0;
  border: 1px solid var(--dsw-alias-border-l2); border-radius: 18px;
  background: transparent; color: var(--dsw-alias-label-primary);
  cursor: pointer; flex: none;
}
.cg-toggle:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.cg-toggle svg { flex: none; }
.cg-toggle-on { color: var(--dsw-alias-brand-primary); }
.cg-mermaid {
  margin: 8px; padding: 8px;
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px;
  overflow: auto;
}
.cg-mermaid svg { max-width: 100%; height: auto; display: block; margin: 0 auto; }
.cg-mermaid g.node:hover { filter: brightness(1.12); }
.cg-graph { display: flex; flex-direction: column; height: 100%; min-height: 0; }
.cg-graph-toolbar {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 10px; flex: none;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
}
.cg-gbtn {
  padding: 0; width: 24px; height: 24px; flex: none;
  display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid var(--dsw-alias-border-l2); border-radius: 5px;
  background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary);
  font-size: 13px; line-height: 1; cursor: pointer;
}
.cg-gbtn:hover { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); }
.cg-graph-viewport {
  flex: 1; overflow: auto; position: relative;
  user-select: none; touch-action: none; cursor: grab;
}
.cg-graph-viewport .cg-mermaid { margin: 8px; }
/* 缩放由 wrapper 宽度驱动:SVG 始终填满(矢量无损),滚动条随缩放正确变化 */
.cg-graph-viewport .cg-mermaid svg { width: 100%; }
.cg-mermaid-pending { color: var(--dsw-alias-label-secondary); font-size: 12px; padding: 6px 4px; }
.cg-mermaid-error { color: var(--dsw-alias-state-error-primary); font-size: 12px; margin-bottom: 6px; }
.cg-mermaid-src {
  margin: 0; padding: 8px 10px;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 6px;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 12px; overflow: auto; white-space: pre-wrap;
}
/* ---------- 文件树增强 ---------- */
.cg-tree-scroll { flex: 1; overflow: auto; padding: 2px 0 8px; }
.cg-searchbar { position: relative; padding: 6px 8px 4px; flex: none; user-select: text; }
.cg-search {
  width: 100%; padding: 5px 22px 5px 8px;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 5px;
  color: var(--dsw-alias-label-primary); font-size: 12px; outline: none;
}
.cg-search:focus { border-color: var(--dsw-alias-brand-primary); }
.cg-search::placeholder { color: var(--dsw-alias-label-secondary); }
.cg-search-state {
  position: absolute; right: 16px; top: 10px;
  color: var(--dsw-alias-label-secondary); font-size: 11px;
}
.cg-node-icon { display: flex; flex: none; }
.cg-node-file { color: var(--dsw-alias-label-secondary); }
.cg-trow-size, .cg-trow-rel {
  margin-left: auto; padding-left: 8px; flex: none;
  color: var(--dsw-alias-label-secondary); font-size: 11px;
}
.cg-trow-rel { max-width: 45%; overflow: hidden; text-overflow: ellipsis; }
.cg-trow-error { color: var(--dsw-alias-state-error-primary); font-size: 12px; padding: 4px 8px; }
.cg-iconbtn-on { color: var(--dsw-alias-brand-primary); }
.cg-status { flex: none; font-size: 11px; }
.cg-status-ok { color: var(--dsw-alias-state-success-primary); }
.cg-status-err { color: var(--dsw-alias-state-error-primary); }
.cg-btn {
  padding: 2px 9px; flex: none;
  border: 1px solid var(--dsw-alias-border-l2); border-radius: 5px;
  background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary);
  font-size: 12px; cursor: pointer;
}
.cg-btn:hover { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); }
/* ---------- Markdown 预览 ---------- */
.cg-hl { tab-size: 4; }
.cg-md {
  flex: 1; overflow: auto; padding: 10px 14px;
  font-size: 13px; line-height: 1.6; word-break: break-word;
}
.cg-md h1 { font-size: 20px; margin: 10px 0 6px; }
.cg-md h2 { font-size: 17px; margin: 10px 0 6px; }
.cg-md h3 { font-size: 15px; margin: 8px 0 4px; }
.cg-md h4, .cg-md h5, .cg-md h6 { font-size: 13px; margin: 8px 0 4px; }
.cg-md p { margin: 6px 0; }
.cg-md ul, .cg-md ol { margin: 6px 0; padding-left: 22px; }
.cg-md li { margin: 2px 0; }
.cg-md strong { font-weight: 700; }
.cg-md em { font-style: italic; }
.cg-md del { text-decoration: line-through; }
.cg-md code {
  background: var(--dsw-alias-bg-layer-2); border-radius: 3px; padding: 1px 4px;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 12px;
}
.cg-md pre {
  background: var(--dsw-alias-bg-layer-2); border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 6px; padding: 8px 10px; overflow: auto; margin: 8px 0;
}
.cg-md pre code { background: none; padding: 0; }
.cg-md a { color: var(--dsw-alias-brand-primary); }
.cg-md blockquote {
  border-left: 3px solid var(--dsw-alias-border-l2);
  margin: 6px 0; padding: 2px 10px;
  color: var(--dsw-alias-label-secondary);
}
.cg-md hr { border: none; border-top: 1px solid var(--dsw-alias-border-l1); margin: 10px 0; }
.cg-md table { border-collapse: collapse; margin: 8px 0; width: 100%; font-size: 12.5px; }
.cg-md th, .cg-md td { border: 1px solid var(--dsw-alias-border-l1); padding: 4px 8px; text-align: left; }
.cg-md th { background: var(--dsw-alias-bg-layer-2); font-weight: 600; }
.cg-md table code { font-size: 11.5px; }
.cg-md input[type=checkbox] { vertical-align: -2px; margin-right: 6px; }
.cg-md img { max-width: 100%; border-radius: 4px; }
.cg-md .cg-mermaid {
  margin: 10px 0; padding: 8px;
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px;
  overflow: auto;
}
.cg-md .cg-mermaid svg { max-width: 100%; height: auto; display: block; margin: 0 auto; }
.cg-mmd .cg-mermaid { margin: 0; }
/* ---------- 生成中加载看板:二次元鲸鱼娘 + 三点循环 ---------- */
.cg-guide-loading {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 14px;
  padding: 20px; min-height: 0;
}
.cg-whale-img { display: block; width: 92px; height: auto; animation: cg-whale-bob 2.6s ease-in-out infinite; }
@keyframes cg-whale-bob {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-5px) rotate(2deg); }
}
.cg-loading-dots { display: flex; gap: 7px; }
.cg-loading-dots i {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--dsw-alias-brand-primary);
  animation: cg-dot-bounce 1.2s ease-in-out infinite;
}
.cg-loading-dots i:nth-child(2) { animation-delay: .15s; }
.cg-loading-dots i:nth-child(3) { animation-delay: .3s; }
@keyframes cg-dot-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: .4; }
  30% { transform: translateY(-6px); opacity: 1; }
}
/* 解读失败报错框:文本居左,「补全解读」按钮贴最右;补全中按钮原位变三点 */
.cg-warnbox { display: flex; align-items: center; gap: 10px; }
.cg-warn-text { flex: 1 1 auto; min-width: 0; }
.cg-retry-btn { white-space: nowrap; }
.cg-retry-dots { flex: none; padding: 2px 8px; }`;

		// ---------- fetch api ----------
		// 请求显式携带 root(文件树根)做工作区包含校验(宿主 cwd 不等于工作区根)
		const api = {
			list: (path) => fetch('/plugins/dsh-files/list?path=' + encodeURIComponent(path) + '&root=' + encodeURIComponent(store.rootPath || '')).then((r) => r.json()),
			search: (root, q) => fetch('/plugins/dsh-files/search?root=' + encodeURIComponent(root) + '&q=' + encodeURIComponent(q)).then((r) => r.json()),
			read: (path, root) => fetch('/plugins/dsh-files/read?path=' + encodeURIComponent(path) + '&root=' + encodeURIComponent(root || store.rootPath || '')).then((r) => r.json()),
			explain: (path, refresh, retry, root) => fetch('/plugins/dsh-files/explain', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ path, refresh: !!refresh, retry: !!retry, root: root || store.rootPath || '' }),
			}).then((r) => r.json()),
		};

		const inject = ["slots"];

		// 展开全部/折叠全部协作状态(面板每页单实例,渲染间保持稳定);
		// token 递增可取消进行中的展开
		let expandToken = 0;
		let expandBusy = false;
		const MAX_EXPAND_DIRS = 500;

		const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
		// 按行拆分(统一 \r\n → \n):源码/预览/搜索/跳转等多处共用
		const contentLines = (content) => String(content || '').replace(/\r\n/g, '\n').split('\n');

		// ---------- mermaid (lazy engine reused from @omdsh-dev/dsh-genui) ----------
		let mermaidAssetPromise = null;
		const loadMermaidAsset = () => {
			if (window.__GenuiAssets__ && window.__GenuiAssets__.mermaid) return Promise.resolve(window.__GenuiAssets__.mermaid);
			if (mermaidAssetPromise !== null) return mermaidAssetPromise;
			mermaidAssetPromise = new Promise((resolve, reject) => {
				let rev = '';
				const graph = window.__DSH_BOOT__;
				if (graph && Array.isArray(graph.entries)) {
					const row = graph.entries.find((x) => x.id === '@omdsh-dev/dsh-genui');
					if (row && row.rev) rev = '?rev=' + row.rev;
				}
				const script = document.createElement('script');
				script.src = '/plugins/@omdsh-dev/dsh-genui/assets/mermaid.js' + rev;
				script.async = true;
				script.onload = () => {
					const api2 = window.__GenuiAssets__ && window.__GenuiAssets__.mermaid;
					if (api2) resolve(api2);
					else { mermaidAssetPromise = null; reject(new Error('mermaid 引擎未注册')); }
				};
				script.onerror = () => { mermaidAssetPromise = null; reject(new Error('mermaid 引擎加载失败')); };
				document.head.appendChild(script);
			});
			return mermaidAssetPromise;
		};
		const renderMermaidInto = (el, code, afterRender) => {
			if (!el) return;
			loadMermaidAsset().then((engine) => engine.renderMermaid(String(code))).then((svg) => {
				el.innerHTML = svg;
				const svgEl = el.querySelector('svg');
				if (svgEl) { svgEl.style.maxWidth = '100%'; svgEl.style.height = 'auto'; }
				if (typeof afterRender === 'function') afterRender(el);
			}).catch((err) => {
				el.innerHTML = '<div class="cg-mermaid-error">Mermaid 渲染失败：' + escapeHtml(String((err && err.message) || err)) + '</div>'
					+ '<pre class="cg-mermaid-src">' + escapeHtml(String(code)) + '</pre>';
			});
		};
		// 调用图组件:渲染完成后给每个节点绑定点击,点击定位到对应函数
		const CallGraphBlock = (props) => {
			const ref = react.useRef(null);
			react.useEffect(() => {
				const el = ref.current;
				if (!el) return;
				el.innerHTML = '<div class="cg-mermaid-pending">调用图渲染中…</div>';
				renderMermaidInto(el, props.code, (container) => {
					// 回传 SVG 固有尺寸:GraphView 用它驱动 Ctrl+滚轮缩放、滚动范围
					// 与初始"适应视口"。解析优先级 viewBox(最可靠) → width/height
					// 属性(纯数字) → style max-width;mermaid v10+ 的 width 是
					// "100%",不能当像素解析
					const svgEl = container.querySelector('svg');
					if (svgEl && typeof props.onSize === 'function') {
						let w = svgEl.viewBox && svgEl.viewBox.baseVal ? svgEl.viewBox.baseVal.width : 0;
						let h = svgEl.viewBox && svgEl.viewBox.baseVal ? svgEl.viewBox.baseVal.height : 0;
						if (!(w > 0)) {
							const wa = svgEl.getAttribute('width') || '';
							const num = parseFloat(wa);
							if (Number.isFinite(num) && num > 0 && wa.indexOf('%') < 0) w = num;
						}
						if (!(h > 0)) {
							const ha = svgEl.getAttribute('height') || '';
							const num = parseFloat(ha);
							if (Number.isFinite(num) && num > 0 && ha.indexOf('%') < 0) h = num;
						}
						if (!(w > 0)) {
							const m = /max-width:\s*([\d.]+)px/.exec(svgEl.getAttribute('style') || '');
							if (m) w = parseFloat(m[1]);
						}
						if (w > 0) props.onSize({ w, h: h > 0 ? h : 0 });
					}
					const nodes = container.querySelectorAll('g.node');
					for (const node of nodes) {
						const textEl = node.querySelector('text');
						const raw = textEl ? textEl.textContent : node.textContent;
						if (!raw) continue;
						node.style.cursor = 'pointer';
						node.onclick = () => {
							if (typeof props.onNodeClick === 'function') props.onNodeClick(raw);
						};
					}
				});
			}, [props.code]);
			return react.createElement('div', { className: 'cg-mermaid', ref });
		};
		// 图片预览组件:<img> 直接加载宿主 /raw 字节流。
		// svg 在 <img> 上下文中不执行脚本,无 XSS 风险。
		// root 用文件打开时记录的工作区根(切换会话后旧页签仍能正确加载)
		const ImageView = (props) => {
			const [failed, setFailed] = react.useState(false);
			if (failed) return react.createElement('div', { className: 'cg-empty' }, '图片加载失败（文件可能已变化或超过 20MB）');
			return react.createElement('div', { className: 'cg-imgbox' },
				react.createElement('img', {
					className: 'cg-imgbox-img',
					src: '/plugins/dsh-files/raw?path=' + encodeURIComponent(props.path) + '&root=' + encodeURIComponent(props.root || store.rootPath || ''),
					alt: props.name,
					draggable: false,
					onError: () => setFailed(true),
				}),
			);
		};
		// PDF 预览:浏览器内置查看器(iframe + application/pdf 字节流)
		const PdfView = (props) => {
			const [failed, setFailed] = react.useState(false);
			if (failed) return react.createElement('div', { className: 'cg-empty' }, 'PDF 加载失败（文件可能已变化或超过 20MB）');
			return react.createElement('div', { className: 'cg-pdfbox' },
				react.createElement('iframe', {
					className: 'cg-pdf-frame',
					src: '/plugins/dsh-files/raw?path=' + encodeURIComponent(props.path) + '&root=' + encodeURIComponent(props.root || store.rootPath || ''),
					title: props.name,
					onError: () => setFailed(true),
				}),
			);
		};
		// ---------- markdown 预览 ----------
		const isMarkdown = (name) => /\.(md|markdown|mdown|mkd)$/i.test(name);
		const isMermaidFile = (name) => /\.(mmd|mermaid)$/i.test(name);
		const isImageFile = (name) => /\.(png|jpe?g|webp|gif|svg)$/i.test(name);
		const isPdfFile = (name) => /\.pdf$/i.test(name);
		// 只有"有函数概念"的代码语言才提供函数解读。
		// 配置/标记语言(json/yaml/toml/ini/css/html)与纯查询语言(sql)不提供
		const EXPLAINABLE_LANGS = new Set(['js', 'ts', 'python', 'c', 'cpp', 'java', 'go', 'rust', 'shell']);
		const isExplainable = (name) => {
			const lang = hlLangFor(name);
			return EXPLAINABLE_LANGS.has(lang);
		};
		const fmtSize = (n) => {
			if (n === null || n === undefined) return '';
			if (n < 1024) return n + ' B';
			if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
			if (n < 1073741824) return (n / 1048576).toFixed(1) + ' MB';
			return (n / 1073741824).toFixed(1) + ' GB';
		};
		// 文件预览用的行内 markdown(与解读步骤的 mdInline 不同:反引号不做变量标记)
		const mdFileInline = (s) => {
			let t = escapeHtml(String(s));
			t = t.replace(/`([^`\n]+)`/g, (m, c) => '<code>' + c + '</code>');
			t = t.replace(/\*\*([^*]+)\*\*/g, (m, c) => '<strong>' + c + '</strong>');
			t = t.replace(/~~([^~]+)~~/g, (m, c) => '<del>' + c + '</del>');
			t = t.replace(/\*([^*\s][^*]*)\*/g, (m, c) => '<em>' + c + '</em>');
			t = t.replace(/!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g, (m, alt, src) => '<img src="' + src + '" alt="' + alt + '" />');
			t = t.replace(/(?<!!)\[([^\]]+)\]\(([^)\s]+)\)/g, (m, txt, href) => {
				// 协议白名单:javascript:/data: 等危险协议降级为纯文本(工作区 md 内容不可信)
				if (!/^(https?:\/\/|mailto:|#)/i.test(href)) return txt;
				return '<a href="' + href + '" target="_blank" rel="noreferrer">' + txt + '</a>';
			});
			return t;
		};
		const mdItemContent = (content) => {
			const task = /^\[([ xX])\]\s+(.*)$/.exec(content);
			if (task) return '<input type="checkbox" disabled' + (task[1] !== ' ' ? ' checked' : '') + ' /> ' + mdFileInline(task[2]);
			return mdFileInline(content);
		};
		const mdSplitRow = (line) => {
			let s = String(line).trim();
			if (s.startsWith('|')) s = s.slice(1);
			if (s.endsWith('|')) s = s.slice(0, -1);
			return s.split('|').map((c) => c.trim());
		};
		const mdIsTableSep = (line) => /^\s*\|?[\s:|-]+\|?\s*$/.test(String(line)) && String(line).includes('-');
		const mdBuildListHtml = (entries, start, minIndent) => {
			let out = '';
			let i = start;
			let currentType = null;
			let open = false;
			while (i < entries.length) {
				const e = entries[i];
				if (e.indent < minIndent) break;
				if (e.indent === minIndent) {
					if (currentType !== e.type) {
						if (open) out += '</' + currentType + '>';
						currentType = e.type;
						out += '<' + currentType + '>';
						open = true;
					}
					let itemHtml = '<li>' + mdItemContent(e.content);
					if (i + 1 < entries.length && entries[i + 1].indent > minIndent) {
						const sub = mdBuildListHtml(entries, i + 1, entries[i + 1].indent);
						itemHtml += sub.out;
						i = sub.next;
					} else {
						i++;
					}
					itemHtml += '</li>';
					out += itemHtml;
				} else {
					i++;
				}
			}
			if (open) out += '</' + currentType + '>';
			return { out, next: i };
		};
		// 最近一次 renderMarkdown 产出的 mermaid 源码,按 data-mermaid-id 占位对应
		let mdMermaidBlocks = [];
		const renderMarkdown = (text) => {
			mdMermaidBlocks = [];
			const lines = contentLines(text);
			const out = [];
			const headings = [];
			// GitHub 风格标题锚点:小写 → 去掉 markdown 格式与标点(保留字母/
			// 数字/中文/空格/连字符/下划线) → 空格转连字符;同名标题加 -1/-2
			const slugSeen = new Map();
			const slugOf = (raw) => {
				let s = String(raw)
					.replace(/`([^`]*)`/g, '$1')
					.replace(/\*\*([^*]*)\*\*/g, '$1')
					.replace(/\*([^*\s][^*]*)\*/g, '$1')
					.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
				s = s.toLowerCase().trim().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s+/g, '-');
				if (!s) return '';
				const n = (slugSeen.get(s) || 0) + 1;
				slugSeen.set(s, n);
				return n === 1 ? s : s + '-' + n;
			};
			let inCode = false;
			let codeLines = [];
			let codeLang = '';
			const flushCode = () => {
				if (inCode) {
					const code = codeLines.join('\n');
					if ((codeLang === 'mermaid' || codeLang === 'mmd') && code.trim()) {
						const id = mdMermaidBlocks.length;
						// 查找占位符不能进入 mermaid 源码,否则图渲染失败
						mdMermaidBlocks.push(code.replace(/[\u0003-\u0006]/g, ''));
						out.push('<div class="cg-mermaid" data-mermaid-id="' + id + '"><div class="cg-mermaid-pending">Mermaid 图渲染中…</div></div>');
					} else {
						const lang = hlLangForFence(codeLang);
						const body = lang ? highlight(code, lang) : escapeHtml(code);
						out.push('<pre class="cg-hl' + (lang ? ' lang-' + lang : '') + '"><code>' + body + '</code></pre>');
					}
					codeLines = [];
					inCode = false;
					codeLang = '';
				}
			};
			const tableFrom = (headerLine, sepLine, rowLines) => {
				const header = mdSplitRow(headerLine);
				const aligns = mdSplitRow(sepLine).map((c) => {
					if (/^:.*:$/.test(c)) return 'center';
					if (/^:/.test(c)) return 'left';
					if (/:$/.test(c)) return 'right';
					return '';
				});
				const cell = (content, tag, idx) => {
					const align = aligns[Math.min(idx, aligns.length - 1)];
					return '<' + tag + (align ? ' style="text-align:' + align + '"' : '') + '>' + mdFileInline(content) + '</' + tag + '>';
				};
				let html = '<table><thead><tr>';
				header.forEach((c, idx) => { html += cell(c, 'th', idx) });
				html += '</tr></thead><tbody>';
				for (const row of rowLines) {
					html += '<tr>';
					mdSplitRow(row).forEach((c, idx) => { html += cell(c, 'td', idx) });
					html += '</tr>';
				}
				return html + '</tbody></table>';
			};
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i];
				if (/^```/.test(line.trim())) {
					if (inCode) {
						flushCode();
					} else {
						inCode = true;
						codeLines = [];
						const fm = /^```\s*([\w+-]*)/.exec(line.trim());
						codeLang = fm && fm[1] ? fm[1] : '';
					}
					continue;
				}
				if (inCode) { codeLines.push(line); continue }
				if (/^\s*\|/.test(line) && i + 1 < lines.length && mdIsTableSep(lines[i + 1])) {
					const rowLines = [];
					let k = i + 2;
					while (k < lines.length && /^\s*\|/.test(lines[k]) && !mdIsTableSep(lines[k])) {
						rowLines.push(lines[k]);
						k++;
					}
					out.push(tableFrom(line, lines[i + 1], rowLines));
					i = k - 1;
					continue;
				}
				const heading = /^(#{1,6})\s+(.*)$/.exec(line);
				if (heading) {
					const id = slugOf(heading[2]);
					if (id) headings.push({ id, text: String(heading[2]).replace(/[\u0003-\u0006]/g, ''), level: heading[1].length });
					out.push('<h' + heading[1].length + (id ? ' id="' + id + '"' : '') + '>' + mdFileInline(heading[2]) + '</h' + heading[1].length + '>');
					continue
				}
				const bullet = /^(\s*)[-*+]\s+(.*)$/.exec(line);
				const ordered = /^(\s*)\d+\.\s+(.*)$/.exec(line);
				const listMatch = bullet || ordered;
				if (listMatch) {
					const entries = [];
					let j = i;
					while (j < lines.length) {
						const bl = /^(\s*)[-*+]\s+(.*)$/.exec(lines[j]);
						const ol = /^(\s*)\d+\.\s+(.*)$/.exec(lines[j]);
						const m = bl || ol;
						if (!m) break;
						entries.push({ indent: m[1].length, type: bl ? 'ul' : 'ol', content: m[2] });
						j++;
					}
					out.push(mdBuildListHtml(entries, 0, entries[0].indent).out);
					i = j - 1;
					continue;
				}
				const quote = /^\s*>\s?(.*)$/.exec(line);
				if (quote) {
					const q = [];
					let k = i;
					while (k < lines.length && /^\s*>\s?(.*)$/.exec(lines[k])) {
						q.push(/^\s*>\s?(.*)$/.exec(lines[k])[1]);
						k++;
					}
					const inner = [];
					let qi = 0;
					while (qi < q.length) {
						const ql = q[qi];
						if (/^\s*\|/.test(ql) && qi + 1 < q.length && mdIsTableSep(q[qi + 1])) {
							const rowLines = [];
							let k2 = qi + 2;
							while (k2 < q.length && /^\s*\|/.test(q[k2]) && !mdIsTableSep(q[k2])) {
								rowLines.push(q[k2]);
								k2++;
							}
							inner.push(tableFrom(ql, q[qi + 1], rowLines));
							qi = k2;
							continue;
						}
						if (ql.trim() === '') { qi++; continue }
						inner.push('<p>' + mdFileInline(ql) + '</p>');
						qi++;
					}
					out.push('<blockquote>' + inner.join('') + '</blockquote>');
					i = k - 1;
					continue;
				}
				if (/^\s*-+\s*$/.test(line)) { out.push('<hr/>'); continue }
				if (line.trim() === '') continue;
				out.push('<p>' + mdFileInline(line) + '</p>');
			}
			flushCode();
			return { html: out.join(''), headings };
		};
		// 渲染注入后的 markdown 里的 mermaid 占位(异步引擎)
		const renderMermaidBlocks = (container) => {
			if (!container) return;
			const els = container.querySelectorAll('.cg-mermaid[data-mermaid-id]');
			for (const el of els) {
				const id = Number(el.getAttribute('data-mermaid-id'));
				const code = mdMermaidBlocks[id];
				if (typeof code === 'string') renderMermaidInto(el, code);
			}
		};
		// 整文件 mermaid(.mmd/.mermaid)预览组件
		const MermaidBlock = (props) => {
			const ref = react.useRef(null);
			react.useEffect(() => {
				const el = ref.current;
				if (!el) return;
				el.innerHTML = '<div class="cg-mermaid-pending">Mermaid 图渲染中…</div>';
				renderMermaidInto(el, props.code);
			}, [props.code]);
			return react.createElement('div', { className: 'cg-mermaid', ref });
		};

		// ---------- 生成中加载看板:二次元鲸鱼娘(内嵌透明 PNG) ----------
		// 素材:DeepSeek 鲸鱼娘二创,github.com/1190fasheqi/dafeiyu-pet(sprites/正面_187.png)
		const whaleImg = 'data:image/png;base64,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';
		// 加载动画延迟 300ms 才出现:缓存命中/快响应不会闪 1 帧鲸鱼娘,
		// 只有真正需要等待的 LLM 生成才显示
		const GuideLoading = () => {
			const [show, setShow] = react.useState(false);
			react.useEffect(() => {
				const t = setTimeout(() => setShow(true), 300);
				return () => clearTimeout(t);
			}, []);
			if (!show) return react.createElement('div', { className: 'cg-guide-loading' });
			return react.createElement('div', { className: 'cg-guide-loading' },
				react.createElement('img', { className: 'cg-whale-img', width: 92, height: 123, src: whaleImg, alt: '' }),
				react.createElement('div', { className: 'cg-loading-dots' },
					react.createElement('i'), react.createElement('i'), react.createElement('i')),
			);
		};
		// 把模型的流程描述规范成行(编号/分号/换行/首先其次…),供 md 列表渲染
		const normalizeFlow = (flow) => {
			let s = String(flow || '').trim();
			if (!s) return [];
			s = s.replace(/([;；])/g, '\n');
			if (!/[\r\n]/.test(s)) {
				// 单行成段的编号:"1 xxx"、"2. xxx" 拆行并保留编号
				s = s.replace(/(?:^|\s)(\d{1,2})\s+(?=[^\d\s])/g, '\n$1. ');
			}
			s = s
				.replace(/(^|\n)\s*(?:步骤\s*)?(\d{1,2})\s*[\.、:：)）]\s*/g, '\n$1. ')
				.replace(/(^|\n)\s*(?:步骤\s*)?[一二三四五六七八九十]{1,3}\s*[\.、:：)）]\s*/g, '\n')
				.replace(/(^|\n)\s*[①②③④⑤⑥⑦⑧⑨⑩⑪⑫]\s*/g, '\n')
				.replace(/(^|\n)\s*(?:首先|其次|然后|接着|最后|再|之后)\s*[,，:：]?\s*/g, '\n');
			return s.split('\n').map((x) => x.replace(/^[-*•]\s*/, '').trim()).filter(Boolean);
		};
		const mdInline = (s) => {
			let t = escapeHtml(String(s));
			t = t.replace(/`([^`\n]+)`/g, (m, c) => '<code class="cg-var" data-var="' + escapeHtml(c) + '">' + c + '</code>');
			t = t.replace(/\*\*([^*]+)\*\*/g, (m, c) => '<strong>' + c + '</strong>');
			t = t.replace(/\*([^*\s][^*]*)\*/g, (m, c) => '<em>' + c + '</em>');
			return t;
		};
		// 递归提取流程步骤文本:模型可能返回嵌套结构(数组套对象等),
		// 一层层剥到字符串为止,任何 [object Object] 脏值一律丢弃
		const extractFlowText = (v) => {
			if (typeof v === 'string') {
				const t = v.trim();
				return t.includes('[object Object]') ? '' : t;
			}
			if (Array.isArray(v)) return v.map((x) => extractFlowText(x)).filter(Boolean).join('；');
			if (v && typeof v === 'object') {
				return extractFlowText(v.text || v.step || v.desc || v.description || v.content);
			}
			return '';
		};
	// 区间分割:给定函数体范围和步骤列表,返回 lineNo 所属的步骤下标。
	// 锚定策略(按优先级):
	//   1. 内容锚定——步骤文本中的反引号变量在代码中的实际出现位置(最可靠)
	//   2. LLM 行号——步骤的 start/end 中点(长函数常有偏差)
	//   3. 插值/等分——前后有效锚点线性插值,全无则等分函数体
	// 锚点确定后把函数体完整切分成连续无缝分区,每一行恰属于一个步骤
	const stepPartitionIndex = (lineNo, bodyStart, bodyEnd, steps, lines) => {
		const n = steps.length;
		if (n === 0 || bodyStart > bodyEnd) return -1;
		const a = new Array(n);
		let hasValid = false;
		let searchFrom = bodyStart;
		for (let i = 0; i < n; i++) {
			const s = steps[i];
			let anchor = NaN;
			// 内容锚定:从步骤文本提取反引号标识符,在函数体中顺序搜索。
			// 顺序约束(searchFrom 递增)保证步骤 i 的锚点在步骤 i-1 之后
			if (lines) {
				const varRe = /`([^`\n]+)`/g;
				let m;
				while ((m = varRe.exec(s.text)) !== null) {
					const v = m[1].trim();
					if (!v || v.length > 60 || !/^[A-Za-z_$]/.test(v)) continue;
					const esc = v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
					const re = new RegExp('(?<![A-Za-z0-9_$])' + esc + '(?![A-Za-z0-9_$])');
					for (let k = Math.max(0, searchFrom - 1); k < Math.min(bodyEnd, lines.length); k++) {
						if (re.test(lines[k])) { anchor = k + 1; break }
					}
					if (anchor === anchor) break; // found, not NaN
				}
			}
			// 回退:LLM 行号(不得早于 searchFrom,防止逆序)
			if (anchor !== anchor && s.start > 0 && s.end >= s.start) {
				anchor = Math.max(searchFrom, (s.start + s.end) / 2);
			}
			if (anchor === anchor) { // not NaN
				a[i] = anchor;
				searchFrom = Math.floor(anchor) + 1;
				hasValid = true;
			} else {
				a[i] = NaN;
			}
		}
		if (!hasValid) {
			return Math.min(n - 1, Math.max(0, Math.floor((lineNo - bodyStart) / Math.max(1, bodyEnd - bodyStart + 1) * n)));
		}
		// 插值缺失锚点:用前后有效锚点线性插值;边界外推
		for (let i = 0; i < n; i++) {
			if (a[i] === a[i]) continue;
			let pI = -1, nI = -1;
			for (let j = i - 1; j >= 0; j--) { if (a[j] === a[j]) { pI = j; break } }
			for (let j = i + 1; j < n; j++) { if (a[j] === a[j]) { nI = j; break } }
			if (pI >= 0 && nI >= 0) a[i] = a[pI] + (a[nI] - a[pI]) * (i - pI) / (nI - pI);
			else if (pI >= 0) a[i] = a[pI] + (bodyEnd - a[pI]) / (n - pI) * (i - pI);
			else a[i] = bodyStart + (a[nI] - bodyStart) / (nI + 1) * (i + 0.5);
		}
		// 分区查找:相邻锚点中点为分界,lineNo 落在哪段就返回该下标
		for (let i = 0; i < n - 1; i++) {
			if (lineNo <= (a[i] + a[i + 1]) / 2) return i;
		}
		return n - 1;
	};
	// 统一解析流程步骤:优先 flowSteps,回退递归解析 flow 数组,再回退字符串
	const stepsOf = (f) => {
			if (Array.isArray(f.flowSteps) && f.flowSteps.length > 0) {
				const out = f.flowSteps.map((s) => ({
					start: Number((s && s.start) || 0) || 0,
					end: Number((s && s.end) || 0) || 0,
					text: extractFlowText(s && s.text),
				})).filter((s) => s.text);
				if (out.length > 0) return out;
			}
			if (Array.isArray(f.flow)) {
				const out = f.flow.map((s) => {
					if (typeof s === 'string') return { start: 0, end: 0, text: extractFlowText(s) };
					if (s && typeof s === 'object') {
						const text = extractFlowText(s.text || s.step || s.desc || s.description || s.content);
						if (!text) return null;
						return {
							start: Math.round(Number(s.start) || 0) || 0,
							end: Math.round(Number(s.end) || 0) || 0,
							text,
						};
					}
					return null;
				}).filter(Boolean);
				if (out.length > 0) return out;
			}
			return null;
		};
		// Markdown 风格渲染:有序列表(自动编号),延续行并入列表,其余为段落
		const renderFlowMd = (flow) => {
			const src = Array.isArray(flow)
				? flow.map((s) => extractFlowText(s)).filter(Boolean).join('\n')
				: flow;
			const lines = normalizeFlow(src).filter((x) => !x.includes('[object Object]'));
			if (lines.length === 0) return '';
			let out = '';
			let listOpen = null;
			for (const line of lines) {
				const om = /^(\d{1,2})[\.、:：)）]\s+(.*)$/.exec(line);
				if (om) {
					if (listOpen !== 'ol') { if (listOpen) out += '</' + listOpen + '>'; out += '<ol>'; listOpen = 'ol' }
					out += '<li>' + mdInline(om[2]) + '</li>';
				} else if (listOpen !== null) {
					out += '<li>' + mdInline(line) + '</li>';
				} else {
					out += '<p>' + mdInline(line) + '</p>';
				}
			}
			if (listOpen !== null) out += '</' + listOpen + '>';
			return out;
		};

		// 调用图视图状态缓存:按文件路径记住 缩放/滚动 位置,切页签回来不复位。
		// 设上限防止长会话内存膨胀:超出淘汰最久未用的视图状态
		const graphViewCache = new Map(); // filePath -> { scale, fit, scrollLeft, scrollTop, baseW, baseH }
		const GRAPH_VIEW_CACHE_MAX = 20;
		// 调用图视图:工具栏(放大/缩小/复位/复制)+ 滚轮滚动窗口 +
		// Ctrl/⌘+滚轮以鼠标为中心缩放 + 左键按住拖动平移(移动超过 4px 才算,
		// 否则按点击派发给 SVG 节点跳转)。
		// 缩放由 wrapper 宽度驱动 SVG 矢量缩放,滚动条始终与内容一致;
		// 首次打开 fit 看全图,切走/切回保持上次的缩放与滚动位置
		const GraphView = (props) => {
			const cachedRef = react.useRef(graphViewCache.get(props.filePath) || null);
			const c = cachedRef.current;
			const [scale, setScale] = react.useState(c && c.scale ? c.scale : 1);
			const scaleRef = react.useRef(c && c.scale ? c.scale : 1);
			const setScaleBoth = (v) => { scaleRef.current = v; setScale(v) };
			// 用缓存的图尺寸初始化:挂载时 wrapper 宽立即正确,滚动位置可直接恢复
			const [base, setBase] = react.useState(c && c.baseW > 0 ? { w: c.baseW, h: c.baseH } : null);
			const baseRef = react.useRef(c && c.baseW > 0 ? { w: c.baseW, h: c.baseH } : null);
			const [copied, setCopied] = react.useState(false);
			const dragRef = react.useRef(null);
			const suppressClickRef = react.useRef(false);
			const vpRef = react.useRef(null);
			const fitScaleRef = react.useRef(c && c.fit ? c.fit : 1);
			// 适应视口:图比视口大时缩小到刚好看到全图(留边距),小图保持 100%
			const fitScale = (size, vp) => {
				if (!vp || !(size.w > 0) || !(size.h > 0)) return 1;
				return Math.max(0.4, Math.min(1, (vp.clientWidth - 24) / size.w, (vp.clientHeight - 24) / size.h));
			};
			const onSize = (size) => {
				// 更新图固有尺寸(文件可能变过);切回有缓存时不重新 fit、不动滚动
				setBase(size);
				baseRef.current = size;
				const vp = vpRef.current;
				if (!vp || !(size.w > 0)) return;
				const cached = cachedRef.current;
				if (cached && cached.scale) {
					// 渲染完成、内容高度就绪:补恢复垂直滚动(水平滚动挂载时已恢复)
					if (cached.scrollTop) {
						requestAnimationFrame(() => { vp.scrollTop = cached.scrollTop });
					}
				} else {
					const f = Math.round(fitScale(size, vp) * 100) / 100;
					fitScaleRef.current = f;
					setScaleBoth(f);
				}
			};
			// 挂载后立即恢复上次滚动位置:此时 wrapper 宽 = 缓存图宽×缩放;
			// scrollTop 因 SVG 异步渲染、内容高度尚未就绪可能被浏览器钳回 0,
			// 渲染完成后在 onSize 里再补一次
			react.useLayoutEffect(() => {
				const vp = vpRef.current;
				if (vp && c && (c.scrollLeft || c.scrollTop)) {
					vp.scrollLeft = c.scrollLeft || 0;
					vp.scrollTop = c.scrollTop || 0;
					// 内容高度可能尚未就绪(SVG 异步渲染,失败态无 onSize 回调):
					// 下一帧再补一次,恢复链路不依赖 onSize 单点
					requestAnimationFrame(() => {
						if (vp) { vp.scrollLeft = c.scrollLeft || 0; vp.scrollTop = c.scrollTop || 0 }
					});
				}
			}, []);
			// 卸载前保存缩放/滚动。必须用 useLayoutEffect 的 cleanup:
			// 它在 DOM 删除前执行、vpRef 还有效;useEffect 的 cleanup 在 DOM
			// 删除后执行,ref 已置 null,滚动位置会存成 0
			react.useLayoutEffect(() => () => {
				const vp = vpRef.current;
				if (!graphViewCache.has(props.filePath) && graphViewCache.size >= GRAPH_VIEW_CACHE_MAX) {
					graphViewCache.delete(graphViewCache.keys().next().value);
				}
				graphViewCache.set(props.filePath, {
					scale: scaleRef.current,
					fit: fitScaleRef.current,
					scrollLeft: vp ? vp.scrollLeft : 0,
					scrollTop: vp ? vp.scrollTop : 0,
					baseW: baseRef.current ? baseRef.current.w : 0,
					baseH: baseRef.current ? baseRef.current.h : 0,
				});
			}, [props.filePath]);
			// 以给定视口坐标(mx,my)为中心缩放:该点内容在缩放前后保持在原位
			const zoomAt = (d, mx, my) => {
				const vp = vpRef.current;
				const old = scaleRef.current;
				const next = Math.max(0.4, Math.min(4, +(old + d).toFixed(2)));
				if (next === old) return;
				const ratio = next / old;
				// 锚点必须取"缩放发起时刻"的滚动位置:React 应用新宽度后,
				// 浏览器可能先钳制 scrollLeft(缩小或靠边时),rAF 里再读会
				// 拿到被钳制后的值,导致缩放中心偏离鼠标点
				const cx = vp ? vp.scrollLeft + mx : mx;
				const cy = vp ? vp.scrollTop + my : my;
				setScaleBoth(next);
				if (!vp) return;
				requestAnimationFrame(() => {
					vp.scrollLeft = cx * ratio - mx;
					vp.scrollTop = cy * ratio - my;
				});
			};
			// 工具栏按钮:以视口中心缩放
			const zoomCenter = (d) => {
				const vp = vpRef.current;
				zoomAt(d, vp ? vp.clientWidth / 2 : 0, vp ? vp.clientHeight / 2 : 0);
			};
			const reset = () => {
				setScaleBoth(fitScaleRef.current);
				const vp = vpRef.current;
				if (vp) { vp.scrollLeft = 0; vp.scrollTop = 0 }
			};
			react.useEffect(() => {
				const el = vpRef.current;
				if (!el) return;
				const onWheel = (e) => {
					// 普通滚轮 = 窗口滚动(不拦截,浏览器默认);Ctrl/⌘+滚轮 = 缩放
					if (!e.ctrlKey && !e.metaKey) return;
					e.preventDefault();
					const rect = el.getBoundingClientRect();
					zoomAt(e.deltaY < 0 ? 0.15 : -0.15, e.clientX - rect.left, e.clientY - rect.top);
				};
				el.addEventListener('wheel', onWheel, { passive: false });
				return () => el.removeEventListener('wheel', onWheel);
			}, []);
			// 左键直接拖动:按下先记录,移动超过 4px 才算平移(否则视为点击,
			// 正常派发给 SVG 节点跳转);拖动后的 click 在捕获阶段吞掉
			const DRAG_THRESHOLD = 4;
			const onPointerDown = (e) => {
				if (e.pointerType === 'mouse' && e.button !== 0) return;
				const vp = vpRef.current;
				if (!vp) return;
				suppressClickRef.current = false;
				dragRef.current = { pointerId: e.pointerId, x: e.clientX, y: e.clientY, sl: vp.scrollLeft, st: vp.scrollTop, moved: false };
			};
			const onPointerMove = (e) => {
				const d = dragRef.current;
				const vp = vpRef.current;
				if (!d || !vp || e.pointerId !== d.pointerId) return;
				if (!d.moved) {
					if (Math.abs(e.clientX - d.x) < DRAG_THRESHOLD && Math.abs(e.clientY - d.y) < DRAG_THRESHOLD) return;
					d.moved = true;
					suppressClickRef.current = true;
					if (vp.setPointerCapture) {
						try { vp.setPointerCapture(e.pointerId) } catch { /* ignore */ }
					}
				}
				vp.scrollLeft = d.sl - (e.clientX - d.x);
				vp.scrollTop = d.st - (e.clientY - d.y);
			};
			const onPointerUp = (e) => {
				const d = dragRef.current;
				if (!d || e.pointerId !== d.pointerId) return;
				dragRef.current = null;
				if (d.moved && vpRef.current && vpRef.current.hasPointerCapture && vpRef.current.hasPointerCapture(e.pointerId)) {
					try { vpRef.current.releasePointerCapture(e.pointerId) } catch { /* ignore */ }
				}
			};
			const onClickCapture = (e) => {
				if (!suppressClickRef.current) return;
				suppressClickRef.current = false;
				e.stopPropagation();
				e.preventDefault();
			};
			const onCopy = () => {
				if (navigator.clipboard && navigator.clipboard.writeText) {
					navigator.clipboard.writeText(String(props.code)).then(() => {
						setCopied(true);
						setTimeout(() => setCopied(false), 1500);
					}).catch(() => {});
				}
			};
			const contentW = base && base.w > 0 ? Math.round(base.w * scale) : 0;
			return react.createElement('div', { className: 'cg-graph' },
				react.createElement('div', { className: 'cg-graph-toolbar' },
					react.createElement('button', { className: 'cg-gbtn', title: '放大 (Ctrl+滚轮)', onClick: () => zoomCenter(0.2) }, '＋'),
					react.createElement('button', { className: 'cg-gbtn', title: '缩小 (Ctrl+滚轮)', onClick: () => zoomCenter(-0.2) }, '－'),
					react.createElement('button', { className: 'cg-gbtn', title: '复位', onClick: reset }, react.createElement(Icon, { name: 'reset', size: 14 })),
					react.createElement('button', { className: 'cg-gbtn', title: copied ? '已复制' : '复制 mermaid', onClick: onCopy }, react.createElement(Icon, { name: copied ? 'check' : 'copy', size: 14 })),
				),
				react.createElement('div', {
					className: 'cg-graph-viewport',
					ref: vpRef,
					onPointerDown: onPointerDown,
					onPointerMove: onPointerMove,
					onPointerUp: onPointerUp,
					onPointerLeave: onPointerUp,
					onClickCapture: onClickCapture,
				},
					react.createElement('div', { style: contentW > 0 ? { width: contentW + 'px', margin: '0 auto' } : { width: '100%' } },
						react.createElement(CallGraphBlock, { code: props.code, onNodeClick: props.onNodeClick, onSize: onSize }),
					),
				),
			);
		};

		// ---------- shared store ----------
		// 分栏尺寸存 localStorage:刷新后保持上次布局。
		// tree = 文件树宽;code = 源码区总宽(解读打开时 = 源码 + 分栏线 + 解读,
		// 关闭解读时源码向右扩展收回);guide = 解读宽。
		// 面板宽 = 可见区域之和:只开树=tree;打开文件=tree+分栏线+code。
		// 解读在源码区内展开/收起,面板宽度不变。
		const store = {
			open: false,
			pane: { tree: 240, code: 485, guide: 240 },
			query: '',
			searching: false,
			searchError: null,
			matches: null,
			truncated: false,
			listeners: new Set(),
		};
		try {
			const p = JSON.parse(localStorage.getItem('cg-pane') || 'null');
			if (p && typeof p === 'object'
				&& Number.isFinite(p.tree) && Number.isFinite(p.code) && Number.isFinite(p.guide)
				&& p.tree >= 240 && p.tree <= 1600
				&& p.guide >= 240 && p.guide <= 1200
				&& p.code >= p.guide + 5 + 240 && p.code <= 2200) {
				store.pane = { tree: p.tree, code: p.code, guide: p.guide };
			}
		} catch (_) { /* localStorage 不可用时忽略 */ }
		const emit = () => { for (const fn of Array.from(store.listeners)) fn() };
		const subscribe = (fn) => { store.listeners.add(fn); return () => { store.listeners.delete(fn) } };
		const setOpen = (value) => { store.open = !!value; emit() };
		const toggleOpen = () => setOpen(!store.open);
		const useStore = (selector) => {
			const sel = selector || null;
			const snapRef = react.useRef(sel ? sel(store) : store);
			const [, setTick] = react.useState(0);
			react.useEffect(() => subscribe(() => {
				if (!sel) { setTick((x) => x + 1); return }
				const next = sel(store);
				if (next !== snapRef.current) { snapRef.current = next; setTick((x) => x + 1) }
			}), []);
			if (sel) { snapRef.current = sel(store); return snapRef.current }
			return store;
		};
		// 每个工作区各自的页签集合。必须放模块级:切换会话时面板组件可能
		// 整个重挂载,组件内的 Map 会随实例一起销毁,页签快照就丢了。
		// rootPath -> { tabs, preview, previewActive, activePath }
		const workspaceTabSets = new Map();

		// ---------- 阶段1:文件内搜索 / 虚拟滚动辅助 ----------
		const LINE_H = 21; // .cg-line 行高(CSS 固定 line-height: 21px)
		const VIRT_OVERSCAN = 15; // 虚拟滚动上下缓冲行数(盖住平滑滚动的一帧窗口延迟)
		// 文件内搜索:返回 [{ line(1-based), start(列, 0-based), len, occ(行内第几个) }]
		const computeFindMatches = (content, query, caseSensitive, maxLines) => {
			const q = String(query || '');
			if (!q) return [];
			const needle = caseSensitive ? q : q.toLowerCase();
			const lines = contentLines(content).slice(0, maxLines);
			const out = [];
			const perLine = new Map();
			for (let i = 0; i < lines.length; i++) {
				const text = caseSensitive ? lines[i] : lines[i].toLowerCase();
				let from = 0;
				while (true) {
					const idx = text.indexOf(needle, from);
					if (idx < 0) break;
					const occ = perLine.get(i + 1) || 0;
					perLine.set(i + 1, occ + 1);
					out.push({ line: i + 1, start: idx, len: q.length, occ });
					from = idx + Math.max(1, needle.length);
					if (out.length >= 5000) return out; // 极端情况上限
				}
			}
			return out;
		};
		// 把查找命中按行注入占位符(普通 \u0003/\u0004,当前 \u0005/\u0006),
		// 源码高亮与 md 渲染两条管线共用;最终 HTML 再统一替换成 <mark>
		const markFindLines = (lines, findMatches, currentIdx) => {
			if (!findMatches || findMatches.length === 0) return lines;
			const findByLine = new Map();
			for (let i = 0; i < findMatches.length; i++) {
				const m = findMatches[i];
				const arr = findByLine.get(m.line) || [];
				arr.push({ start: m.start, len: m.len, cur: i === currentIdx });
				findByLine.set(m.line, arr);
			}
			return lines.map((line, idx) => {
				const arr = findByLine.get(idx + 1);
				if (!arr || arr.length === 0) return line;
				let s = line;
				for (let k = arr.length - 1; k >= 0; k--) {
					const it = arr[k];
					const open = it.cur ? '\u0005' : '\u0003';
					const close = it.cur ? '\u0006' : '\u0004';
					s = s.slice(0, it.start) + open + s.slice(it.start, it.start + it.len) + close + s.slice(it.start + it.len);
				}
				return s;
			});
		};
		// 文件内搜索条(VSCode 风格):输入 160ms 防抖提交;Enter 下一个、
		// Shift+Enter 上一个、Esc 关闭
		const FindBar = (props) => {
			const [draft, setDraft] = react.useState(props.query || '');
			const draftRef = react.useRef(draft);
			draftRef.current = draft;
			const mountedRef = react.useRef(false);
			react.useEffect(() => {
				if (!mountedRef.current) { mountedRef.current = true; return }
				const t = setTimeout(() => { if (props.onQuery) props.onQuery(draftRef.current) }, 160);
				return () => clearTimeout(t);
			}, [draft]);
			const total = props.total || 0;
			const cur = total > 0 ? Math.min(Math.max((props.current || 0) + 1, 1), total) : 0;
			return react.createElement('div', { className: 'cg-findbar' },
				react.createElement('input', {
					className: 'cg-find-input',
					type: 'text',
					placeholder: '在文件中查找',
					value: draft,
					spellCheck: false,
					autoFocus: true,
					onChange: (e) => setDraft(e.target.value),
					onKeyDown: (e) => {
						if (e.key === 'Enter') { e.preventDefault(); props.onNav(e.shiftKey ? -1 : 1) }
						else if (e.key === 'Escape') { e.preventDefault(); props.onClose() }
					},
				}),
				react.createElement('span', { className: 'cg-find-count' }, total > 0 ? cur + ' / ' + total : (props.query ? '无匹配' : '')),
				react.createElement('button', { className: 'cg-iconbtn cg-find-nav', title: '上一个 (Shift+Enter)', onClick: () => props.onNav(-1) }, react.createElement(Icon, { name: 'chevronUp', size: 13 })),
				react.createElement('button', { className: 'cg-iconbtn cg-find-nav', title: '下一个 (Enter)', onClick: () => props.onNav(1) }, react.createElement(Icon, { name: 'chevronDown', size: 13 })),
				react.createElement('button', {
					className: 'cg-iconbtn cg-find-nav' + (props.caseSensitive ? ' cg-iconbtn-on' : ''),
					title: '区分大小写',
					onClick: props.onToggleCase,
				}, 'Aa'),
				react.createElement('button', { className: 'cg-iconbtn cg-find-nav', title: '关闭 (Esc)', onClick: props.onClose }, react.createElement(Icon, { name: 'close', size: 13 })),
			);
		};
		// md 目录浮层(点击章节平滑滚动 + 滚动跟随高亮)
		const TocOverlay = (props) => {
			const items = props.items || [];
			const head = react.createElement('div', { className: 'cg-outline-head' }, props.title + (items.length > 0 ? '（' + items.length + '）' : ''));
			if (items.length === 0) {
				return react.createElement('div', { className: 'cg-outline' }, head,
					react.createElement('div', { className: 'cg-empty', style: { padding: '10px 8px' } }, props.emptyText || '没有内容'));
			}
			return react.createElement('div', { className: 'cg-outline' }, head,
				items.map((it) => react.createElement('div', {
					key: it.key !== undefined ? it.key : (it.id || (it.line + ':' + it.name)),
					className: 'cg-outline-row' + (props.activeId !== undefined && props.activeId !== null && props.activeId === it.id ? ' cg-outline-on' : ''),
					onClick: () => { if (props.onPick) props.onPick(it) },
				},
					react.createElement('span', { className: 'cg-outline-kind' }, it.kind || ''),
					react.createElement('span', { className: 'cg-outline-name', title: it.name }, it.name),
					it.line > 0 ? react.createElement('span', { className: 'cg-outline-line' }, 'L' + it.line) : null,
				)),
			);
		};

		// ---------- 文件搜索(共享 store,面板单实例) ----------
		let searchTimer = null;
		const doSearch = (q) => {
			store.searching = true;
			store.searchError = null;
			emit();
			api.search(store.rootPath, q).then((res) => {
				if (store.query !== q) return;
				store.searching = false;
				if (res && res.error) store.searchError = res.error;
				else { store.matches = (res && res.matches) || []; store.truncated = !!(res && res.truncated); }
				emit();
			}).catch((err) => {
				if (store.query !== q) return;
				store.searching = false;
				store.searchError = String((err && err.message) || err);
				emit();
			});
		};
		const runSearch = (raw) => {
			const q = String(raw || '').trim();
			if (store.query !== q) return;
			if (!q) { store.matches = null; store.searching = false; store.searchError = null; emit(); return }
			if (searchTimer !== null) clearTimeout(searchTimer);
			searchTimer = setTimeout(() => { searchTimer = null; doSearch(q) }, 300);
		};
		const setQuery = (value) => { store.query = String(value || ''); emit(); runSearch(store.query) };

		// ---------- 面板/分栏尺寸 ----------
		const PANE_DIV_W = 5;
		const PANE_MIN_PX = 240; // 三个视窗的最小宽统一 240
		// 面板总宽:只开树 = 树宽;打开文件 = 树 + 分栏线 + 源码区(code)。
		// 解读开/关只影响源码区内部怎么分,面板宽度不变
		const panelWidthOf = (pane, showCode) => showCode
			? pane.tree + PANE_DIV_W + pane.code
			: pane.tree;
		// 源码区有效宽的下限:打开文件时面板最少占视窗 1/3;解读打开时还要
		// 保证两窗各 240(共 485)。注意不能用"当前 guide 宽"动态计算下限——
		// 否则解读拉大后,最左侧把手会被当前 guide 卡死、无法收缩面板
		const codeFloorFor = (pane, showGuide) => {
			const min = showGuide ? PANE_MIN_PX * 2 + PANE_DIV_W : PANE_MIN_PX;
			const thirdMin = Math.max(0, Math.round(window.innerWidth / 3) - pane.tree - PANE_DIV_W);
			return Math.max(min, thirdMin);
		};
		// 上限:面板不超出屏幕(留 90px 余量)
		const codeCeilFor = (pane) => Math.max(0, window.innerWidth - 90 - pane.tree - PANE_DIV_W);
		// 源码区有效宽:钳制到 [下限, 上限]
		const effCodeOf = (pane, showGuide) => Math.min(Math.max(pane.code, codeFloorFor(pane, showGuide)), codeCeilFor(pane));
		// 源码可见宽:解读打开时从源码区划出 解读+分栏线,关闭时源码收回
		const sourceWidthOf = (pane, showGuide) => showGuide
			? Math.max(PANE_MIN_PX, effCodeOf(pane, showGuide) - pane.guide - PANE_DIV_W)
			: effCodeOf(pane, false);

		// ---------- syntax highlighting (self-contained, no runtime deps) ----------
		// Extension -> language id for source rendering.
		const HL_EXT = {
			js: 'js', mjs: 'js', cjs: 'js', jsx: 'js',
			ts: 'ts', mts: 'ts', cts: 'ts', tsx: 'ts',
			json: 'json', jsonc: 'json', map: 'json',
			yaml: 'yaml', yml: 'yaml',
			py: 'python', pyw: 'python',
			c: 'c', h: 'c',
			cpp: 'cpp', cc: 'cpp', cxx: 'cpp', hpp: 'cpp', hh: 'cpp', hxx: 'cpp',
			java: 'java',
			go: 'go',
			rs: 'rust',
			sh: 'shell', bash: 'shell', zsh: 'shell',
			sql: 'sql',
			toml: 'toml',
			ini: 'ini', cfg: 'ini', conf: 'ini',
			css: 'css', scss: 'css', less: 'css',
			html: 'html', htm: 'html',
			md: 'markdown', markdown: 'markdown', txt: 'text',
		};
		const hlLangFor = (name) => {
			const n = String(name || '').toLowerCase();
			const i = n.lastIndexOf('.');
			const ext = i >= 0 ? n.slice(i + 1) : n;
			return HL_EXT[ext] || '';
		};
		// Markdown 代码围栏 ```lang 的语言别名
		const HL_ALIAS = {
			javascript: 'js', jsx: 'js', typescript: 'ts', tsx: 'ts',
			py: 'python', 'c++': 'cpp', sh: 'shell', bash: 'shell',
			yml: 'yaml', jsonc: 'json',
		};
		const hlLangForFence = (l) => {
			const s = String(l || '').toLowerCase().trim();
			return HL_ALIAS[s] || HL_EXT[s] || (HL[s] ? s : '');
		};
		// Language configs. Flags: ln=line comment, bl=block comment, bt=backtick,
		// hs=hash comment, hsAny=hash anywhere, pr=preprocessor #, tr=triple quote,
		// de=@decorator, dl=$var, ks=quoted-key (json/yaml), ki=bare key: (yaml),
		// ke=key= (toml/ini), ct=capitalized=type, tg=html tags.
		const HL = {
			js: { ln: '//', bl: true, bt: true, kw: 'break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof let new of return static super switch this throw try typeof var void while with yield async await', bn: 'console Math JSON Promise Symbol BigInt Array Object String Number Boolean Function Date RegExp Error TypeError RangeError ReferenceError SyntaxError Map Set WeakMap WeakSet Proxy Reflect Intl URL URLSearchParams AbortController AbortSignal fetch setTimeout setInterval clearTimeout clearInterval queueMicrotask structuredClone atob btoa TextEncoder TextDecoder undefined null NaN Infinity globalThis window document process require module exports Buffer' },
			ts: { ln: '//', bl: true, bt: true, ct: true, kw: 'break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof let new of return static super switch this throw try typeof var void while with yield async await abstract as asserts declare enum implements infer interface is keyof namespace readonly satisfies type unknown using', bn: 'console Math JSON Promise Symbol BigInt Array Object String Number Boolean Function Date RegExp Error TypeError RangeError ReferenceError SyntaxError Map Set WeakMap WeakSet Proxy Reflect URL fetch setTimeout setInterval clearTimeout clearInterval undefined null NaN Infinity globalThis window document process require module exports Buffer any unknown never void', ty: 'string number boolean object symbol bigint' },
			json: { ks: true, kw: 'true false null', bn: '' },
			yaml: { hs: true, ks: true, ki: true, kw: 'true false null yes no on off', bn: '' },
			python: { hs: true, hsAny: true, tr: true, de: true, ct: true, kw: 'and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case', bn: 'None True False print len range str int float bool list dict set tuple bytes bytearray type object isinstance issubclass super property classmethod staticmethod enumerate zip map filter sorted sum min max abs round pow divmod open input eval exec repr format hash id vars dir getattr setattr hasattr delattr all any next iter reversed slice complex frozenset memoryview Exception ValueError TypeError KeyError IndexError AttributeError RuntimeError StopIteration NotImplementedError ImportError ModuleNotFoundError FileNotFoundError IOError OSError SystemExit KeyboardInterrupt' },
			c: { ln: '//', bl: true, pr: true, ct: true, kw: 'auto break case char const continue default do double else enum extern float for goto if inline int long register restrict return short signed sizeof static struct switch typedef union unsigned void volatile while', bn: 'NULL true false size_t ssize_t int8_t int16_t int32_t int64_t uint8_t uint16_t uint32_t uint64_t ptrdiff_t wchar_t FILE stdin stdout stderr printf fprintf sprintf snprintf scanf fscanf sscanf malloc calloc realloc free memcpy memset memmove strlen strcmp strcpy strcat fopen fclose fread fwrite puts getchar putchar exit abort assert' },
			cpp: { ln: '//', bl: true, pr: true, ct: true, kw: 'alignas alignof and and_eq asm auto bitand bitor bool break case catch char class compl concept const consteval constexpr constinit const_cast continue co_await co_return co_yield decltype default delete do double dynamic_cast else enum explicit export extern false float for friend goto if inline int long mutable namespace new noexcept not not_eq nullptr operator or or_eq private protected public register reinterpret_cast requires return short signed sizeof static static_assert static_cast struct switch template this thread_local throw true try typedef typeid typename union unsigned using virtual void volatile wchar_t while xor xor_eq', bn: 'NULL nullptr true false size_t ssize_t int8_t int16_t int32_t int64_t uint8_t uint16_t uint32_t uint64_t ptrdiff_t wchar_t FILE stdin stdout stderr cout cin cerr endl string vector map set unordered_map unordered_set unique_ptr shared_ptr weak_ptr make_unique make_shared move forward static_cast dynamic_cast const_cast reinterpret_cast printf scanf malloc free memcpy memset strlen printf sprintf fprintf puts getchar putchar exit abort assert std' },
			java: { ln: '//', bl: true, ct: true, kw: 'abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while true false null var record sealed permits yield', bn: 'String System out in err println print printf Math Integer Double Long Short Byte Float Character Boolean Object Class Exception RuntimeException IllegalArgumentException NullPointerException ArrayList HashMap HashSet List Map Set Optional StringBuilder Arrays Collections Thread Runnable' },
			go: { ln: '//', bl: true, bt: true, ct: true, kw: 'break case chan const continue default defer else fallthrough for func go goto if import interface map package range return select struct switch type var', bn: 'true false iota nil error string bool byte rune int int8 int16 int32 int64 uint uint8 uint16 uint32 uint64 uintptr float32 float64 complex64 complex128 any comparable len cap append copy make new delete panic recover print println sprintf fmt strings strconv sort time os io errors math' },
			rust: { ln: '//', bl: true, ct: true, kw: 'as async await break const continue crate dyn else enum extern false fn for if impl in let loop match mod move mut pub ref return self Self static struct super trait true type unsafe use where while', bn: 'Some None Ok Err String Vec Box Rc Arc RefCell HashMap HashSet Option Result print println format vec macro_rules' },
			shell: { hs: true, dl: true, kw: 'if then else elif fi for while until do done case esac function in select time coproc', bn: 'echo printf read cd ls pwd cat grep sed awk find cp mv rm mkdir touch chmod chown export source unset test exit return set shift' },
			sql: { ln: '--', bl: true, kw: 'select from where insert into values update set delete create table alter add drop index view join inner left right outer on as and or not null primary key foreign references unique default check constraint group by order having limit offset union all distinct case when then else end exists between like in is returning with recursive cast begin commit rollback transaction', bn: 'true false null' },
			toml: { hs: true, hsAny: true, ke: true, kw: 'true false', bn: '' },
			ini: { hs: true, hsAny: true, ke: true, kw: 'true false', bn: '' },
			css: { bl: true, kw: '', bn: '' },
			html: { tg: true, kw: '', bn: '' },
		};
		const HL_SETS = {};
		const hlSet = (s) => {
			const set = new Set();
			String(s || '').split(/\s+/).forEach((w) => { if (w) set.add(w) });
			return set;
		};
		Object.keys(HL).forEach((k) => {
			HL_SETS[k] = { kw: hlSet(HL[k].kw), bn: hlSet(HL[k].bn), ty: hlSet(HL[k].ty) };
		});
		const hlSpan = (cls, html) => '<span class="cg-tok-' + cls + '">' + html + '</span>';
		const HL_MAX = 300000;
		const HL_OP_RE = /^(===|!==|>>>|<<=|>>=|=>|\*\*|\+\+|--|&&|\|\||\?\?|\?\.|<=|>=|==|!=|<<|>>|\+=|-=|\*=|\/=|%=|\?|:|\.\.\.|\+|-|\*|\/|%|<|>|!|&|\||\^|~|=)/;
		const highlight = (text, lang) => {
			const cfg = HL[lang];
			if (!cfg) return escapeHtml(text);
			const src = String(text);
			if (src.length > HL_MAX) return escapeHtml(text);
			const sets = HL_SETS[lang];
			const n = src.length;
			let html = '';
			let i = 0;
			let prevCh = '';
			let multi = null;
			while (i < n) {
				if (multi) {
					const j = src.indexOf(multi.close, i);
					if (j === -1) { html += hlSpan(multi.cls, escapeHtml(src.slice(i - multi.openLen))); i = n; break }
					html += hlSpan(multi.cls, escapeHtml(src.slice(i - multi.openLen, j + multi.close.length)));
					prevCh = src[j + multi.close.length - 1];
					i = j + multi.close.length;
					multi = null;
					continue;
				}
				const c = src[i];
				const two = src.slice(i, i + 2);
				if (cfg.ln && two === cfg.ln) {
					const j = src.indexOf('\n', i);
					const end = j === -1 ? n : j;
					html += hlSpan('c', escapeHtml(src.slice(i, end)));
					prevCh = '\n';
					i = end; continue;
				}
				if (cfg.bl && two === '/*') {
					const j = src.indexOf('*/', i + 2);
					if (j === -1) { html += hlSpan('c', escapeHtml(src.slice(i))); i = n; break }
					html += hlSpan('c', escapeHtml(src.slice(i, j + 2)));
					prevCh = '/';
					i = j + 2; continue;
				}
				if (cfg.tg && src.slice(i, i + 4) === '<!--') {
					const j = src.indexOf('-->', i + 4);
					const end = j === -1 ? n : j + 3;
					html += hlSpan('c', escapeHtml(src.slice(i, end)));
					prevCh = '\n';
					i = end; continue;
				}
				if (cfg.hs && c === '#' && (cfg.hsAny || i === 0 || /\s/.test(src[i - 1]))) {
					const j = src.indexOf('\n', i);
					const end = j === -1 ? n : j;
					html += hlSpan('c', escapeHtml(src.slice(i, end)));
					prevCh = '\n';
					i = end; continue;
				}
				if (cfg.pr && c === '#') {
					let k = i - 1;
					while (k >= 0 && (src[k] === ' ' || src[k] === '\t')) k--;
					if (k < 0 || src[k] === '\n') {
						const j = src.indexOf('\n', i);
						const end = j === -1 ? n : j;
						html += hlSpan('d', escapeHtml(src.slice(i, end)));
						prevCh = '\n';
						i = end; continue;
					}
				}
				if (cfg.tr && (src.slice(i, i + 3) === '"""' || src.slice(i, i + 3) === "'''")) {
					multi = { cls: 's', close: src.slice(i, i + 3), openLen: 3 };
					i += 3; continue;
				}
				if (cfg.de && c === '@') {
					const dm = /^@[A-Za-z_][\w$]*/.exec(src.slice(i));
					if (dm) { html += hlSpan('b', escapeHtml(dm[0])); prevCh = dm[0][dm[0].length - 1]; i += dm[0].length; continue }
				}
				if (cfg.dl && c === '$') {
					const dm = /^\$[A-Za-z_][\w]*/.exec(src.slice(i));
					if (dm) { html += hlSpan('b', escapeHtml(dm[0])); prevCh = dm[0][dm[0].length - 1]; i += dm[0].length; continue }
				}
				if (c === '"' || c === "'") {
					let j = i + 1;
					let esc = false;
					while (j < n) {
						if (!esc && src[j] === c) break;
						if (!esc && src[j] === '\\') esc = true; else esc = false;
						if (src[j] === '\n') break;
						j++;
					}
					const end = j < n && src[j] === c ? j + 1 : j;
					let cls = 's';
					if (cfg.ks) {
						let k = end;
						while (k < n && (src[k] === ' ' || src[k] === '\t')) k++;
						if (src[k] === ':') cls = 'p';
					}
					html += hlSpan(cls, escapeHtml(src.slice(i, end)));
					prevCh = src[end - 1];
					i = end; continue;
				}
				if (cfg.bt && c === '`') {
					multi = { cls: 's', close: '`', openLen: 1 };
					i += 1; continue;
				}
				const nm = /^(0[xX][0-9a-fA-F]+|0[bB][01]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\.\d+)/.exec(src.slice(i));
				if (nm) {
					html += hlSpan('n', escapeHtml(nm[0]));
					prevCh = nm[0][nm[0].length - 1];
					i += nm[0].length; continue;
				}
				const idm = /^[A-Za-z_$][\w$]*/.exec(src.slice(i));
				if (idm) {
					const word = idm[0];
					let k2 = i + word.length;
					while (k2 < n && (src[k2] === ' ' || src[k2] === '\t')) k2++;
					const nextCh = src[i + word.length];
					let cls = '';
					if (sets.kw.has(word)) cls = 'k';
					else if (sets.bn.has(word)) cls = 'b';
					else if (sets.ty.has(word)) cls = 't';
					else if (cfg.ct && /^[A-Z]/.test(word)) cls = 't';
					else if (nextCh === '(') cls = 'f';
					else if (prevCh === '.') cls = 'p';
					else if (cfg.ki && src[k2] === ':') cls = 'p';
					else if (cfg.ke && src[k2] === '=' && src[k2 + 1] !== '=') cls = 'p';
					html += cls ? hlSpan(cls, escapeHtml(word)) : escapeHtml(word);
					prevCh = word[word.length - 1];
					i += word.length; continue;
				}
				if (cfg.tg && c === '<') {
					const gt = src.indexOf('>', i);
					const end = gt === -1 ? n : gt + 1;
					const seg = src.slice(i, end);
					let segHtml = '';
					let last = 0;
					let m;
					const tagRe = /(<\/?)([A-Za-z][\w-]*)|([A-Za-z-]+)(?=\s*=)|(\/?>)|("[^"]*"|'[^']*')/g;
					tagRe.lastIndex = 0;
					while ((m = tagRe.exec(seg)) !== null) {
						segHtml += escapeHtml(seg.slice(last, m.index));
						if (m[1]) segHtml += m[1] + hlSpan('t', escapeHtml(m[2]));
						else if (m[3]) segHtml += hlSpan('a', escapeHtml(m[3]));
						else if (m[4]) segHtml += escapeHtml(m[4]);
						else if (m[5]) segHtml += hlSpan('s', escapeHtml(m[5]));
						last = m.index + m[0].length;
					}
					segHtml += escapeHtml(seg.slice(last));
					html += segHtml;
					prevCh = seg[seg.length - 1] || '';
					i = end; continue;
				}
				const om = HL_OP_RE.exec(src.slice(i));
				if (om) {
					html += hlSpan('o', escapeHtml(om[0]));
					prevCh = om[0][om[0].length - 1];
					i += om[0].length; continue;
				}
				prevCh = c;
				html += escapeHtml(c);
				i++;
			}
			return html;
		};
		const splitHighlighted = (html) => {
			const out = [];
			const stack = [];
			const tagRe = /<\/?span( class="[^"]*")?>/g;
			for (const raw of html.split('\n')) {
				const startStack = stack.slice();
				let prefix = '';
				for (const cls of startStack) prefix += '<span class="' + cls + '">';
				tagRe.lastIndex = 0;
				let m;
				while ((m = tagRe.exec(raw)) !== null) {
					const t = m[0];
					if (t.startsWith('</')) stack.pop();
					else {
						const cm = /class="([^"]*)"/.exec(t);
						stack.push(cm ? cm[1] : '');
					}
				}
				let suffix = '';
				for (let i = stack.length - 1; i >= 0; i--) suffix += '</span>';
				out.push(prefix + raw + suffix);
			}
			return out;
		};
		const highlightLines = (text, lang) => {
			const html = highlight(text, lang);
			return splitHighlighted(html);
		};

		// [MATERIAL_ICONS_BEGIN]
// AUTO-GENERATED from PKief/vscode-material-icon-theme v5.37.0 (MIT License).
		// Regenerate with tools/gen-material-icons.mjs — do not edit by hand.
		const MATERIAL_ICONS = {
			"markdown": { viewBox: "0 0 32 32", body: "<path fill=\"#42a5f5\" d=\"m14 10-4 3.5L6 10H4v12h4v-6l2 2 2-2v6h4V10zm12 6v-6h-4v6h-4l6 8 6-8z\"/>" },
			"drawio": { viewBox: "0 0 32 32", body: "<path fill=\"#fb8c00\" d=\"m25.329 20-7.001-8H20V4h-8v8h1.672l-7.001 8H4v8h8v-8H9.328L16 12.376 22.672 20H20v8h8v-8z\"/>" },
			"javascript": { viewBox: "0 0 16 16", body: "<path fill=\"#ffca28\" d=\"M2 2v12h12V2zm6 6h1v4a1.003 1.003 0 0 1-1 1H7a1.003 1.003 0 0 1-1-1v-1h1v1h1zm3 0h2v1h-2v1h1a1.003 1.003 0 0 1 1 1v1a1.003 1.003 0 0 1-1 1h-2v-1h2v-1h-1a1.003 1.003 0 0 1-1-1V9a1.003 1.003 0 0 1 1-1\"/>" },
			"react": { viewBox: "0 0 32 32", body: "<path fill=\"#00bcd4\" d=\"M16 12c7.444 0 12 2.59 12 4s-4.556 4-12 4-12-2.59-12-4 4.556-4 12-4m0-2c-7.732 0-14 2.686-14 6s6.268 6 14 6 14-2.686 14-6-6.268-6-14-6\"/><path fill=\"#00bcd4\" d=\"M16 14a2 2 0 1 0 2 2 2 2 0 0 0-2-2\"/><path fill=\"#00bcd4\" d=\"M10.458 5.507c2.017 0 5.937 3.177 9.006 8.493 3.722 6.447 3.757 11.687 2.536 12.392a.9.9 0 0 1-.457.1c-2.017 0-5.938-3.176-9.007-8.492C8.814 11.553 8.779 6.313 10 5.608a.9.9 0 0 1 .458-.1m-.001-2A2.87 2.87 0 0 0 9 3.875C6.13 5.532 6.938 12.304 10.804 19c3.284 5.69 7.72 9.493 10.74 9.493A2.87 2.87 0 0 0 23 28.124c2.87-1.656 2.062-8.428-1.804-15.124-3.284-5.69-7.72-9.493-10.74-9.493Z\"/><path fill=\"#00bcd4\" d=\"M21.543 5.507a.9.9 0 0 1 .457.1c1.221.706 1.186 5.946-2.536 12.393-3.07 5.316-6.99 8.493-9.007 8.493a.9.9 0 0 1-.457-.1C8.779 25.686 8.814 20.446 12.536 14c3.07-5.316 6.99-8.493 9.007-8.493m0-2c-3.02 0-7.455 3.804-10.74 9.493C6.939 19.696 6.13 26.468 9 28.124a2.87 2.87 0 0 0 1.457.369c3.02 0 7.455-3.804 10.74-9.493C25.061 12.304 25.87 5.532 23 3.876a2.87 2.87 0 0 0-1.457-.369\"/>" },
			"typescript": { viewBox: "0 0 16 16", body: "<path fill=\"#0288d1\" d=\"M2 2v12h12V2zm4 6h3v1H8v4H7V9H6zm5 0h2v1h-2v1h1a1.003 1.003 0 0 1 1 1v1a1.003 1.003 0 0 1-1 1h-2v-1h2v-1h-1a1.003 1.003 0 0 1-1-1V9a1.003 1.003 0 0 1 1-1\"/>" },
			"react_ts": { viewBox: "0 0 32 32", body: "<path fill=\"#0288d1\" d=\"M16 12c7.444 0 12 2.59 12 4s-4.556 4-12 4-12-2.59-12-4 4.556-4 12-4m0-2c-7.732 0-14 2.686-14 6s6.268 6 14 6 14-2.686 14-6-6.268-6-14-6\"/><path fill=\"#0288d1\" d=\"M16 14a2 2 0 1 0 2 2 2 2 0 0 0-2-2\"/><path fill=\"#0288d1\" d=\"M10.458 5.507c2.017 0 5.937 3.177 9.006 8.493 3.722 6.447 3.757 11.687 2.536 12.392a.9.9 0 0 1-.457.1c-2.017 0-5.938-3.176-9.007-8.492C8.814 11.553 8.779 6.313 10 5.608a.9.9 0 0 1 .458-.1m-.001-2A2.87 2.87 0 0 0 9 3.875C6.13 5.532 6.938 12.304 10.804 19c3.284 5.69 7.72 9.493 10.74 9.493A2.87 2.87 0 0 0 23 28.124c2.87-1.656 2.062-8.428-1.804-15.124-3.284-5.69-7.72-9.493-10.74-9.493Z\"/><path fill=\"#0288d1\" d=\"M21.543 5.507a.9.9 0 0 1 .457.1c1.221.706 1.186 5.946-2.536 12.393-3.07 5.316-6.99 8.493-9.007 8.493a.9.9 0 0 1-.457-.1C8.779 25.686 8.814 20.446 12.536 14c3.07-5.316 6.99-8.493 9.007-8.493m0-2c-3.02 0-7.455 3.804-10.74 9.493C6.939 19.696 6.13 26.468 9 28.124a2.87 2.87 0 0 0 1.457.369c3.02 0 7.455-3.804 10.74-9.493C25.061 12.304 25.87 5.532 23 3.876a2.87 2.87 0 0 0-1.457-.369\"/>" },
			"python": { viewBox: "0 0 24 24", body: "<path fill=\"#0288d1\" d=\"M9.86 2A2.86 2.86 0 0 0 7 4.86v1.68h4.29c.39 0 .71.57.71.96H4.86A2.86 2.86 0 0 0 2 10.36v3.781a2.86 2.86 0 0 0 2.86 2.86h1.18v-2.68a2.85 2.85 0 0 1 2.85-2.86h5.25c1.58 0 2.86-1.271 2.86-2.851V4.86A2.86 2.86 0 0 0 14.14 2zm-.72 1.61c.4 0 .72.12.72.71s-.32.891-.72.891c-.39 0-.71-.3-.71-.89s.32-.711.71-.711\"/><path fill=\"#fdd835\" d=\"M17.959 7v2.68a2.85 2.85 0 0 1-2.85 2.859H9.86A2.85 2.85 0 0 0 7 15.389v3.75a2.86 2.86 0 0 0 2.86 2.86h4.28A2.86 2.86 0 0 0 17 19.14v-1.68h-4.291c-.39 0-.709-.57-.709-.96h7.14A2.86 2.86 0 0 0 22 13.64V9.86A2.86 2.86 0 0 0 19.14 7zM8.32 11.513l-.004.004.038-.004zm6.54 7.276c.39 0 .71.3.71.89a.71.71 0 0 1-.71.71c-.4 0-.72-.12-.72-.71s.32-.89.72-.89\"/>" },
			"c": { viewBox: "0 0 32 32", body: "<path fill=\"#0288d1\" d=\"M19.563 22A5.57 5.57 0 0 1 14 16.437v-2.873A5.57 5.57 0 0 1 19.563 8H24V2h-4.437A11.563 11.563 0 0 0 8 13.563v2.873A11.564 11.564 0 0 0 19.563 28H24v-6Z\"/>" },
			"cpp": { viewBox: "0 0 32 32", body: "<path fill=\"#0288d1\" d=\"M28 14v-4h-2v4h-6v-4h-2v4h-4v2h4v4h2v-4h6v4h2v-4h4v-2z\"/><path fill=\"#0288d1\" d=\"M13.563 22A5.57 5.57 0 0 1 8 16.437v-2.873A5.57 5.57 0 0 1 13.563 8H18V2h-4.437A11.563 11.563 0 0 0 2 13.563v2.873A11.564 11.564 0 0 0 13.563 28H18v-6Z\"/>" },
			"java": { viewBox: "0 0 32 32", body: "<path fill=\"#f44336\" d=\"M4 26h24v2H4zM28 4H7a1 1 0 0 0-1 1v13a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-4h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 8h-4V6h4Z\"/>" },
			"go": { viewBox: "0 0 32 32", body: "<path fill=\"#00acc1\" d=\"M2 12h4v2H2zm-2 4h6v2H0zm4 4h2v2H4zm16.954-5H14v3h3.239a4.42 4.42 0 0 1-3.531 2 2.65 2.65 0 0 1-2.053-.858 2.86 2.86 0 0 1-.628-2.28A4.515 4.515 0 0 1 15.292 13a2.73 2.73 0 0 1 1.749.584l2.962-1.185A5.6 5.6 0 0 0 15.292 10a7.526 7.526 0 0 0-7.243 6.5 5.614 5.614 0 0 0 5.659 6.5 7.526 7.526 0 0 0 7.243-6.5 6.4 6.4 0 0 0 .003-1.5\"/><path fill=\"#00acc1\" d=\"M26.292 10a7.526 7.526 0 0 0-7.243 6.5 5.614 5.614 0 0 0 5.659 6.5 7.526 7.526 0 0 0 7.243-6.5 5.614 5.614 0 0 0-5.659-6.5m2.681 6.137A4.515 4.515 0 0 1 24.708 20a2.65 2.65 0 0 1-2.053-.858 2.86 2.86 0 0 1-.628-2.28A4.515 4.515 0 0 1 26.292 13a2.65 2.65 0 0 1 2.053.858 2.86 2.86 0 0 1 .628 2.28Z\"/>" },
			"rust": { viewBox: "0 0 32 32", body: "<path fill=\"#ff7043\" d=\"m30 12-4-2V6h-4l-2-4-4 2-4-2-2 4H6v4l-4 2 2 4-2 4 4 2v4h4l2 4 4-2 4 2 2-4h4v-4l4-2-2-4ZM6 16a9.9 9.9 0 0 1 .842-4H10v8H6.842A9.9 9.9 0 0 1 6 16m10 10a9.98 9.98 0 0 1-7.978-4H16v-2h-2v-2h4c.819.819.297 2.308 1.179 3.37a1.89 1.89 0 0 0 1.46.63h3.34A9.98 9.98 0 0 1 16 26m-2-12v-2h4a1 1 0 0 1 0 2Zm11.158 6H24a2.006 2.006 0 0 1-2-2 2 2 0 0 0-2-2 3 3 0 0 0 3-3q0-.08-.004-.161A3.115 3.115 0 0 0 19.83 10H8.022a9.986 9.986 0 0 1 17.136 10\"/>" },
			"console": { viewBox: "0 0 16 16", body: "<path fill=\"#ff7043\" d=\"M2 2a1 1 0 0 0-1 1v10c0 .554.446 1 1 1h12c.554 0 1-.446 1-1V3a1 1 0 0 0-1-1zm0 3h12v8H2zm1 2 2 2-2 2 1 1 3-3-3-3zm5 3.5V12h5v-1.5z\"/>" },
			"powershell": { viewBox: "0 0 32 32", body: "<path fill=\"#03a9f4\" d=\"M29.07 6H7.677A1.535 1.535 0 0 0 6.24 7.113l-4.2 17.774A.852.852 0 0 0 2.93 26h21.393a1.535 1.535 0 0 0 1.436-1.113L29.96 7.112A.852.852 0 0 0 29.07 6M8.626 23.797a1.4 1.4 0 0 1-1.814-.31l-.007-.009a1.075 1.075 0 0 1 .315-1.599l9.6-6.061-6.102-5.852-.01-.01a1.068 1.068 0 0 1 .084-1.625l.037-.03a1.38 1.38 0 0 1 1.8.07l7.233 6.957a1.1 1.1 0 0 1 .236.739 1.08 1.08 0 0 1-.412.79c-.074.04-.146.119-10.951 6.935ZM24 22.94A1.135 1.135 0 0 1 22.803 24h-5.634a1.061 1.061 0 1 1 .001-2.112h5.633A1.134 1.134 0 0 1 24 22.938Z\"/>" },
			"database": { viewBox: "0 0 32 32", body: "<path fill=\"#ffca28\" d=\"M16 24c-5.525 0-10-.9-10-2v4c0 1.1 4.475 2 10 2s10-.9 10-2v-4c0 1.1-4.475 2-10 2m0-8c-5.525 0-10-.9-10-2v4c0 1.1 4.475 2 10 2s10-.9 10-2v-4c0 1.1-4.475 2-10 2m0-12C10.477 4 6 4.895 6 6v4c0 1.1 4.475 2 10 2s10-.9 10-2V6c0-1.105-4.477-2-10-2\"/>" },
			"php": { viewBox: "0 0 24 24", body: "<path fill=\"#1e88e5\" d=\"M12 18.08c-6.63 0-12-2.72-12-6.08s5.37-6.08 12-6.08S24 8.64 24 12s-5.37 6.08-12 6.08m-5.19-7.95c.54 0 .91.1 1.09.31.18.2.22.56.13 1.03-.1.53-.29.87-.58 1.09q-.42.33-1.29.33h-.87l.53-2.76zm-3.5 5.55h1.44l.34-1.75h1.23c.54 0 .98-.06 1.33-.17.35-.12.67-.31.96-.58.24-.22.43-.46.58-.73.15-.26.26-.56.31-.88.16-.78.05-1.39-.33-1.82-.39-.44-.99-.65-1.82-.65H4.59zm7.25-8.33-1.28 6.58h1.42l.74-3.77h1.14c.36 0 .6.06.71.18s.13.34.07.66l-.57 2.93h1.45l.59-3.07c.13-.62.03-1.07-.27-1.36-.3-.27-.85-.4-1.65-.4h-1.27L12 7.35zM18 10.13c.55 0 .91.1 1.09.31.18.2.22.56.13 1.03-.1.53-.29.87-.57 1.09-.29.22-.72.33-1.3.33h-.85l.5-2.76zm-3.5 5.55h1.44l.34-1.75h1.22c.55 0 1-.06 1.35-.17.35-.12.65-.31.95-.58.24-.22.44-.46.58-.73.15-.26.26-.56.32-.88.15-.78.04-1.39-.34-1.82-.36-.44-.99-.65-1.82-.65h-2.75z\"/>" },
			"ruby": { viewBox: "0 0 24 24", body: "<path fill=\"#f44336\" d=\"M18.041 3.177c2.24.382 2.879 1.919 2.843 3.527V6.67l-1.013 13.266-13.132.897h.008c-1.093-.044-3.518-.151-3.634-3.545l1.217-2.222 2.462 5.74 2.097-6.77-.045.009.018-.018 6.85 2.186L13.945 9.3l6.53-.409-5.144-4.212 2.71-1.51v.009M3.113 17.252v.017zM6.916 6.874c2.63-2.622 6.033-4.168 7.34-2.844 1.297 1.306-.072 4.523-2.702 7.135-2.666 2.613-6.015 4.248-7.322 2.933-1.306-1.324.036-4.612 2.675-7.224z\"/>" },
			"swift": { viewBox: "0 0 24 24", body: "<path fill=\"#ff6e40\" d=\"M17.087 19.721c-2.36 1.36-5.59 1.5-8.86.1a13.8 13.8 0 0 1-6.23-5.32c.67.55 1.46 1 2.3 1.4 3.37 1.57 6.73 1.46 9.1 0-3.37-2.59-6.24-5.96-8.37-8.71-.45-.45-.78-1.01-1.12-1.51 8.28 6.05 7.92 7.59 2.41-1.01 4.89 4.94 9.43 7.74 9.43 7.74.16.09.25.16.36.22.1-.25.19-.51.26-.78.79-2.85-.11-6.12-2.08-8.81 4.55 2.75 7.25 7.91 6.12 12.24-.03.11-.06.22-.05.39 2.24 2.83 1.64 5.78 1.35 5.22-1.21-2.39-3.48-1.65-4.62-1.17\"/>" },
			"kotlin": { viewBox: "0 0 24 24", body: "<defs><linearGradient id=\"fei-kotlin-a\" gradientTransform=\"translate(1.306 1.129)scale(.89324)\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#7c4dff\"/><stop offset=\".5\" stop-color=\"#d500f9\"/><stop offset=\"1\" stop-color=\"#ef5350\"/></linearGradient></defs><path fill=\"url(#fei-kotlin-a)\" d=\"M2.975 2.976v18.048h18.05v-.03l-4.478-4.511-4.48-4.515 4.48-4.515 4.443-4.477z\"/>" },
			"html": { viewBox: "0 0 32 32", body: "<path fill=\"#e65100\" d=\"m4 4 2 22 10 2 10-2 2-22Zm19.72 7H11.28l.29 3h11.86l-.802 9.335L15.99 25l-6.635-1.646L8.93 19h3.02l.19 2 3.86.77 3.84-.77.29-4H8.84L8 8h16Z\"/>" },
			"css": { viewBox: "0 0 32 32", body: "<path fill=\"#7e57c2\" d=\"M20 18h-2v-2h-2v2c0 .193 0 .703 1.254 1.033A3.345 3.345 0 0 1 20 22h2v2h2v-2c0-.388-.562-.851-1.254-1.034C20.356 20.34 20 18.84 20 18m-3.254 2.966C14.356 20.34 14 18.84 14 18h-2v-2h-2v8h2v-2h4v2h2v-2c0-.388-.562-.851-1.254-1.034\"/><path fill=\"#7e57c2\" d=\"M24 4H4v20a4 4 0 0 0 4 4h16.16A3.84 3.84 0 0 0 28 24.16V8a4 4 0 0 0-4-4m2 14h-2v-2h-2v2c0 .193 0 .703 1.254 1.033A3.345 3.345 0 0 1 26 22v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2 2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2 2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 2 2 0 0 1 2-2h2a2 2 0 0 1 2 2Z\"/>" },
			"sass": { viewBox: "0 0 32 32", body: "<path fill=\"#ec407a\" d=\"M27.837 5.673a4.33 4.33 0 0 0-2.293-2.701c-2.362-1.261-6.11-1.298-9.548-.092a26.3 26.3 0 0 0-8.76 4.966c-2.752 2.542-3.438 4.925-3.189 6.194.523 2.668 3.274 4.539 5.485 6.042.418.284.822.559 1.175.816-1.429.76-4.261 2.444-5.088 4.248a3.88 3.88 0 0 0-.118 3.332A2.37 2.37 0 0 0 6.869 29.8a5.6 5.6 0 0 0 1.49.2 6.35 6.35 0 0 0 5.19-2.856 6.74 6.74 0 0 0 .864-5.382 7.3 7.3 0 0 1 2.044-.03 3.92 3.92 0 0 1 2.816 1.311 1.82 1.82 0 0 1 .423 1.262 1.55 1.55 0 0 1-.772 1.05c-.234.14-.586.355-.504.803.036.194.198.633.894.512a2.93 2.93 0 0 0 2.145-2.651 4 4 0 0 0-1.197-2.904 5.94 5.94 0 0 0-4.396-1.626 10.6 10.6 0 0 0-2.672.304 20 20 0 0 0-2.203-1.846c-1.712-1.3-3.33-2.529-3.235-4.26.125-2.263 2.468-4.532 6.964-6.744 4.016-1.976 7.254-2.037 8.944-1.438a2 2 0 0 1 1.204.883 2.77 2.77 0 0 1-.36 2.47 9.71 9.71 0 0 1-7.425 4.304 3.86 3.86 0 0 1-3.238-.757c-.278-.302-.593-.645-1.074-.383q-.565.31-.225 1.189a3.9 3.9 0 0 0 2.407 1.92 11.7 11.7 0 0 0 7.128-.671c3.527-1.35 6.681-5.202 5.756-8.787M11.895 24.475a4 4 0 0 1-.192.468 4.5 4.5 0 0 1-.753 1.081 2.83 2.83 0 0 1-2.533 1.107c-.056-.032-.078-.146-.085-.193a3.28 3.28 0 0 1 1.076-2.284 11.3 11.3 0 0 1 2.644-1.933 3.85 3.85 0 0 1-.157 1.754\"/>" },
			"vue": { viewBox: "0 0 24 24", body: "<path fill=\"#41b883\" d=\"M1.791 3.851 12 21.471 22.209 3.936V3.85H18.24l-6.18 10.616L5.906 3.851z\"/><path fill=\"#35495e\" d=\"m5.907 3.851 6.152 10.617L18.24 3.851h-3.723L12.084 8.03 9.66 3.85z\"/>" },
			"json": { viewBox: "0 -960 960 960", body: "<path fill=\"#f9a825\" d=\"M560-160v-80h120q17 0 28.5-11.5T720-280v-80q0-38 22-69t58-44v-14q-36-13-58-44t-22-69v-80q0-17-11.5-28.5T680-720H560v-80h120q50 0 85 35t35 85v80q0 17 11.5 28.5T840-560h40v160h-40q-17 0-28.5 11.5T800-360v80q0 50-35 85t-85 35zm-280 0q-50 0-85-35t-35-85v-80q0-17-11.5-28.5T120-400H80v-160h40q17 0 28.5-11.5T160-600v-80q0-50 35-85t85-35h120v80H280q-17 0-28.5 11.5T240-680v80q0 38-22 69t-58 44v14q36 13 58 44t22 69v80q0 17 11.5 28.5T280-240h120v80z\"/>" },
			"yaml": { viewBox: "0 0 24 24", body: "<path fill=\"#ff5252\" d=\"M13 9h5.5L13 3.5zM6 2h8l6 6v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2m12 16v-2H9v2zm-4-4v-2H6v2z\"/>" },
			"toml": { viewBox: "0 0 16 16", body: "<path fill=\"#cfd8dc\" d=\"M4 6V4h8v2H9v7H7V6z\"/><path fill=\"#ef5350\" d=\"M4 1v1H2v12h2v1H1V1zm8 0v1h2v12h-2v1h3V1z\"/>" },
			"xml": { viewBox: "0 0 24 24", body: "<path fill=\"#8bc34a\" d=\"M13 9h5.5L13 3.5zM6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m.12 13.5 3.74 3.74 1.42-1.41-2.33-2.33 2.33-2.33-1.42-1.41zm11.16 0-3.74-3.74-1.42 1.41 2.33 2.33-2.33 2.33 1.42 1.41z\"/>" },
			"table": { viewBox: "0 0 24 24", body: "<path fill=\"#8bc34a\" d=\"M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m7 1.5V9h5.5zm4 7.5h-4v2h1l-2 1.67L10 13h1v-2H7v2h1l3 2.5L8 18H7v2h4v-2h-1l2-1.67L14 18h-1v2h4v-2h-1l-3-2.5 3-2.5h1z\"/>" },
			"settings": { viewBox: "0 0 24 24", body: "<path d=\"M0 0h24v24H0z\"/><path fill=\"#42a5f5\" d=\"M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.49.49 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1a.6.6 0 0 0-.18-.03c-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46a.5.5 0 0 0 .61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1q.09.03.18.03c.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64zm-1.98-1.71c.04.31.05.52.05.73s-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7 1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2 1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21 1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21 1.27.51 1.04.42.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13 1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7 1.21-1.07.85-.89.7zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4m0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2\"/>" },
			"word": { viewBox: "0 0 24 24", body: "<path fill=\"#01579b\" d=\"M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m7 1.5V9h5.5zM7 13l1.5 7h2l1.5-3 1.5 3h2l1.5-7h1v-2h-4v2h1l-.9 4.2L13 15h-2l-1.1 2.2L9 13h1v-2H6v2z\"/>" },
			"document": { viewBox: "0 0 24 24", body: "<path d=\"M0 0h24v24H0z\"/><path fill=\"#42a5f5\" d=\"M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm4 18H6V4h7v5h5z\"/>" },
			"tex": { viewBox: "0 0 1024 1024", body: "<path fill=\"#2196f3\" d=\"M80 192 64 320h32c16-80 16-96 63.242-96H176c8.837 0 16 7.163 16 16v352c0 8.837 0 16-32 16h-32v32h192v-32h-32c-32 0-32-7.163-32-16V240c0-8.837 7.163-16 16-16h16c48 0 48 16 64 96h32l-16-128zm560 0v32c16 0 45.713 0 52.57 16L776 434.666 708.57 592c-6.857 16-52.57 16-68.57 16v32h128v-32s-34.285 0-27.428-16L792 472l51.428 120c3.103 7.24-1.52 16-11.428 16v32h128v-32c-16 0-45.713 0-52.57-16L824 397.334 891.43 240c6.857-16 52.57-16 68.57-16v-32H832v32s34.285 0 27.428 16L808 360l-51.428-120c-3.103-7.24 1.52-16 11.428-16v-32zM320 384v32h32c32 0 32 7.163 32 16v352c0 8.837 0 16-32 16h-32v32h304l16-128h-32c-16 80-16 96-64 96h-64c-32 0-32-7.163-32-16V624h80c8.837 0 16 0 16 32v16h32V544h-32v16c0 32-7.163 32-16 32h-80V432c0-8.837 0-16 32-16h64c48 0 48 16 64 96h32l-16-128z\"/>" },
			"powerpoint": { viewBox: "0 0 24 24", body: "<path fill=\"#e64a19\" d=\"M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m7 1.5V9h5.5zM8 11v2h1v6H8v1h4v-1h-1v-2h2a3 3 0 0 0 3-3 3 3 0 0 0-3-3zm5 2a1 1 0 0 1 1 1 1 1 0 0 1-1 1h-2v-2z\"/>" },
			"pdf": { viewBox: "0 0 24 24", body: "<path fill=\"#ef5350\" d=\"M13 9h5.5L13 3.5zM6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m4.93 10.44c.41.9.93 1.64 1.53 2.15l.41.32c-.87.16-2.07.44-3.34.93l-.11.04.5-1.04c.45-.87.78-1.66 1.01-2.4m6.48 3.81c.18-.18.27-.41.28-.66.03-.2-.02-.39-.12-.55-.29-.47-1.04-.69-2.28-.69l-1.29.07-.87-.58c-.63-.52-1.2-1.43-1.6-2.56l.04-.14c.33-1.33.64-2.94-.02-3.6a.85.85 0 0 0-.61-.24h-.24c-.37 0-.7.39-.79.77-.37 1.33-.15 2.06.22 3.27v.01c-.25.88-.57 1.9-1.08 2.93l-.96 1.8-.89.49c-1.2.75-1.77 1.59-1.88 2.12-.04.19-.02.36.05.54l.03.05.48.31.44.11c.81 0 1.73-.95 2.97-3.07l.18-.07c1.03-.33 2.31-.56 4.03-.75 1.03.51 2.24.74 3 .74.44 0 .74-.11.91-.3m-.41-.71.09.11c-.01.1-.04.11-.09.13h-.04l-.19.02c-.46 0-1.17-.19-1.9-.51.09-.1.13-.1.23-.1 1.4 0 1.8.25 1.9.35M7.83 17c-.65 1.19-1.24 1.85-1.69 2 .05-.38.5-1.04 1.21-1.69zm3.02-6.91c-.23-.9-.24-1.63-.07-2.05l.07-.12.15.05c.17.24.19.56.09 1.1l-.03.16-.16.82z\"/>" },
			"image": { viewBox: "0 0 16 16", body: "<path fill=\"#26a69a\" d=\"M8.5 6h4l-4-4zM3.875 1H9.5l4 4v8.6c0 .773-.616 1.4-1.375 1.4h-8.25c-.76 0-1.375-.627-1.375-1.4V2.4c0-.777.612-1.4 1.375-1.4M4 13.6h8V8l-2.625 2.8L8 9.4zm1.25-7.7c-.76 0-1.375.627-1.375 1.4s.616 1.4 1.375 1.4c.76 0 1.375-.627 1.375-1.4S6.009 5.9 5.25 5.9\"/>" },
			"svg": { viewBox: "0 0 32 32", body: "<path fill=\"#ffb300\" d=\"M29.168 14.03a2.7 2.7 0 0 0-1.968-.83 2.51 2.51 0 0 0-1.929.8h-4.443l3.078-3.078a2.835 2.835 0 0 0 2.857-2.842 2.6 2.6 0 0 0-.831-1.969 2.82 2.82 0 0 0-2.014-.788 2.67 2.67 0 0 0-1.968.788 2.36 2.36 0 0 0-.812 1.922L18 11.17V6.726a2.51 2.51 0 0 0 .8-1.929 2.7 2.7 0 0 0-.832-1.968 2.745 2.745 0 0 0-3.936 0 2.7 2.7 0 0 0-.832 1.968 2.51 2.51 0 0 0 .8 1.93v4.443l-3.138-3.138a2.36 2.36 0 0 0-.812-1.922 2.66 2.66 0 0 0-1.968-.788 2.83 2.83 0 0 0-2.014.788 2.6 2.6 0 0 0-.831 1.969 2.74 2.74 0 0 0 .831 2.013 2.8 2.8 0 0 0 2.026.829l3.078 3.078H6.729a2.51 2.51 0 0 0-1.929-.8 2.7 2.7 0 0 0-1.968.831 2.745 2.745 0 0 0 0 3.937 2.7 2.7 0 0 0 1.968.832 2.51 2.51 0 0 0 1.929-.8h4.443l-3.078 3.077a2.835 2.835 0 0 0-2.857 2.842 2.6 2.6 0 0 0 .831 1.969 2.82 2.82 0 0 0 2.014.788 2.67 2.67 0 0 0 1.968-.788 2.36 2.36 0 0 0 .812-1.922L14 20.827v4.444a2.51 2.51 0 0 0-.8 1.929 2.784 2.784 0 0 0 4.768 1.968A2.7 2.7 0 0 0 18.8 27.2a2.51 2.51 0 0 0-.8-1.929v-4.444l3.138 3.138a2.36 2.36 0 0 0 .812 1.922 2.66 2.66 0 0 0 1.968.788 2.83 2.83 0 0 0 2.014-.788 2.6 2.6 0 0 0 .831-1.969 2.74 2.74 0 0 0-.831-2.013 2.8 2.8 0 0 0-2.026-.829L20.828 18h4.443a2.51 2.51 0 0 0 1.93.8 2.784 2.784 0 0 0 1.967-4.769Z\"/>" },
			"audio": { viewBox: "0 0 32 32", body: "<path fill=\"#ef5350\" d=\"M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m6 10h-4v8a4 4 0 1 1-4-4 3.96 3.96 0 0 1 2 .555V8h6Z\"/>" },
			"video": { viewBox: "0 0 32 32", body: "<path fill=\"#ff9800\" d=\"m24 6 2 6h-4l-2-6h-3l2 6h-4l-2-6h-3l2 6H8L6 6H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h22a3 3 0 0 0 3-3V6Z\"/>" },
			"zip": { viewBox: "0 0 24 24", body: "<path fill=\"#afb42b\" d=\"M14 17h-2v-2h-2v-2h2v2h2m0-6h-2v2h2v2h-2v-2h-2V9h2V7h-2V5h2v2h2m5-4H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2\"/>" },
			"exe": { viewBox: "0 0 32 32", body: "<path fill=\"#e64a19\" d=\"M28 4H4a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 22H4V10h24Z\"/>" },
			"dll": { viewBox: "0 0 24 24", body: "<path fill=\"#42a5f5\" d=\"M6 2a2 2 0 0 0-2 2v16c0 1.11.89 2 2 2h6v-2H6V4h7v5h5v3h2V8l-6-6m4 12a.26.26 0 0 0-.26.21l-.19 1.32c-.3.13-.59.29-.85.47l-1.24-.5c-.11 0-.24 0-.31.13l-1 1.73c-.06.11-.04.24.06.32l1.06.82a4.2 4.2 0 0 0 0 1l-1.06.82a.26.26 0 0 0-.06.32l1 1.73c.06.13.19.13.31.13l1.24-.5c.26.18.54.35.85.47l.19 1.32c.02.12.12.21.26.21h2c.11 0 .22-.09.24-.21l.19-1.32c.3-.13.57-.29.84-.47l1.23.5c.13 0 .26 0 .33-.13l1-1.73a.26.26 0 0 0-.06-.32l-1.07-.82c.02-.17.04-.33.04-.5s-.01-.33-.04-.5l1.06-.82a.26.26 0 0 0 .06-.32l-1-1.73c-.06-.13-.19-.13-.32-.13l-1.23.5c-.27-.18-.54-.35-.85-.47l-.19-1.32A.236.236 0 0 0 20 14m-1 3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5c-.84 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5\"/>" },
			"lock": { viewBox: "0 0 32 32", body: "<path fill=\"#ffd54f\" d=\"M25 12h-3V8a6 6 0 0 0-12 0v4H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V13a1 1 0 0 0-1-1M14 8a2 2 0 0 1 4 0v4h-4Zm2 17a4 4 0 1 1 4-4 4 4 0 0 1-4 4\"/>" },
			"log": { viewBox: "0 0 24 24", body: "<path d=\"M0 0h24v24H0z\"/><path fill=\"#afb42b\" d=\"M19 5v9h-5v5H5V5zm0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10l6-6V5c0-1.1-.9-2-2-2m-7 11H7v-2h5zm5-4H7V8h10z\"/>" },
			"git": { viewBox: "0 0 32 32", body: "<path fill=\"#e64a19\" d=\"M13.172 2.828 11.78 4.22l1.91 1.91 2 2A2.986 2.986 0 0 1 20 10.81a3.25 3.25 0 0 1-.31 1.31l2.06 2a2.68 2.68 0 0 1 3.37.57 2.86 2.86 0 0 1 .88 2.117 3.02 3.02 0 0 1-.856 2.109A2.9 2.9 0 0 1 23 19.81a2.93 2.93 0 0 1-2.13-.87 2.694 2.694 0 0 1-.56-3.38l-2-2.06a3 3 0 0 1-.31.12V20a3 3 0 0 1 1.44 1.09 2.92 2.92 0 0 1 .56 1.72 2.88 2.88 0 0 1-.878 2.128 2.98 2.98 0 0 1-2.048.871 2.981 2.981 0 0 1-2.514-4.719A3 3 0 0 1 16 20v-6.38a2.96 2.96 0 0 1-1.44-1.09 2.9 2.9 0 0 1-.56-1.72 2.9 2.9 0 0 1 .31-1.31l-3.9-3.9-7.579 7.572a4 4 0 0 0-.001 5.658l10.342 10.342a4 4 0 0 0 5.656 0l10.344-10.344a4 4 0 0 0 0-5.656L18.828 2.828a4 4 0 0 0-5.656 0\"/>" }
		};
		// [MATERIAL_ICONS_END]
// ---------- file-type icons (Material Icon Theme) ----------
		// Extension/full-name -> [icon key (see MATERIAL_ICONS above), tooltip].
		// Full-name keys cover dotfiles (.gitignore / .env); unknown types
		// fall back to the generic 'document' icon.
		const ICON_EXT = {
			md: ['markdown', 'Markdown'], markdown: ['markdown', 'Markdown'], mdown: ['markdown', 'Markdown'], mkd: ['markdown', 'Markdown'],
			mmd: ['drawio', 'Mermaid 图'], mermaid: ['drawio', 'Mermaid 图'],
			js: ['javascript', 'JavaScript'], mjs: ['javascript', 'JavaScript (ESM)'], cjs: ['javascript', 'JavaScript (CJS)'],
			jsx: ['react', 'React JSX'],
			ts: ['typescript', 'TypeScript'], mts: ['typescript', 'TypeScript (ESM)'], cts: ['typescript', 'TypeScript (CJS)'],
			tsx: ['react_ts', 'React TSX'],
			py: ['python', 'Python'], pyw: ['python', 'Python'],
			c: ['c', 'C'], h: ['c', 'C 头文件'],
			cpp: ['cpp', 'C++'], cc: ['cpp', 'C++'], cxx: ['cpp', 'C++'], hpp: ['cpp', 'C++ 头文件'], hh: ['cpp', 'C++ 头文件'], hxx: ['cpp', 'C++ 头文件'],
			java: ['java', 'Java'], go: ['go', 'Go'], rs: ['rust', 'Rust'],
			sh: ['console', 'Shell 脚本'], bash: ['console', 'Shell 脚本'], zsh: ['console', 'Shell 脚本'], bat: ['console', '批处理'], cmd: ['console', '批处理'],
			ps1: ['powershell', 'PowerShell'], sql: ['database', 'SQL'],
			php: ['php', 'PHP'], rb: ['ruby', 'Ruby'], swift: ['swift', 'Swift'], kt: ['kotlin', 'Kotlin'],
			html: ['html', 'HTML'], htm: ['html', 'HTML'],
			css: ['css', 'CSS'], scss: ['sass', 'SCSS'], less: ['sass', 'Less'], vue: ['vue', 'Vue'],
			json: ['json', 'JSON'], jsonc: ['json', 'JSONC'],
			yaml: ['yaml', 'YAML'], yml: ['yaml', 'YAML'],
			toml: ['toml', 'TOML'], xml: ['xml', 'XML'], csv: ['table', 'CSV'],
			ini: ['settings', 'INI'], conf: ['settings', '配置文件'], env: ['settings', '环境变量'],
			doc: ['word', 'Word 文档'], docx: ['word', 'Word 文档'], rtf: ['word', 'RTF 文档'],
			txt: ['document', '纯文本'], tex: ['tex', 'LaTeX'],
			xls: ['table', 'Excel 表格'], xlsx: ['table', 'Excel 表格'],
			ppt: ['powerpoint', 'PowerPoint'], pptx: ['powerpoint', 'PowerPoint'],
			pdf: ['pdf', 'PDF 文档'],
			png: ['image', 'PNG 图片'], jpg: ['image', 'JPEG 图片'], jpeg: ['image', 'JPEG 图片'], gif: ['image', 'GIF 图片'],
			webp: ['image', 'WebP 图片'], ico: ['image', '图标'], bmp: ['image', '位图'],
			svg: ['svg', 'SVG 矢量图'],
			mp3: ['audio', '音频'], wav: ['audio', '音频'],
			mp4: ['video', '视频'], mov: ['video', '视频'],
			zip: ['zip', '压缩包'], tar: ['zip', '压缩包'], gz: ['zip', '压缩包'], '7z': ['zip', '压缩包'], rar: ['zip', '压缩包'],
			exe: ['exe', '可执行文件'], dll: ['dll', '动态链接库'],
			lock: ['lock', '锁文件'], log: ['log', '日志'],
			gitignore: ['git', 'Git 忽略规则'], gitattributes: ['git', 'Git 属性'],
		};
		const tagFor = (name) => {
			if (!name) return { icon: 'document', title: '文件' };
			const lower = String(name).toLowerCase();
			const hit = ICON_EXT[lower] || (lower.charAt(0) === '.' ? ICON_EXT[lower.slice(1)] : null);
			if (hit) return { icon: hit[0], title: hit[1] };
			const i = name.lastIndexOf('.');
			if (i <= 0) return { icon: 'document', title: '文件' };
			const ext = name.slice(i + 1).toLowerCase();
			if (ICON_EXT[ext]) return { icon: ICON_EXT[ext][0], title: ICON_EXT[ext][1] };
			return { icon: 'document', title: ext.toUpperCase() + ' 文件' };
		};
		const FileTypeIcon = (props) => {
			if (props.entry.type === 'directory') return null;
			const info = tagFor(props.entry.name);
			const ic = (MATERIAL_ICONS && MATERIAL_ICONS[info.icon]) || (MATERIAL_ICONS && MATERIAL_ICONS.document) || null;
			const size = props.size || 14;
			return react.createElement('span', { className: 'cg-node-icon cg-node-file', title: info.title },
				ic
					? react.createElement('svg', {
						width: size, height: size,
						viewBox: ic.viewBox || '0 0 24 24',
						style: { display: 'block' },
						dangerouslySetInnerHTML: { __html: ic.body },
					})
					: react.createElement(Icon, { name: 'file', size }));
		};

// ---------- icons ----------
		const iconPaths = {
			chevronDown: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z',
			chevronRight: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
			close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
			refresh: 'M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 7.73 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z',
			reset: 'M12 5V2L7 6l5 4V7c3.31 0 6 2.69 6 6 0 2.97-2.17 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93 0-4.42-3.58-8-8-8zm-6 8c0-1.65.62-3.16 1.63-4.29L6.22 7.3C4.85 8.74 4 10.76 4 13c0 4.08 3.05 7.44 7 7.93v-2.02C8.17 18.43 6 15.97 6 13z',
			copy: 'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z',
			check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
			file: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z',
			folder: 'M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z',
			sidebar: 'M3 15h8v-2H3v2zm0 4h8v-2H3v2zm0-8h8V9H3v2zm0-6v2h8V5H3zm10 0h8v14h-8V5z',
			eye: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
			eyeOff: 'M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z',
			chevronUp: 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z',
		};
		const Icon = (props) => react.createElement('svg', {
			width: props.size || 14,
			height: props.size || 14,
			viewBox: '0 0 24 24',
			fill: 'currentColor',
			style: { display: 'block' },
		}, react.createElement('path', { d: iconPaths[props.name] }));

		// ---------- header toggle ----------
		const selectOpen = (s) => s.open;
		const ToggleButton = () => {
			const open = useStore(selectOpen);
			return react.createElement('button', {
				className: 'cg-toggle' + (open ? ' cg-toggle-on' : ''),
				title: '文件',
				'aria-label': '文件',
				onClick: toggleOpen,
			}, react.createElement(Icon, { name: 'sidebar', size: 15 }));
		};

		// ---------- file tree ----------
		const TreeNode = (props) => {
			const entry = props.entry;
			const tree = props.tree;
			const isDir = entry.type === 'directory';
			const expanded = tree.expanded.has(entry.path);
			const loading = tree.loading.has(entry.path);
			const error = tree.errors[entry.path];
			const children = tree.cache.get(entry.path);
			// 文件:单击 = 预览(onPreview),双击 = 真正打开(onOpen);
			// 目录:单击 = 展开/折叠
			const row = react.createElement('div', {
				className: 'cg-trow' + (tree.selected === entry.path ? ' cg-trow-sel' : ''),
				style: { paddingLeft: 4 + props.depth * 12 },
				onClick: (e) => {
					if (isDir) { props.onToggle(entry.path); return }
					if (e.detail >= 2) props.onOpen(entry);
					else if (props.onPreview) props.onPreview(entry);
					else props.onOpen(entry);
				},
				title: entry.path + (isDir ? '' : '\n单击预览 · 双击打开'),
			},
				react.createElement('span', { style: { display: 'flex', flex: 'none' } }, isDir
					? react.createElement(Icon, { name: expanded ? 'chevronDown' : 'chevronRight', size: 12 })
					: null),
				react.createElement('span', { className: 'cg-node-icon' + (isDir ? ' cg-trow-dir' : '') }, isDir
					? react.createElement(Icon, { name: 'folder', size: 14 })
					: react.createElement(FileTypeIcon, { entry, size: 14 })),
				react.createElement('span', { className: 'cg-trow-name' }, entry.name),
				isDir && loading ? react.createElement('span', { style: { color: 'var(--dsw-alias-label-secondary)', fontSize: '11px' } }, '…') : null,
				!isDir && typeof entry.size === 'number' ? react.createElement('span', { className: 'cg-trow-size' }, fmtSize(entry.size)) : null,
			);
			const nodes = [row];
			if (isDir && expanded) {
				if (children) {
					for (const child of children) {
						nodes.push(react.createElement(TreeNode, { key: child.path, entry: child, depth: props.depth + 1, tree, onToggle: props.onToggle, onOpen: props.onOpen, onPreview: props.onPreview }));
					}
				} else if (!loading && error) {
					nodes.push(react.createElement('div', { key: '__err', className: 'cg-trow-error', style: { paddingLeft: 4 + (props.depth + 1) * 12 } }, error));
				}
			}
			return react.createElement('div', null, ...nodes);
		};

		// ---------- main panel ----------
		const MAX_LINES = 10000;
		const TAB_MAX = 8;

		const lineFuncIndex = (fns, lineNo) => {
			if (!fns || fns.length === 0) return null;
			let lo = 0, hi = fns.length - 1, k = -1;
			while (lo <= hi) {
				const mid = (lo + hi) >> 1;
				if (fns[mid].start <= lineNo) { k = mid; lo = mid + 1 } else hi = mid - 1;
			}
			if (k === -1) return null;
			if (lineNo >= fns[k].start && lineNo <= fns[k].end) return k;
			for (let i = 0; i <= k; i++) {
				if (lineNo >= fns[i].start && lineNo <= fns[i].end) return i;
			}
			return null;
		};

		const jumpTargetLine = (fn, content) => {
			if (!content) return fn.start;
			const lines = contentLines(content);
			for (let k = fn.start; k <= Math.min(lines.length, fn.start + 20); k++) {
				if (/^\s*(?:async\s+)?def\s/.test(lines[k - 1])
					|| /^\s*(?:export\s+)?(?:async\s+)?function\s/.test(lines[k - 1])
					|| /^\s*(?:func|fn)\s/.test(lines[k - 1])
					|| /^\s*class\s/.test(lines[k - 1])
					|| /^\s*(?:const|let|var)\s/.test(lines[k - 1])) return k;
			}
			return fn.start;
		};

		const findVarLineIn = (name, start, end, lines) => {
			const mkRe = (p) => new RegExp('(?<![A-Za-z0-9_$])' + p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![A-Za-z0-9_$])');
			const tokenM = /^[A-Za-z_$][\w$]*/.exec(name);
			const candidates = [name];
			if (tokenM && tokenM[0] !== name) candidates.push(tokenM[0]);
			const ranges = [[Math.max(1, start), Math.max(start, end)], [1, lines.length]];
			for (const range of ranges) {
				for (const c of candidates) {
					const re = mkRe(c);
					for (let i = range[0]; i <= Math.min(range[1], lines.length); i++) {
						if (re.test(lines[i - 1])) return i;
					}
				}
			}
			return -1;
		};

		// ---------- useTabState: 页签/预览状态管理 ----------
		const tabActions = {
			SET_TABS: 'SET_TABS',
			SET_ACTIVE: 'SET_ACTIVE',
			SET_PREVIEW: 'SET_PREVIEW',
			SET_PREVIEW_ACTIVE: 'SET_PREVIEW_ACTIVE',
			PATCH_TAB: 'PATCH_TAB',
			BATCH: 'BATCH',
		};
		const tabReducer = (state, action) => {
			switch (action.type) {
				case tabActions.SET_TABS:
					return { ...state, tabs: action.tabs };
				case tabActions.SET_ACTIVE:
					return { ...state, activePath: action.path };
				case tabActions.SET_PREVIEW:
					return { ...state, preview: action.file };
				case tabActions.SET_PREVIEW_ACTIVE:
					return { ...state, previewActive: action.active };
				case tabActions.PATCH_TAB: {
					const { path, updater } = action;
					if (state.preview && state.preview.path === path) {
						const n = typeof updater === 'function' ? updater(state.preview) : updater;
						return { ...state, preview: (n === null || n === false) ? null : n };
					}
					let hit = false;
					const nextTabs = state.tabs.map((t) => {
						if (t.path !== path) return t;
						hit = true;
						const n = typeof updater === 'function' ? updater(t) : updater;
						return (n === null || n === false) ? null : n;
					}).filter(Boolean);
					if (hit) return { ...state, tabs: nextTabs };
					return state;
				}
				case tabActions.BATCH: {
					let s = state;
					for (const a of action.actions) s = tabReducer(s, a);
					return s;
				}
				default: return state;
			}
		};

		const useTabState = (rootKey) => {
			const [state, dispatch] = react.useReducer(tabReducer, {
				tabs: [],
				activePath: null,
				preview: null,
				previewActive: false,
			});
			const ref = react.useRef(state);
			ref.current = state;

			// 同步更新 ref 后再 dispatch，保证同帧后续代码读 ref 能拿到新值
			const eagerDispatch = (action) => {
				ref.current = tabReducer(ref.current, action);
				dispatch(action);
			};

			const commitTabs = (tabs) => eagerDispatch({ type: tabActions.SET_TABS, tabs });
			const setActivePath = (path) => eagerDispatch({ type: tabActions.SET_ACTIVE, path });
			const setPreview = (file) => eagerDispatch({ type: tabActions.SET_PREVIEW, file });
			const setPreviewActive = (active) => eagerDispatch({ type: tabActions.SET_PREVIEW_ACTIVE, active });
			const patchTab = (path, updater) => {
				const s = ref.current;
				if ((s.preview && s.preview.path === path) || s.tabs.some((t) => t.path === path)) {
					eagerDispatch({ type: tabActions.PATCH_TAB, path, updater });
					return;
				}
				patchParked(path, updater);
			};
			const patchActive = (updater) => {
				const s = ref.current;
				const f = currentFile(s);
				if (f) patchTab(f.path, updater);
			};

			const patchParked = (path, updater) => {
				for (const [key, entry] of workspaceTabSets) {
					if (key === rootKey) continue;
					let changed = false;
					let nextPv = entry.preview;
					if (nextPv && nextPv.path === path) {
						const n = typeof updater === 'function' ? updater(nextPv) : updater;
						nextPv = (n === null || n === false) ? null : n;
						changed = changed || nextPv !== entry.preview;
					}
					const nextTabs = entry.tabs.map((t) => {
						if (t.path !== path) return t;
						const n = typeof updater === 'function' ? updater(t) : updater;
						changed = changed || n !== t;
						return (n === null || n === false) ? null : n;
					}).filter(Boolean);
					if (changed) {
						workspaceTabSets.set(key, { tabs: nextTabs, preview: nextPv, previewActive: entry.previewActive, activePath: entry.activePath });
					}
				}
			};

			const pruneTabs = (next) => {
				if (next.length < TAB_MAX) return next;
				const s = ref.current;
				let victim = null;
				for (const t of next) {
					if (t.path === s.activePath) continue;
					if (!victim || (t.lastUsed || 0) < (victim.lastUsed || 0)) victim = t;
				}
				return victim ? next.filter((t) => t !== victim) : next;
			};

			const batch = (...actions) => eagerDispatch({ type: tabActions.BATCH, actions });

			return { state, commitTabs, setActivePath, setPreview, setPreviewActive, patchTab, patchActive, pruneTabs, batch, ref };
		};
		const currentFile = (s) => (s.preview && s.previewActive) ? s.preview : s.tabs.find((t) => t.path === s.activePath) || null;

		const useDragResize = (fileRef) => {
			const [drag, setDrag] = react.useState(null);

			const onResizeStart = (e) => {
				const file = fileRef.current;
				e.preventDefault();
				const target = file ? 'code' : 'tree';
				const showGuide = !!(file && file.guideOn);
				setDrag({
					kind: 'outer',
					target,
					startX: e.clientX,
					startW: target === 'code' ? effCodeOf(store.pane, showGuide) : store.pane.tree,
					startCodeW: effCodeOf(store.pane, showGuide),
					startGuideW: store.pane.guide,
				});
			};

			const onDividerStart = (kind) => (e) => {
				e.preventDefault();
				setDrag({
					kind,
					startX: e.clientX,
					startCodeW: effCodeOf(store.pane, true),
					startTreeW: store.pane.tree,
					startSourceW: sourceWidthOf(store.pane, true),
				});
			};

			const dragMaxOf = (others) => Math.max(PANE_MIN_PX, window.innerWidth - 90 - others);

			const onResizeMove = (e) => {
				if (!drag) return;
				const file = fileRef.current;
				const dx = e.clientX - drag.startX;
				if (drag.kind === 'outer') {
					if (drag.target === 'tree') {
						const w = Math.max(PANE_MIN_PX, Math.min(dragMaxOf(file ? effCodeOf(store.pane, false) + PANE_DIV_W : 0), drag.startW - dx));
						store.pane = { ...store.pane, tree: w };
					} else {
						const showGuide = !!(file && file.guideOn);
						const min = codeFloorFor(store.pane, showGuide);
						const w = Math.max(min, Math.min(dragMaxOf(store.pane.tree + PANE_DIV_W), drag.startW - dx));
						if (file && file.guideOn) {
							const gRatio = drag.startGuideW / Math.max(1, drag.startCodeW - PANE_DIV_W);
							const guideW = Math.max(PANE_MIN_PX, Math.min(Math.round((w - PANE_DIV_W) * gRatio), w - PANE_DIV_W - PANE_MIN_PX));
							store.pane = { ...store.pane, code: w, guide: guideW };
						} else {
							store.pane = { ...store.pane, code: w };
						}
					}
				} else if (drag.kind === 'code') {
					const sourceW = Math.max(PANE_MIN_PX, Math.min(drag.startCodeW - PANE_DIV_W - PANE_MIN_PX, drag.startSourceW + dx));
					store.pane = { ...store.pane, guide: drag.startCodeW - PANE_DIV_W - sourceW };
				} else if (drag.kind === 'tree') {
					const w = Math.max(PANE_MIN_PX, Math.min(dragMaxOf(effCodeOf(store.pane, false) + PANE_DIV_W), drag.startTreeW - dx));
					store.pane = { ...store.pane, tree: w };
				}
				emit();
			};

			const endDrag = () => {
				if (drag) {
					try { localStorage.setItem('cg-pane', JSON.stringify(store.pane)); } catch (_) {}
				}
				setDrag(null);
			};

			const resizeMoveRef = react.useRef(onResizeMove);
			resizeMoveRef.current = onResizeMove;
			const endDragRef = react.useRef(endDrag);
			endDragRef.current = endDrag;

			react.useEffect(() => {
				if (!drag) return;
				let raf = null;
				const onMove = (e) => {
					if (raf !== null) return;
					raf = requestAnimationFrame(() => { raf = null; resizeMoveRef.current(e) });
				};
				const onUp = () => { if (raf !== null) { cancelAnimationFrame(raf); raf = null } endDragRef.current() };
				window.addEventListener('pointermove', onMove);
				window.addEventListener('pointerup', onUp);
				window.addEventListener('pointercancel', onUp);
				return () => {
					if (raf !== null) cancelAnimationFrame(raf);
					window.removeEventListener('pointermove', onMove);
					window.removeEventListener('pointerup', onUp);
					window.removeEventListener('pointercancel', onUp);
				};
			}, [!!drag]);

			return { drag, onResizeStart, onDividerStart, onResizeMove, endDrag };
		};

		const GuidePanel = (props) => {
			const s = useStore();
			const currentSessionId = props.useSessions((st) => st.current);
			const wsItems = props.useWorkspaces((st) => st.items);
			const recentWorkspaceId = props.useWorkspaces((st) => st.recentWorkspaceId);

			// 预热 mermaid 引擎:面板挂载即开始后台加载,md 预览首次渲染
			// 不再等待引擎下载
			react.useEffect(() => {
				loadMermaidAsset().catch(() => {});
			}, []);

			let rootPath = null;
			let rootName = '';
			if (currentSessionId) {
				for (const w of wsItems) {
					if (w.sessionIds.indexOf(currentSessionId) >= 0) { rootPath = w.path; rootName = w.title; break }
				}
			}
			if (!rootPath && recentWorkspaceId) {
				for (const w of wsItems) {
					if (w.workspaceId === recentWorkspaceId) { rootPath = w.path; rootName = w.title; break }
				}
			}
			if (!rootPath && wsItems.length > 0) { rootPath = wsItems[0].path; rootName = wsItems[0].title }

			const [tree, setTree] = react.useState(null);
			const rootKey = rootPath || '';
			const tm = useTabState(rootKey);
			const { tabs, activePath, preview: previewFile, previewActive } = tm.state;
			const file = currentFile(tm.state);
			const tabsRef = { get current() { return tm.ref.current.tabs } };
			const activePathRef = { get current() { return tm.ref.current.activePath } };
			const previewRef = { get current() { return tm.ref.current.preview } };
			const previewActiveRef = { get current() { return tm.ref.current.previewActive } };
			const commitTabs = tm.commitTabs;
			const setActivePath = tm.setActivePath;
			const setPreviewFile = tm.setPreview;
			const setPreviewActive = (v) => tm.setPreviewActive(!!v);

			const findState = file && file.find ? file.find : null;
			const findMatches = react.useMemo(() => {
				if (!file || !findState || !findState.open) return [];
				const q = String((findState.query || '')).trim();
				if (!q) return [];
				return computeFindMatches(file.content || '', q, !!findState.caseSensitive, MAX_LINES);
			}, [file && file.path, file && file.content, findState && findState.open, findState && findState.query, findState && findState.caseSensitive]);
			const mdParsed = react.useMemo(() => {
				if (!file || file.view !== 'preview' || !isMarkdown(file.name)) return null;
				let text = file.content || '';
				if (findState && findState.open && findMatches.length > 0) {
					const lines = contentLines(text);
					text = markFindLines(lines, findMatches, findState.current || 0).join('\n');
				}
				return renderMarkdown(text);
			}, [file && file.path, file && file.view, file && file.content, findMatches, findState && findState.open, findState && findState.current]);
			// md 目录条目(标题列表):由 mdParsed 派生
			const tocItems = react.useMemo(() => {
				if (!file || file.view !== 'preview' || !isMarkdown(file.name) || !mdParsed) return [];
				return mdParsed.headings.map((h, i) => ({ key: 'h' + i, id: h.id, name: h.text, kind: 'H' + h.level }));
			}, [file && file.path, file && file.view, mdParsed]);
			// 命中列表/当前命中变化时跟随滚动:代码视图按行号数学定位;
			// md 预览按渲染后的 <mark class="cg-find-cur"> 元素定位。
			// 「视图键」= 活动页签 + 预览态:键变化 = 页签/预览切换,跳过
			// 跟随(阅读位置交给页签恢复逻辑);同一视图内命中/当前命中
			// 变化才跟随。以视图键而非文件路径判定,同名文件的
			// 「预览页签 ↔ 固定页签」切换也能正确跳过
			const lastFindFollowViewRef = react.useRef(null);
			react.useEffect(() => {
				// viewKey 必须先算先存:切到的视图没有 find state/命中时提前
				// 返回,若不更新 ref,ref 里残留旧视图键,切回原视图时守卫
				// 误判"没离开过"而错误跟随
				const viewKey = (activePath || '') + (previewActive ? '#pv' : '#tab');
				if (!findState || !findState.open || findMatches.length === 0) {
					lastFindFollowViewRef.current = viewKey;
					return;
				}
				if (lastFindFollowViewRef.current === viewKey) {
					const i = Math.min(Math.max(findState.current || 0, 0), findMatches.length - 1);
					if (file && file.view === 'preview' && isMarkdown(file.name)) {
						const container = mdRef.current;
						if (container) {
							const el = container.querySelector('mark.cg-find-cur');
							if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
						}
						return;
					}
					jumpToLine(findMatches[i].line);
				}
				lastFindFollowViewRef.current = viewKey;
			}, [findMatches, findState && findState.current, activePath, previewActive]);
			const patchTab = tm.patchTab;
			const patchActive = tm.patchActive;
			const openFind = () => {
				if (!file) return;
				patchActive((t) => t ? { ...t, find: { open: true, query: (t.find && t.find.query) || '', caseSensitive: !!(t.find && t.find.caseSensitive), current: 0 } } : t);
			};
			const closeFind = () => {
				if (!file) return;
				patchActive((t) => t ? { ...t, find: { ...(t.find || {}), open: false } } : t);
			};
			const updateFindQuery = (q) => {
				if (!file) return;
				patchActive((t) => t ? { ...t, find: { open: true, query: q, caseSensitive: !!(t.find && t.find.caseSensitive), current: 0 } } : t);
			};
			const toggleFindCase = () => {
				if (!file) return;
				patchActive((t) => t ? { ...t, find: { open: true, query: (t.find && t.find.query) || '', caseSensitive: !(t.find && t.find.caseSensitive), current: 0 } } : t);
			};
			const findNav = (delta) => {
				const m = findMatches;
				if (!file || m.length === 0) return;
				const f = file.find;
				if (!f) return;
				const next = ((f.current || 0) + delta + m.length) % m.length;
				patchActive((t) => t ? { ...t, find: { ...t.find, current: next } } : t);
				jumpToLine(m[next].line);
			};
			// md 目录条目点击:容器内平滑滚动到对应标题
			const onTocPick = (it) => {
				const container = mdRef.current;
				if (!container || !it || !it.id) return;
				const el = container.querySelector('[id="' + String(it.id).replace(/"/g, '\\"') + '"]');
				if (el) {
					el.scrollIntoView({ behavior: 'smooth', block: 'start' });
					mdActiveIdRef.current = it.id;
					setMdActiveId(it.id);
				}
			};
			// md 预览滚动 → 目录当前项跟随(rAF 节流,按标题元素位置取最后一个越线者)
			const onMdScroll = (headings) => {
				if (mdScrollRafRef.current !== null) return;
				mdScrollRafRef.current = requestAnimationFrame(() => {
					mdScrollRafRef.current = null;
					const container = mdRef.current;
					if (!container || !headings || headings.length === 0) return;
					const base = container.getBoundingClientRect().top;
					let active = null;
					for (const h of headings) {
						const el = container.querySelector('[id="' + String(h.id).replace(/"/g, '\\"') + '"]');
						if (!el) continue;
						if (el.getBoundingClientRect().top - base <= 90) active = h.id;
					}
					if (active !== mdActiveIdRef.current) { mdActiveIdRef.current = active; setMdActiveId(active) }
				});
			};
			// 虚拟滚动窗口按 scrollTop 重算;跳转可先行调用,让目标窗口与
			// 落位在同帧渲染,避免"滚到一片空占位 spacer(深色底、看似黑屏)"
			const seedVrange = (top) => {
				const total = Math.min(codeTotalLines, MAX_LINES);
				if (total <= 0) return;
				const pane = codePaneRef.current;
				const viewH = pane ? pane.clientHeight : 600;
				const start = Math.max(0, Math.floor(top / LINE_H) - VIRT_OVERSCAN);
				const end = Math.min(total, Math.ceil((top + viewH) / LINE_H) + VIRT_OVERSCAN + 1);
				setVrange((v) => (v.start === start && v.end === end ? v : { start, end }));
			};
			const scrollAnimatingRef = react.useRef(false);
			const onCodeScroll = () => {
				if (scrollAnimatingRef.current) return;
				if (codeScrollRafRef.current !== null) return;
				codeScrollRafRef.current = requestAnimationFrame(() => {
					codeScrollRafRef.current = null;
					const pane = codePaneRef.current;
					if (!pane) return;
					seedVrange(pane.scrollTop);
				});
			};
			const [active, setActive] = react.useState(null);
			const [tab, setTab] = react.useState('guide');
			const [tocOpen, setTocOpen] = react.useState(false);
			const [mdActiveId, setMdActiveId] = react.useState(null);
			const [vrange, setVrange] = react.useState({ start: 0, end: 80 });
			const mdActiveIdRef = react.useRef(null);
			const mdScrollRafRef = react.useRef(null);
			const codeScrollRafRef = react.useRef(null);
			const [winTick, setWinTick] = react.useState(0);
			const [flash, setFlash] = react.useState(null);
			const flashTimerRef = react.useRef(null);
			const itemFlashTimerRef = react.useRef(null);
			const itemFlashElRef = react.useRef(null);
			const [jumpLine, setJumpLine] = react.useState(null);
			const jumpLineTimerRef = react.useRef(null);
			const jumpHistoryRef = react.useRef([]);
			const jumpIndexRef = react.useRef(-1);
			const lastFocusRef = react.useRef(null);
			const [autoWatch, setAutoWatch] = react.useState(true);
			const treeRef = react.useRef(null);
			const pollBusyRef = react.useRef(false);
			const pollFpRef = react.useRef(new Map());
			const [status, setStatus] = react.useState(null);
			const statusSeqRef = react.useRef(0);
			const statusTimerRef = react.useRef(null);
			const mdRef = react.useRef(null);

			const codePaneRef = react.useRef(null);
			const guideRef = react.useRef(null);
			const codeHighlighted = react.useMemo(() => {
				if (!file || file.reading || file.error || file.tooLarge || file.binary || file.view === 'preview') return null;
				const lines = contentLines(file.content);
				const shown = lines.slice(0, MAX_LINES);
				let markedLines = shown;
				if (findMatches.length > 0) markedLines = markFindLines(markedLines, findMatches, -1);
				const lang = file && file.name ? hlLangFor(file.name) : '';
				const joined = markedLines.join('\n');
				const baseHtmls = lang && lang !== 'markdown' && lang !== 'text'
					? highlightLines(joined, lang).slice(0, MAX_LINES)
					: markedLines.map(escapeHtml);
				return { baseHtmls, totalLines: lines.length, truncated: lines.length > MAX_LINES };
			}, [file && file.path, file && file.view, file && file.content, file && file.name, findMatches]);

			const codeBuilt = react.useMemo(() => {
				if (!codeHighlighted) return null;
				const { baseHtmls, totalLines, truncated } = codeHighlighted;
				const flashFn = flash && file && file.functions ? file.functions[flash.funcIndex] : null;
				if (flashFn && flash && flash.name) {
					const esc = flash.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
					const re = new RegExp('(?<![A-Za-z0-9_$])(' + esc + ')(?![A-Za-z0-9_$])', 'g');
					const open = '<mark class="cg-var-hit">', close = '</mark>';
					const lineHtmls = baseHtmls.map((h, idx) => {
						const lineNo = idx + 1;
						if (lineNo < flashFn.start || lineNo > flashFn.end) return h;
						return h.replace(re, open + '$1' + close);
					});
					return { lineHtmls, totalLines, truncated };
				}
				return { lineHtmls: baseHtmls, totalLines, truncated };
			}, [codeHighlighted, flash && flash.name, flash && flash.funcIndex]);
			const codeTotalLines = codeBuilt ? codeBuilt.totalLines : 0;

			const resetFocusState = () => {
				setActive(null);
				setFlash(null);
				setJumpLine(null);
				if (flashTimerRef.current !== null) { clearTimeout(flashTimerRef.current); flashTimerRef.current = null }
				if (itemFlashTimerRef.current !== null) { clearTimeout(itemFlashTimerRef.current); itemFlashTimerRef.current = null }
				itemFlashElRef.current = null;
				if (jumpLineTimerRef.current !== null) { clearTimeout(jumpLineTimerRef.current); jumpLineTimerRef.current = null }
				jumpHistoryRef.current = [];
				jumpIndexRef.current = -1;
				lastFocusRef.current = null;
			};
			// 切页前保存当前显示文件的滚动位置(源码/预览谁挂载存谁)
			const saveScroll = () => {
				const p = file ? file.path : null;
				if (!p) return;
				const scroller = codePaneRef.current || mdRef.current;
				if (!scroller) return;
				const top = scroller.scrollTop;
				patchTab(p, (t) => t ? { ...t, scrollTop: top } : t);
			};
			const switchTo = (path) => {
				if (!path || (path === activePathRef.current && !(previewRef.current && previewActiveRef.current))) return;
				saveScroll();
				resetFocusState();
				if (previewRef.current) setPreviewActive(false);
				commitTabs(tabsRef.current.map((t) => t.path === path ? { ...t, lastUsed: Date.now() } : t));
				setActivePath(path);
			};
			const switchToPreview = () => {
				if (!previewRef.current || previewActiveRef.current) return;
				saveScroll();
				resetFocusState();
				setPreviewActive(true);
			};
			const closePreview = () => {
				setPreviewFile(null);
				setPreviewActive(false);
				resetFocusState();
			};
			react.useLayoutEffect(() => {
				const t = file;
				const scroller = codePaneRef.current || mdRef.current;
				if (!scroller) return;
				scroller.scrollTop = (t && typeof t.scrollTop === 'number') ? t.scrollTop : 0;
			}, [activePath, previewActive]);

			const without = (set, v) => { const n = new Set(set); n.delete(v); return n };
			const withVal = (set, v) => { const n = new Set(set); n.add(v); return n };
			const showStatus = (msg) => {
				const seq = ++statusSeqRef.current;
				setStatus(msg);
				if (statusTimerRef.current !== null) clearTimeout(statusTimerRef.current);
				statusTimerRef.current = setTimeout(() => { if (seq === statusSeqRef.current) setStatus(null) }, 4000);
			};

			const rootKeyRef = react.useRef(null);
			react.useEffect(() => {
				const saved = rootKey ? workspaceTabSets.get(rootKey) : null;
				tm.batch(
					{ type: tabActions.SET_TABS, tabs: saved ? saved.tabs : [] },
					{ type: tabActions.SET_PREVIEW, file: saved ? saved.preview : null },
					{ type: tabActions.SET_PREVIEW_ACTIVE, active: saved ? !!saved.previewActive : false },
					{ type: tabActions.SET_ACTIVE, path: saved ? saved.activePath : null },
				);
				resetFocusState();
				setTocOpen(false);
			}, [rootKey]);
			react.useEffect(() => {
				if (!rootKey) return;
				if (rootKeyRef.current !== rootKey) { rootKeyRef.current = rootKey; return }
				workspaceTabSets.set(rootKey, {
					tabs,
					preview: previewFile,
					previewActive,
					activePath,
				});
			}, [rootKey, tabs, previewFile, previewActive, activePath]);

			react.useEffect(() => {
				if (!rootPath) { setTree(null); store.rootPath = null; return }
				store.rootPath = rootPath;
				pollFpRef.current = new Map();
				let cancelled = false;
				setTree({ rootPath, rootName, expanded: new Set([rootPath]), cache: new Map(), loading: new Set([rootPath]), selected: null, errors: {} });
				api.list(rootPath).then((res) => {
					if (cancelled) return;
					const entries = (res && res.entries) || [];
					if (!res || !res.error) pollFpRef.current.set(rootPath, entries.map((e) => e.type + ':' + e.name).join('|'));
					setTree((t) => {
						if (!t || t.rootPath !== rootPath) return t;
						const next = { ...t, loading: without(t.loading, rootPath) };
						if (res && res.error) next.errors = { ...t.errors, [rootPath]: res.error };
						else next.cache = new Map(t.cache).set(rootPath, entries);
						return next;
					});
				}).catch((err) => {
					if (!cancelled) setTree((t) => t && t.rootPath === rootPath ? { ...t, loading: without(t.loading, rootPath), errors: { ...t.errors, [rootPath]: String((err && err.message) || err) } } : t);
				});
				return () => { cancelled = true };
			}, [rootPath]);

			react.useEffect(() => { treeRef.current = tree }, [tree]);

			// 自动刷新:每 3s 重新拉取根目录 + 各已展开目录(≤30),有变化合并进
			// 缓存并保留展开/选中状态;仅面板打开且开关开启时运行,页面隐藏时暂停
			react.useEffect(() => {
				if (!s.open || !tree || !tree.rootPath || !autoWatch) return;
				let disposed = false;
				let timer = null;
				const tick = async () => {
					if (disposed || pollBusyRef.current || document.hidden) return;
					const t = treeRef.current;
					if (!t || !t.rootPath) return;
					const dirs = [t.rootPath];
					for (const p of t.expanded) {
						if (p !== t.rootPath) dirs.push(p);
						if (dirs.length >= 30) break;
					}
					pollBusyRef.current = true;
					let changed = 0;
					for (const dir of dirs) {
						if (disposed) break;
						let res;
						try { res = await api.list(dir) } catch { continue }
						if (!res || res.error) continue;
						const ct = treeRef.current;
						if (!ct || !ct.cache.has(dir)) continue;
						const entries = res.entries || [];
						const fpNew = entries.map((e) => e.type + ':' + e.name).join('|');
						if (fpNew === (pollFpRef.current.get(dir) || '')) continue;
						pollFpRef.current.set(dir, fpNew);
						changed++;
						setTree((prev) => prev ? { ...prev, cache: new Map(prev.cache).set(dir, entries) } : prev);
					}
					pollBusyRef.current = false;
					if (changed > 0) showStatus({ ok: true, text: '检测到文件变化，已自动刷新' });
				};
				timer = setInterval(tick, 3000);
				return () => { disposed = true; pollBusyRef.current = false; if (timer !== null) clearInterval(timer) };
			}, [s.open, tree && tree.rootPath, autoWatch]);

			// markdown 预览注入后渲染其中的 mermaid 围栏。
			// 依赖必须含 reading:读取完成(content 就绪)时 reading 翻转为 false,
			// path/view 都不变,缺了它占位图永远不会触发渲染;
			// 含 mdParsed:查找导航会重建 html(mermaid 占位也随之重建)
			react.useEffect(() => {
				if (file && !file.reading && file.view === 'preview' && isMarkdown(file.name)) {
					renderMermaidBlocks(mdRef.current);
				}
			}, [file && file.path, file && file.view, file && file.reading, mdParsed]);

			react.useEffect(() => {
				const root = document.documentElement;
				if (s.open) root.setAttribute('data-cg-panel-open', '');
				else root.removeAttribute('data-cg-panel-open');
				return () => { root.removeAttribute('data-cg-panel-open') };
			}, [s.open]);
			react.useEffect(() => {
				const root = document.documentElement;
				// 内容避让量 = 面板实际显示宽度(只开树时只有树宽;
				// 打开文件时钳到 [视窗1/3 下限, 屏幕-90 上限])
				const showGuide = !!(file && file.guideOn);
				const eff = { ...s.pane, code: effCodeOf(s.pane, showGuide) };
				root.style.setProperty('--cg-width', panelWidthOf(eff, !!file) + 'px');
			}, [s.pane, file && file.path, file && file.guideOn, winTick]);
			// 窗口尺寸变化:驱动重渲染,让 1/3 下限与屏幕上限实时生效
			react.useEffect(() => {
				const onWin = () => setWinTick((t) => t + 1);
				window.addEventListener('resize', onWin);
				return () => window.removeEventListener('resize', onWin);
			}, []);
			react.useEffect(() => () => {
				if (flashTimerRef.current !== null) clearTimeout(flashTimerRef.current);
				if (itemFlashTimerRef.current !== null) clearTimeout(itemFlashTimerRef.current);
				itemFlashElRef.current = null;
				if (jumpLineTimerRef.current !== null) clearTimeout(jumpLineTimerRef.current);
				if (statusTimerRef.current !== null) clearTimeout(statusTimerRef.current);
			}, []);
			// 切换文件/内容/视图(预览↔源码)时:虚拟滚动范围必须按
			// "当前实际滚动位置"重算,不能盲目归零——切回保存了滚动位置的
			// 页签时视口停在中段,若范围算成顶部 0..80,中段只有占位 spacer,
			// 表现为"空白,滚一下才出字"。useLayoutEffect 在绘制前同步重算,
			// 不闪空白帧(滚动恢复的 layout effect 声明在前,先执行)
			react.useLayoutEffect(() => {
				const pane = codePaneRef.current;
				seedVrange(pane ? pane.scrollTop : 0);
			}, [file && file.path, file && file.content, file && file.view]);
			react.useEffect(() => { mdActiveIdRef.current = null; setMdActiveId(null) }, [file && file.path]);
			// Ctrl+F:源码视图接管为"文件内查找"(md 预览仍走浏览器默认行为)
			react.useEffect(() => {
				const onKey = (e) => {
					if (!s.open || !file) return;
					if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F') && !e.shiftKey) {
						// 代码视图与 md 预览接管 Ctrl+F;图片/PDF/整图预览不接管
						if ((file.view !== 'preview' || isMarkdown(file.name)) && !file.reading && !file.error && !file.tooLarge && !file.binary) {
							e.preventDefault();
							openFind();
						}
					}
				};
				window.addEventListener('keydown', onKey);
				return () => window.removeEventListener('keydown', onKey);
			}, [s.open, file]);
			react.useEffect(() => {
				const onKey = (e) => {
					if (!s.open) return;
					if (!e.altKey || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
					const arr = jumpHistoryRef.current;
					if (arr.length === 0) return;
					let idx = jumpIndexRef.current;
					if (e.key === 'ArrowLeft') idx = Math.max(0, idx - 1);
					else idx = Math.min(arr.length - 1, idx + 1);
					if (idx === jumpIndexRef.current) return;
					e.preventDefault();
					const entry = arr[idx];
					const pane = codePaneRef.current;
					if (pane && entry.scrollTop !== null) {
						seedVrange(entry.scrollTop);
						jumpPendingRef.current = { top: entry.scrollTop, onArrive: () => flashJumpLine(entry.line) };
						setJumpTick((t) => t + 1);
					} else {
						jumpToLine(entry.line, () => flashJumpLine(entry.line));
					}
					jumpIndexRef.current = idx;
					lastFocusRef.current = entry.line;
				};
				window.addEventListener('keydown', onKey, true);
				return () => window.removeEventListener('keydown', onKey, true);
			}, [s.open]);

			const loadChildren = (path) => {
				api.list(path).then((res) => {
					const entries = (res && res.entries) || [];
					if (res && !res.error) pollFpRef.current.set(path, entries.map((e) => e.type + ':' + e.name).join('|'));
					setTree((t) => {
						if (!t) return t;
						const cache = new Map(t.cache);
						const errors = { ...t.errors };
						if (res && !res.error) cache.set(path, entries);
						else errors[path] = (res && res.error) || 'list failed';
						return { ...t, cache, errors, loading: without(t.loading, path) };
					});
				}).catch((err) => {
					setTree((t) => t ? { ...t, loading: without(t.loading, path), errors: { ...t.errors, [path]: String((err && err.message) || err) } } : t);
				});
			};

			const toggleDir = (path) => {
				setTree((t) => {
					if (!t) return t;
					if (t.expanded.has(path)) return { ...t, expanded: without(t.expanded, path) };
					if (t.cache.has(path)) return { ...t, expanded: withVal(t.expanded, path) };
					return { ...t, expanded: withVal(t.expanded, path), loading: withVal(t.loading, path) };
				});
				setTree((t) => {
					if (!t || t.cache.has(path) || !t.expanded.has(path)) return t;
					loadChildren(path);
					return t;
				});
			};

			// 解读结果的字段集:applyExplainResult 与补全成功共用
			const explainFields = (res) => ({
				functions: res.functions || [], callGraph: res.callGraph || '',
				model: res.model || '', warnings: res.warnings || [],
				failedGroups: res.failedGroups || [], chunks: res.chunks || 0,
			});
			const applyExplainResult = (path, res) => {
				patchTab(path, (f) => {
					if (!f) return f;
					if (res && res.error) return { ...f, explaining: false, retrying: false, explainError: res.error };
					if (res && res.binary) return { ...f, explaining: false, retrying: false, explainError: '二进制文件，无法解读' };
					return { ...f, explaining: false, retrying: false, ...explainFields(res) };
				});
			};
			const failExplain = (path, err) => {
				patchTab(path, (f) => f ? { ...f, explaining: false, explainError: String((err && err.message) || err) } : f);
			};

			const pruneTabs = (next) => {
				const pruned = tm.pruneTabs(next);
				if (pruned.length < next.length) {
					const removed = next.find((t) => !pruned.includes(t));
					if (removed) showStatus({ ok: false, text: '页签已满，已关闭最久未用的「' + removed.name + '」' });
				}
				return pruned;
			};
			const applyReadResult = (path, res) => {
				patchTab(path, (f) => {
					if (!f) return f;
					if (res && res.error) return { ...f, reading: false, error: res.error };
					if (res && res.tooLarge) return { ...f, reading: false, tooLarge: true, size: res.size };
					if (res && res.binary) return { ...f, reading: false, binary: true, size: res.size };
					return { ...f, reading: false, content: res.content, size: res.size };
				});
			};
			const readInto = (entry) => {
				if (isImageFile(entry.name) || isPdfFile(entry.name)) {
					patchTab(entry.path, (f) => f ? { ...f, reading: false } : f);
					return;
				}
				api.read(entry.path, rootPath)
					.then((res) => applyReadResult(entry.path, res))
					.catch((err) => {
						patchTab(entry.path, (f) => f ? { ...f, reading: false, error: String((err && err.message) || err) } : f);
					});
			};

			const openFile = (entry) => {
				setTree((t) => t ? { ...t, selected: entry.path } : t);
				const existing = tabsRef.current.find((t) => t.path === entry.path);
				if (existing) {
					switchTo(entry.path);
					return;
				}
				saveScroll();
				const pv = previewRef.current;
				const promoted = !!(pv && pv.path === entry.path && !pv.error && !pv.tooLarge);
				const tab = promoted
					? { ...pv, lastUsed: Date.now() }
					: { path: entry.path, name: entry.name, root: rootPath, reading: true, explaining: false, view: (isMarkdown(entry.name) || isMermaidFile(entry.name) || isImageFile(entry.name) || isPdfFile(entry.name)) ? 'preview' : 'code', lastUsed: Date.now() };
				if (promoted) {
					setPreviewFile(null);
					setPreviewActive(false);
				} else if (previewRef.current) {
					setPreviewActive(false);
				}
				resetFocusState();
				commitTabs(pruneTabs(tabsRef.current).concat([tab]));
				setActivePath(entry.path);
				if (!promoted) readInto(entry);
			};

			const previewEntry = (entry) => {
				setTree((t) => t ? { ...t, selected: entry.path } : t);
				const existing = tabsRef.current.find((t) => t.path === entry.path);
				if (existing) {
					switchTo(entry.path);
					return;
				}
				const pv = previewRef.current;
				if (pv && pv.path === entry.path && !pv.error && !pv.tooLarge) {
					switchToPreview();
					return;
				}
				saveScroll();
				resetFocusState();
				const next = { path: entry.path, name: entry.name, root: rootPath, reading: true, explaining: false, view: (isMarkdown(entry.name) || isMermaidFile(entry.name) || isImageFile(entry.name) || isPdfFile(entry.name)) ? 'preview' : 'code' };
				setPreviewFile(next);
				setPreviewActive(true);
				readInto(entry);
			};

			// 预览/源码视图切换(仅 md/.mmd 有意义)
			const toggleView = () => {
				patchActive((f) => f ? { ...f, view: f.view === 'preview' ? 'code' : 'preview' } : f);
			};
			// 手动刷新:重置整个树并重新拉取根目录
			const refresh = () => {
				if (!tree || !tree.rootPath) return;
				const root = tree.rootPath;
				const name = tree.rootName;
				setTree({ rootPath: root, rootName: name, expanded: new Set([root]), cache: new Map(), loading: new Set([root]), selected: null, errors: {} });
				loadChildren(root);
			};
			// 递归收集所有已加载目录
			const collectDirs = (t) => {
				const dirs = [];
				const walk = (dir) => {
					const children = t.cache.get(dir);
					if (!children) return;
					for (const e of children) {
						if (e.type === 'directory') { dirs.push(e.path); walk(e.path) }
					}
				};
				if (t.rootPath) walk(t.rootPath);
				return dirs;
			};
			const toggleAll = () => {
				if (!tree) return;
				// 展开进行中再点 = 折叠并取消展开
				if (expandBusy || tree.expanded.size > 1) collapseAll();
				else expandAll();
			};
			// 真正的递归展开:每个目录都真实加载,不是只标记;折叠可取消
			const expandAll = () => {
				if (!tree || !tree.rootPath || expandBusy) return;
				expandBusy = true;
				const token = ++expandToken;
				const visited = new Set();
				setTree((t) => {
					if (!t) return t;
					const dirs = collectDirs(t);
					const expanded = new Set(dirs);
					expanded.add(t.rootPath);
					const loading = new Set(t.loading);
					for (const d of dirs) loading.add(d);
					return { ...t, expanded, loading };
				});
				let loaded = 0;
				const work = async (dir) => {
					if (token !== expandToken || visited.has(dir) || loaded >= MAX_EXPAND_DIRS) return;
					visited.add(dir);
					loaded++;
					let entries = null;
					try {
						const res = await api.list(dir);
						entries = res && !res.error ? res.entries : null;
					} catch { entries = null }
					if (token !== expandToken) return;
					setTree((t) => {
						if (!t) return t;
						const cache = new Map(t.cache);
						const errors = { ...t.errors };
						if (entries) cache.set(dir, entries);
						else errors[dir] = 'load failed';
						const expanded = new Set(t.expanded);
						expanded.add(dir);
						const loading = new Set(t.loading);
						loading.delete(dir);
						return { ...t, cache, errors, expanded, loading };
					});
					if (entries) {
						const subs = [];
						for (const e of entries) if (e.type === 'directory') subs.push(e.path);
						await Promise.all(subs.map((p) => work(p)));
					}
				};
				work(tree.rootPath).then(() => {
					expandBusy = false;
					if (loaded >= MAX_EXPAND_DIRS) {
						showStatus({ ok: false, text: '目录较多，已展开前 ' + MAX_EXPAND_DIRS + ' 个目录' });
					}
				}).catch(() => { expandBusy = false });
			};
			const collapseAll = () => {
				expandToken++;
				expandBusy = false;
				setTree((t) => t ? { ...t, expanded: new Set([t.rootPath]) } : t);
			};

			// 「解读」按钮两种语义:解读框关闭 → 走 host 缓存(路径+mtime 命中
			// 秒回,文件变过自动走 LLM);已打开 → 强制重新解读。每次先重读源码
			// 保证行号一致,仅代码类文件提供该按钮
			const startExplain = (f) => {
				if (!f || f.reading || f.error || f.tooLarge || f.binary || !isExplainable(f.name)) return;
				if (f.explaining || f.retrying) {
					// 生成/补全进行中:只重新展开板块等结果,不重复请求
					patchTab(f.path, (t) => t ? { ...t, guideOn: true } : t);
					return;
				}
				const path = f.path;
				const force = !!f.guideOn; // 已打开再点 = 重新解读
				patchTab(path, (t) => t ? { ...t, guideOn: true, explaining: true, retrying: false, explainError: null, warnings: [], failedGroups: [] } : t);
				// 先刷新源码(外部可能改过),行号变化时清空跳转历史与高亮
				api.read(path, f.root || rootPath).then((res) => {
					if (!res || res.error || res.tooLarge) return;
					const cur = tabsRef.current.find((t) => t.path === path);
					patchTab(path, (t) => {
						if (!t || t.content === res.content) return t;
						return { ...t, content: res.content, size: res.size };
					});
					if (cur && cur.content !== res.content) resetFocusState();
				}).catch(() => { /* 读失败不阻塞解读 */ });
				api.explain(path, force, false, f.root || rootPath).then((res) => applyExplainResult(path, res)).catch((err) => failExplain(path, err));
			};
			// 「补全解读」:只重跑失败组,不走鲸鱼娘看板;已有解读保持可见,
			// 成功后按 id 原位补齐,成败都不弹提示——报错框就地反映结果
			const retryFailedGroups = () => {
				const f = file;
				if (!f || f.retrying || f.explaining) return;
				const path = f.path;
				patchTab(path, (t) => t ? { ...t, retrying: true } : t);
				api.explain(path, false, true, f.root || rootPath).then((res) => {
					if (res && res.error) {
						patchTab(path, (t) => t ? { ...t, retrying: false } : t); // host 出错:保持已有解读,静默
						return;
					}
					patchTab(path, (t) => t ? { ...t, retrying: false, ...explainFields(res) } : t);
				}).catch(() => {
					patchTab(path, (t) => t ? { ...t, retrying: false } : t); // 网络异常:静默,按钮恢复
				});
			};
			const runExplain = () => { if (file) startExplain(file) };
			const closeGuide = () => {
				patchActive((f) => f ? { ...f, guideOn: false } : f);
				setActive(null);
				setFlash(null);
				if (flashTimerRef.current !== null) { clearTimeout(flashTimerRef.current); flashTimerRef.current = null }
				requestAnimationFrame(() => {
					const pane = codePaneRef.current;
					if (pane) seedVrange(pane.scrollTop);
				});
			};
			const closeTab = (path) => {
				const idx = tabsRef.current.findIndex((t) => t.path === path);
				if (idx < 0) return;
				const next = tabsRef.current.filter((t) => t.path !== path);
				commitTabs(next);
				if (previewRef.current && previewActiveRef.current) {
					if (activePathRef.current === path) {
						const rest = next[idx] || next[idx - 1] || null;
						setActivePath(rest ? rest.path : null);
					}
					return;
				}
				if (activePathRef.current !== path) return;
				const fallback = next[idx] || next[idx - 1] || null;
				resetFocusState();
				if (fallback) {
					setActivePath(fallback.path);
				} else if (previewRef.current) {
					setPreviewActive(true);
					setActivePath(null);
				} else {
					setActivePath(null);
				}
			};

			const onLineClickRef = react.useRef(null);
			const lineFuncAt = (lineNo) => lineFuncIndex(file && file.functions, lineNo);

			const scrollAnims = new WeakMap();
			const animateScroll = (el, targetTop, onArrive, onFrame) => {
				const prev = scrollAnims.get(el);
				if (prev) prev.cancel();
				const startTop = el.scrollTop;
				const delta = targetTop - startTop;
				if (Math.abs(delta) < 1) { if (onArrive) onArrive(); return }
				if (onFrame) scrollAnimatingRef.current = true;
				const t0 = performance.now();
				const dur = Math.min(600, Math.max(220, Math.abs(delta) * 0.35));
				let raf = 0;
				let done = false;
				const stop = () => {
					if (done) return;
					done = true;
					if (onFrame) scrollAnimatingRef.current = false;
					cancelAnimationFrame(raf);
					el.removeEventListener('wheel', stop);
					el.removeEventListener('touchstart', stop);
					el.removeEventListener('pointerdown', stop);
					scrollAnims.delete(el);
				};
				const anim = { cancel: stop };
				scrollAnims.set(el, anim);
				const step = (now) => {
					if (done) return;
					const p = Math.min(1, (now - t0) / dur);
					const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
					const newTop = startTop + delta * eased;
					el.scrollTop = newTop;
					if (onFrame) onFrame(newTop);
					if (p < 1) { raf = requestAnimationFrame(step); return }
					stop();
					if (onArrive) onArrive();
				};
				el.addEventListener('wheel', stop, { passive: true });
				el.addEventListener('touchstart', stop, { passive: true });
				el.addEventListener('pointerdown', stop, { passive: true });
				raf = requestAnimationFrame(step);
			};

			const jumpRafRef = react.useRef(null);
			const jumpPendingRef = react.useRef(null);
			const [jumpTick, setJumpTick] = react.useState(0);

			react.useLayoutEffect(() => {
				const j = jumpPendingRef.current;
				if (!j) return;
				jumpPendingRef.current = null;
				const pane = codePaneRef.current;
				if (!pane) { if (j.onArrive) j.onArrive(); return }
				pane.scrollTop = j.top;
				const arr = jumpHistoryRef.current;
				const cur = arr[jumpIndexRef.current];
				if (cur && cur.scrollTop === null) cur.scrollTop = j.top;
				if (j.onArrive) j.onArrive();
			}, [jumpTick]);

			const jumpToLine = (start, onArrive, smooth) => {
				if (jumpRafRef.current !== null) {
					cancelAnimationFrame(jumpRafRef.current);
					jumpRafRef.current = null;
				}
				jumpPendingRef.current = null;
				const pane = codePaneRef.current;
				if (!pane) { if (onArrive) onArrive(); return }
				const top = Math.max(0, (start - 1) * LINE_H - Math.floor(pane.clientHeight * 0.2));
				if (!smooth) {
					seedVrange(top);
					jumpPendingRef.current = { top, onArrive };
					setJumpTick((t) => t + 1);
					return
				}
				const dist = Math.abs(top - pane.scrollTop);
				const viewH = pane.clientHeight;
				if (dist > viewH * 2) {
					animateScroll(pane, top, onArrive, seedVrange);
					return
				}
				animateScroll(pane, top, onArrive);
			};

			const flashJumpLine = (line) => {
				const seq = Date.now();
				setJumpLine({ line, seq });
				if (jumpLineTimerRef.current !== null) clearTimeout(jumpLineTimerRef.current);
				jumpLineTimerRef.current = setTimeout(() => {
					jumpLineTimerRef.current = null;
					setJumpLine((j) => (j && j.seq === seq ? null : j));
				}, 2000);
			};
			const currentLineOf = () => {
				const pane = codePaneRef.current;
				if (!pane) return 1;
				const el = pane.querySelector('.cg-line');
				const lineH = el ? (el.getBoundingClientRect().height || 21) : 21;
				return Math.max(1, Math.round(pane.scrollTop / lineH) + 1);
			};
			const jumpTargetOf = (fn) => jumpTargetLine(fn, file && file.content);
			const lineVisibleInPane = (lineNo) => {
				const pane = codePaneRef.current;
				if (!pane) return false;
				const topVis = Math.ceil(1 + pane.scrollTop / LINE_H);
				const bottomVis = Math.floor((pane.scrollTop + pane.clientHeight) / LINE_H);
				return lineNo >= topVis && lineNo <= bottomVis;
			};
			const navigateTo = (line, from, soft) => {
				const arr = jumpHistoryRef.current;
				const idx = jumpIndexRef.current;
				const pane = codePaneRef.current;
				const curScroll = pane ? pane.scrollTop : 0;
				const origin = from !== undefined && from !== null
					? from
					: (lastFocusRef.current !== null ? lastFocusRef.current : currentLineOf());
				arr.length = idx + 1;
				const last = arr[arr.length - 1];
				if (!last || last.line !== origin) arr.push({ line: origin, scrollTop: curScroll });
				arr.push({ line, scrollTop: null });
				jumpIndexRef.current = arr.length - 1;
				lastFocusRef.current = line;
				if (!(soft && lineVisibleInPane(line))) jumpToLine(line, () => flashJumpLine(line), !!soft);
				else flashJumpLine(line);
			};
			const jumpToDef = (name, fromLine) => {
				if (!file || !file.content) return;
				const fns = file.functions || [];
				const hit = fns.find((f) => f.name === name || String(f.name).split('.').pop() === name);
				if (hit) { navigateTo(jumpTargetOf(hit), fromLine); return }
				const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
				const defRe = new RegExp('(?:^|\\s)(?:def|class|fn)\\s+' + esc + '\\b|(?:^|\\s)func\\s+(?:\\([^)]*\\)\\s*)?' + esc + '\\b|(?:^|\\s)' + esc + '\\s*=|(?:^|\\s)(?:function|const|let|var)\\s+' + esc + '\\b');
				const lines = contentLines(file.content);
				for (let i = 0; i < lines.length; i++) {
					if (defRe.test(lines[i])) { navigateTo(i + 1, fromLine); return }
				}
			};
			const onCardClick = (i) => {
				setActive(i);
				if (file && file.functions && file.functions[i]) navigateTo(jumpTargetOf(file.functions[i]), undefined, true);
			};
			const onGuideClick = (e) => {
				const t = e.target;
				const varEl = t.closest('.cg-var');
				if (!varEl) return;
				const cardEl = t.closest('.cg-card');
				const idx = cardEl ? Number(cardEl.getAttribute('data-idx')) : NaN;
				if (!Number.isFinite(idx) || !file || !file.functions || !file.functions[idx]) return;
				const name = varEl.getAttribute('data-var') || '';
				if (!name) return;
				const fn = file.functions[idx];
				const lines = contentLines(file.content);
				const hitLine = findVarLineIn(name, fn.start, Math.max(fn.end, fn.start), lines);
				const seq = Date.now();
				setActive(idx);
				setFlash({ name, funcIndex: idx, seq });
				if (hitLine > 0) navigateTo(hitLine, undefined, true);
				if (flashTimerRef.current !== null) clearTimeout(flashTimerRef.current);
				flashTimerRef.current = setTimeout(() => {
					flashTimerRef.current = null;
					setFlash((f) => (f && f.seq === seq ? null : f));
				}, 2000);
			};

			// 按代码行标识符匹配解读项:行 token 与解读项反引号变量有交集即命中
			const matchStepByTokens = (lis, lineText) => {
				const tokens = lineText.match(/[A-Za-z_$][\w$]*/g) || [];
				if (tokens.length === 0) return null;
				for (const li of lis) {
					const vars = Array.from(li.querySelectorAll('.cg-var')).map((v) => (v.getAttribute('data-var') || ''));
					if (vars.some((v) => tokens.indexOf(v) >= 0)) return li;
				}
				return null;
			};

			// 点代码行 → 对应解读项闪烁 1 次(底色 2 秒):函数头区域 → 主解读区;
			// 行落在步骤范围内 → 对应步骤;空隙行按标识符匹配/位置比例就近,
			// 都不中 → 主解读区。无步骤数据(旧格式)走标识符匹配
			const flashGuideItem = (idx, lineNo) => {
				const guideEl = guideRef.current;
				const card = guideEl ? guideEl.querySelector('.cg-card[data-idx="' + idx + '"]') : null;
				if (!card) return false;
				const fn = file && file.functions ? file.functions[idx] : null;
				const main = card.querySelector('.cg-card-main');
				// 函数头区域(装饰器/签名/def 行)→ 主解读区闪烁
				const headerEnd = fn ? jumpTargetOf(fn) : 0;
				if (fn && lineNo >= fn.start && lineNo <= headerEnd) {
					flashItemEl(main);
					return true;
				}
				const lis = card.querySelectorAll('.cg-card-flow-md li');
				const steps = fn ? stepsOf(fn) : null;
				let el = null;
				if (steps && steps.length > 0 && lis.length > 0) {
					const codeLines = file && file.content ? contentLines(file.content) : null;
					const j = stepPartitionIndex(lineNo, headerEnd + 1, fn.end, steps, codeLines);
					if (j >= 0 && j < lis.length) el = lis[j];
				}
				if (!el) {
					const lines = file ? contentLines(file.content) : [];
					el = matchStepByTokens(lis, lines[lineNo - 1] || '');
					if (!el && lis.length > 0 && fn) {
						const ratio = (lineNo - fn.start) / Math.max(1, fn.end - fn.start + 1);
						el = lis[Math.min(lis.length - 1, Math.floor(ratio * lis.length))];
					}
					if (!el) el = main;
				}
				flashItemEl(el);
				return true;
			};

			const flashItemEl = (el) => {
				if (!el) return;
				if (itemFlashElRef.current) itemFlashElRef.current.classList.remove('cg-item-flash');
				itemFlashElRef.current = el;
				const applyFlash = () => {
					if (itemFlashElRef.current !== el) return;
					el.classList.remove('cg-item-flash');
					void el.offsetWidth;
					el.classList.add('cg-item-flash');
					if (itemFlashTimerRef.current !== null) clearTimeout(itemFlashTimerRef.current);
					itemFlashTimerRef.current = setTimeout(() => {
						itemFlashTimerRef.current = null;
						if (itemFlashElRef.current) { itemFlashElRef.current.classList.remove('cg-item-flash'); itemFlashElRef.current = null }
					}, 2000);
				};
				const guideEl = guideRef.current;
				let outOfView = false;
				if (guideEl) {
					const gRect = guideEl.getBoundingClientRect();
					const eRect = el.getBoundingClientRect();
					outOfView = eRect.top < gRect.top || eRect.bottom > gRect.bottom;
					if (outOfView) {
						const target = guideEl.scrollTop + (eRect.top - gRect.top) - Math.floor(gRect.height * 0.2);
						animateScroll(guideEl, target, applyFlash);
					}
				}
				if (!outOfView) applyFlash();
			};

			let charWidthCache = null;
			const charWidth = () => {
				if (charWidthCache === null) {
					const ctx = document.createElement('canvas').getContext('2d');
					let font = '14px ui-monospace, SFMono-Regular, Consolas, monospace';
					const pane = codePaneRef.current;
					if (pane && typeof window.getComputedStyle === 'function') {
						const cs = window.getComputedStyle(pane);
						if (cs && cs.font) font = cs.font;
					}
					ctx.font = font;
					charWidthCache = ctx.measureText('M').width || 8.4;
				}
				return charWidthCache;
			};
			react.useEffect(() => {
				const onWin = () => { charWidthCache = null };
				window.addEventListener('resize', onWin);
				return () => window.removeEventListener('resize', onWin);
			}, []);
			const gutterOf = (pane) => {
				const line = pane.querySelector('.cg-line');
				const text = line ? line.querySelector('.cg-code-text') : null;
				if (line && text) return text.getBoundingClientRect().left - line.getBoundingClientRect().left;
				return 63;
			};
			const wordAtCol = (text, col) => {
				const re = /[A-Za-z_$][\w$]*/g;
				let m;
				while ((m = re.exec(text)) !== null) {
					if (col >= m.index && col <= m.index + m[0].length) return m[0];
				}
				return null;
			};
			const onLineClick = (lineNo, e) => {
				lastFocusRef.current = lineNo;
				if (e && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
					const pane = codePaneRef.current;
					if (pane) {
						const rect = pane.getBoundingClientRect();
						const col = Math.floor((e.clientX - rect.left + pane.scrollLeft - gutterOf(pane)) / charWidth());
						const lines = file && file.content ? contentLines(file.content) : [];
						const word = col >= 0 && lines[lineNo - 1] !== undefined ? wordAtCol(lines[lineNo - 1], col) : null;
						if (word) { jumpToDef(word, lineNo); return }
					}
				}
				const i = lineFuncAt(lineNo);
				if (i !== null && file && file.guideOn) {
					// 仅当解读面板已打开时才联动:高亮代码区 + 闪烁对应解读卡片;
					// 面板收起时点代码行 = 纯脚本浏览(Ctrl+点击/Alt+←/→ 照常)
					setActive(i);
					setTab('guide');
					requestAnimationFrame(() => requestAnimationFrame(() => flashGuideItem(i, lineNo)));
				} else {
					setActive(null);
				}
			};
			onLineClickRef.current = onLineClick;

			// 分栏拖拽（逻辑已提取到 useDragResize hook）
			const fileRef = react.useRef(null);
			fileRef.current = file;
			const { drag, onResizeStart, onDividerStart, onResizeMove, endDrag } = useDragResize(fileRef);

			const renderTree = () => {
				if (!tree || !tree.rootPath) return react.createElement('div', { className: 'cg-empty' }, '未找到工作区');
				const rows = [];
				rows.push(react.createElement('div', {
					key: 'root',
					className: 'cg-trow',
					style: { paddingLeft: 4 },
					onClick: () => toggleDir(tree.rootPath),
					title: tree.rootPath,
				},
					react.createElement('span', { style: { display: 'flex', flex: 'none' } }, react.createElement(Icon, { name: tree.expanded.has(tree.rootPath) ? 'chevronDown' : 'chevronRight', size: 12 })),
					react.createElement('span', { className: 'cg-node-icon cg-trow-dir' }, react.createElement(Icon, { name: 'folder', size: 14 })),
					react.createElement('span', { className: 'cg-trow-name cg-trow-dir' }, tree.rootName || tree.rootPath),
					tree.loading.has(tree.rootPath) ? react.createElement('span', { style: { color: 'var(--dsw-alias-label-secondary)', fontSize: '11px' } }, '…') : null,
				));
				if (tree.expanded.has(tree.rootPath)) {
					const children = tree.cache.get(tree.rootPath);
					if (children) {
						for (const child of children) {
							rows.push(react.createElement(TreeNode, { key: child.path, entry: child, depth: 1, tree, onToggle: toggleDir, onOpen: openFile, onPreview: previewEntry }));
						}
					} else if (!tree.loading.has(tree.rootPath) && tree.errors[tree.rootPath]) {
						rows.push(react.createElement('div', { key: 'err', className: 'cg-trow-error', style: { paddingLeft: 16 } }, tree.errors[tree.rootPath]));
					}
				}
				return rows;
			};

			const renderSearch = () => {
				if (s.searching && !s.matches) return react.createElement('div', { className: 'cg-empty' }, '搜索中…');
				if (s.searchError) return react.createElement('div', { className: 'cg-trow-error' }, s.searchError);
				if (!s.matches || s.matches.length === 0) return react.createElement('div', { className: 'cg-empty' }, '没有匹配的文件');
				const rows = [];
				for (const m of s.matches) {
					const rel = m.path.slice(tree && tree.rootPath ? tree.rootPath.length : 0).replace(/^[\\/]+/, '');
					rows.push(react.createElement('div', {
						key: m.path,
						className: 'cg-trow' + (tree && tree.selected === m.path ? ' cg-trow-sel' : ''),
						style: { paddingLeft: 6 },
						onClick: (e) => m.type === 'directory' ? (setQuery(''), toggleDir(m.path)) : (e.detail >= 2 ? openFile(m) : previewEntry(m)),
						title: m.path + (m.type === 'directory' ? '' : '\n单击预览 · 双击打开'),
					},
						react.createElement('span', { className: 'cg-node-icon' + (m.type === 'directory' ? ' cg-trow-dir' : '') }, m.type === 'directory' ? react.createElement(Icon, { name: 'folder', size: 14 }) : react.createElement(FileTypeIcon, { entry: m, size: 14 })),
						react.createElement('span', { className: 'cg-trow-name' }, m.name),
						react.createElement('span', { className: 'cg-trow-rel' }, rel || '.'),
					));
				}
				if (s.truncated) rows.push(react.createElement('div', { key: 'trunc', className: 'cg-trow-error' }, '结果过多，已截断（前 300 条）'));
				return rows;
			};

			// md 预览内的锚点链接(#标题):容器内滚动到对应章节,
			// 阻止浏览器 hash 导航(避免 SPA 把锚点当会话跳转)
			const onMdPreviewClick = (e) => {
				const a = e.target.closest('a');
				if (!a) return;
				const href = a.getAttribute('href') || '';
				if (!href.startsWith('#')) return; // 外链(http/https)走默认行为
				e.preventDefault();
				const id = href.slice(1);
				if (!id) return;
				const container = mdRef.current;
				if (!container) return;
				const target = container.querySelector('[id="' + id.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"]');
				if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
			};

			const renderCode = () => {
				if (file.reading) return react.createElement('div', { className: 'cg-empty' }, '文件读取中…');
				if (file.error) return react.createElement('div', { className: 'cg-error' }, '文件读取失败：\n' + file.error);
				if (file.tooLarge) return react.createElement('div', { className: 'cg-empty' }, '文件过大（' + (file.size || 0) + ' 字节），暂不支持打开');
				if (file.binary) return react.createElement('div', { className: 'cg-empty' }, '二进制文件（' + (file.size || 0) + ' 字节），无法预览');
				// md/.mmd 预览态:GFM 渲染或整图渲染(带 mermaid 围栏);
				// md 滚动回调驱动目录高亮跟随;图片走 /raw 字节流内嵌预览
				if (file.view === 'preview') {
					if (isImageFile(file.name)) {
						return react.createElement(ImageView, { key: file.path, path: file.path, name: file.name, root: file.root });
					}
					if (isPdfFile(file.name)) {
						return react.createElement(PdfView, { key: file.path, path: file.path, name: file.name, root: file.root });
					}
					if (isMermaidFile(file.name)) {
						return react.createElement('div', { className: 'cg-md cg-mmd' },
							react.createElement(MermaidBlock, { key: file.path, code: file.content }));
					}
					if (isMarkdown(file.name)) {
						const parsed = mdParsed || { html: '', headings: [] };
						const html = parsed.html
							.replace(/\u0003/g, '<mark class="cg-find-hit">').replace(/\u0004/g, '</mark>')
							.replace(/\u0005/g, '<mark class="cg-find-cur">').replace(/\u0006/g, '</mark>');
						return react.createElement('div', { className: 'cg-md', ref: mdRef, onClick: onMdPreviewClick, onScroll: () => onMdScroll(parsed.headings), dangerouslySetInnerHTML: { __html: html } });
					}
				}
				// 重活已提升到面板层 useMemo(codeBuilt):renderCode 是普通函数,
				// 不能在函数体内条件调用 hooks(否则 React #310)
				const built = codeBuilt || { lineHtmls: [], truncated: false };
				// 虚拟滚动:只渲染可视行 + 上下缓冲,万行文件 DOM 规模恒定
				const renderable = Math.min(built.lineHtmls.length, MAX_LINES);
				const start = renderable > 0 ? Math.max(0, Math.min(vrange.start, renderable - 1)) : 0;
				const end = renderable > 0 ? Math.max(start + 1, Math.min(renderable, vrange.end)) : 0;
				const findCur = findState && findMatches.length > 0 ? findMatches[Math.min(Math.max(findState.current || 0, 0), findMatches.length - 1)] : null;
				const els = [];
				for (let i = start; i < end; i++) {
					const lineNo = i + 1;
					const fi = lineFuncAt(lineNo);
					let lineHtml = built.lineHtmls[i];
					if (findCur && findCur.line === lineNo) {
						let cnt = 0, idx = -1;
						while (cnt <= findCur.occ) {
							idx = lineHtml.indexOf('\u0003', idx + 1);
							if (idx < 0) break;
							cnt++;
						}
						if (idx >= 0) lineHtml = lineHtml.slice(0, idx) + '\u0005' + lineHtml.slice(idx + 1);
					}
					lineHtml = lineHtml
						.replace(/\u0003/g, '<mark class="cg-find-hit">').replace(/\u0004/g, '</mark>')
						.replace(/\u0005/g, '<mark class="cg-find-cur">').replace(/\u0006/g, '</mark>');
					els.push(react.createElement('div', {
						key: lineNo,
						'data-line': lineNo,
						className: 'cg-line' + (active !== null && fi === active ? ' cg-line-hi' : '') + (jumpLine && jumpLine.line === lineNo ? ' cg-line-jump' : ''),
					},
						react.createElement('span', { className: 'cg-ln' }, lineNo),
						react.createElement('span', { className: 'cg-code-text cg-hl', dangerouslySetInnerHTML: { __html: lineHtml } }),
					));
				}
				const onCodeClick = (e) => {
					const row = e.target.closest('.cg-line');
					if (!row) return;
					const ln = Number(row.getAttribute('data-line'));
					if (ln > 0) { const fn = onLineClickRef.current; if (fn) fn(ln, e) }
				};
				return react.createElement('div', { className: 'cg-code', ref: codePaneRef, onScroll: onCodeScroll, onClick: onCodeClick },
					start > 0 ? react.createElement('div', { style: { height: start * LINE_H + 'px', flex: 'none' } }) : null,
					els,
					end < renderable ? react.createElement('div', { style: { height: (renderable - end) * LINE_H + 'px', flex: 'none' } }) : null,
					built.truncated ? react.createElement('div', { className: 'cg-empty' }, '文件较长，仅显示前 ' + MAX_LINES + ' 行') : null,
				);
			};

			const renderGuide = () => {
				if (file.explaining) return react.createElement(GuideLoading);
				if (file.explainError) return react.createElement('div', { className: 'cg-error' }, '解读失败：\n' + file.explainError + '\n\n可点击右上角「重新解读」重试');
				if (file.error || file.tooLarge) return null;
				const fns = file.functions || [];
				// 失败组(failedGroups)与提示(warnings)分开展示
				const failedGroups = file.failedGroups || [];
				const firstGroupText = failedGroups.length > 0 ? failedGroups[0].text : '';
				const infoWarnings = file.warnings || [];
				// 报错框:文本在左,「补全解读」按钮在最右;补全中按钮原位变三点
				const warnBox = () => {
					if (failedGroups.length === 0 && infoWarnings.length === 0) return null;
					const btn = failedGroups.length > 0
						? (file.retrying
							? react.createElement('span', { className: 'cg-loading-dots cg-retry-dots', title: '正在补全…' },
								react.createElement('i'), react.createElement('i'), react.createElement('i'))
							: react.createElement('button', { className: 'cg-btn cg-retry-btn', onClick: retryFailedGroups }, '补全解读'))
						: null;
					const head = failedGroups.length > 0 ? '⚠ ' + failedGroups.length + ' 组函数解读失败' + (firstGroupText ? '\n' + firstGroupText : '') : '';
					const info = infoWarnings.length > 0 ? (head ? '\n' : '') + infoWarnings.join('\n') : '';
					return react.createElement('div', { className: 'cg-error cg-warnbox', style: { padding: '6px 4px 6px 10px' } },
						react.createElement('div', { className: 'cg-warn-text' }, head + info),
						btn,
					);
				};
				if (fns.length === 0) {
					return react.createElement('div', null,
						warnBox(),
						react.createElement('div', { className: 'cg-empty' }, '没有识别到函数。若这是代码文件，点右上角「重新解读」重试'),
					);
				}
				return react.createElement('div', { className: 'cg-guide', ref: guideRef, onClick: onGuideClick },
					warnBox(),
					fns.map((f, i) => {
						const steps = stepsOf(f);
						const legacyHtml = !steps && f.flow ? renderFlowMd(f.flow) : '';
						const flowBroken = !steps && !!f.flow && (!legacyHtml || legacyHtml.includes('[object Object]'));
						return react.createElement('div', {
							key: f.id || i,
							className: 'cg-card' + (active === i ? ' cg-card-on' : ''),
							'data-idx': i,
						},
							// 主解读区 = 函数名 + 摘要:唯一可点击跳转代码的区域
							react.createElement('div', { className: 'cg-card-main', onClick: () => onCardClick(i) },
								react.createElement('div', { className: 'cg-card-head' },
									react.createElement('span', { className: 'cg-card-name' }, f.name),
									react.createElement('span', { className: 'cg-card-lines' }, f.end > f.start ? 'L' + f.start + ' – L' + f.end : 'L' + f.start),
								),
								react.createElement('div', { className: 'cg-card-summary' }, f.summary),
							),
							steps || f.flow ? react.createElement('div', { className: 'cg-card-label' }, '执行流程') : null,
							steps
								? react.createElement('div', { className: 'cg-card-flow-md' },
									react.createElement('ol', null,
										steps.map((st, si) => react.createElement('li', {
											key: si,
											'data-start': st.start,
											'data-end': st.end,
											dangerouslySetInnerHTML: { __html: mdInline(st.text) },
										})),
									),
								)
								: (f.flow ? react.createElement('div', { className: 'cg-card-flow-md', dangerouslySetInnerHTML: { __html: legacyHtml } }) : null),
							flowBroken ? react.createElement('div', { className: 'cg-error', style: { padding: '2px 0 4px', fontSize: '11px' } }, '流程数据格式异常，点右上角「重新解读」更新') : null,
							f.formula ? react.createElement('div', { className: 'cg-card-label' }, '关键公式') : null,
							f.formula ? react.createElement('div', { className: 'cg-card-formula' }, f.formula) : null,
						);
					}),
				);
			};

			// 调用图节点点击:直接定位到对应代码行并高亮(当前文件内)
			const onGraphNodeClick = (rawLabel) => {
				if (!file || !file.functions) return;
				const compact = (s) => String(s || '').replace(/\s+/g, '');
				// 节点名可能被 HTML 实体转义(< > & #):解码后与函数名比对
				const decoded = String(rawLabel || '')
					.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&#35;/g, '#');
				const needle = compact(decoded);
				let i = file.functions.findIndex((f) => compact(f.name) === needle);
				if (i < 0) {
					i = file.functions.findIndex((f) => compact(f.name) === compact(rawLabel));
				}
				if (i < 0) return;
				setActive(i);
				navigateTo(jumpTargetOf(file.functions[i]));
			};

			const renderCallGraph = () => {
				if (file.explaining) return react.createElement(GuideLoading);
				if (!file.callGraph) return react.createElement('div', { className: 'cg-empty' }, '该文件没有生成调用图');
				// key=文件路径:切页签时调用图视图(缩放/平移)随文件重置
				return react.createElement(GraphView, { key: file.path, filePath: file.path, code: file.callGraph, onNodeClick: onGraphNodeClick });
			};

			if (!s.open) return null;
			const collapseTab = react.createElement('button', {
				className: 'cg-collapse-tab',
				title: '收起文件',
				'aria-label': '收起文件',
				onClick: () => setOpen(false),
			}, react.createElement(Icon, { name: 'chevronRight', size: 14 }));
			const showGuide = !!(file && file.guideOn);
			// 面板宽只随 树/文件 变化;解读开关只在源码区内重新划分,面板不动。
			// 打开文件时源码区有效宽钳到 [视窗1/3 下限, 屏幕-90 上限]
			const effPane = { ...s.pane, code: effCodeOf(s.pane, showGuide) };
			const panelW = panelWidthOf(effPane, !!file);
			const panel = react.createElement('div', { className: 'cg-panel', style: { width: panelW + 'px' } },
				react.createElement('div', { className: 'cg-resize', title: '调整宽度', onPointerDown: onResizeStart }),
				collapseTab,
				react.createElement('div', { className: 'cg-header' },
					react.createElement('span', { className: 'cg-title' }, '文件'),
					react.createElement('button', { className: 'cg-iconbtn', title: '全部展开 / 全部折叠', onClick: toggleAll }, react.createElement(Icon, { name: 'chevronDown', size: 14 })),
					react.createElement('button', { className: 'cg-iconbtn', title: '刷新', onClick: refresh }, react.createElement(Icon, { name: 'refresh', size: 14 })),
					react.createElement('button', {
						className: 'cg-iconbtn' + (autoWatch ? ' cg-iconbtn-on' : ''),
						title: autoWatch ? '自动刷新：开' : '自动刷新：关',
						onClick: () => setAutoWatch((v) => !v),
					}, react.createElement(Icon, { name: autoWatch ? 'eye' : 'eyeOff', size: 14 })),
					react.createElement('button', { className: 'cg-iconbtn', title: '关闭', onClick: () => setOpen(false) }, react.createElement(Icon, { name: 'close', size: 14 })),
				),
				react.createElement('div', { className: 'cg-body' },
					file ? react.createElement('div', { className: 'cg-main' },
						react.createElement('div', { className: 'cg-split' },
							// 源码窗在左;解读打开时源码让出一块给解读,关闭时源码向右扩展收回
							react.createElement('div', { className: 'cg-code-pane', style: { width: sourceWidthOf(s.pane, showGuide) + 'px' } },
								(tabs.length > 0 || !!previewFile) ? react.createElement('div', { className: 'cg-tabsbar' },
									tabs.map((t) => react.createElement('div', {
										key: t.path,
										className: 'cg-filetab' + (file && t.path === file.path ? ' cg-filetab-on' : ''),
										title: t.path,
										onClick: () => { if (!file || t.path !== file.path) switchTo(t.path) },
									},
										react.createElement(FileTypeIcon, { entry: t, size: 12 }),
										react.createElement('span', { className: 'cg-filetab-name' }, t.name),
										t.explaining ? react.createElement('span', { className: 'cg-filetab-dot', title: '解读生成中' }, '…') : null,
										react.createElement('button', {
											className: 'cg-filetab-x',
											title: '关闭',
											onClick: (e) => { e.stopPropagation(); closeTab(t.path) },
										}, react.createElement(Icon, { name: 'close', size: 10 })),
									)),
									previewFile ? react.createElement('div', {
										key: '__preview__',
										className: 'cg-filetab cg-filetab-preview' + (previewFile === file ? ' cg-filetab-on' : ''),
										title: previewFile.path + '\n预览中 · 单击激活 · 双击固定打开',
										onClick: () => switchToPreview(),
										onDoubleClick: () => openFile({ path: previewFile.path, name: previewFile.name, type: 'file' }),
									},
										react.createElement(FileTypeIcon, { entry: previewFile, size: 12 }),
										react.createElement('span', { className: 'cg-filetab-name' }, previewFile.name),
										previewFile.explaining ? react.createElement('span', { className: 'cg-filetab-dot', title: '解读生成中' }, '…') : null,
										react.createElement('button', {
											className: 'cg-filetab-x',
											title: '关闭预览',
											onClick: (e) => { e.stopPropagation(); closePreview() },
										}, react.createElement(Icon, { name: 'close', size: 10 })),
									) : null,
								) : null,
								react.createElement('div', { className: 'cg-pane-head' },
									react.createElement('span', { className: 'cg-pane-title' }, file.view === 'preview' ? '预览' : '源码'),
									react.createElement('span', { className: 'cg-pane-path' }, file.path),
									file && !file.reading && !file.error && !file.tooLarge && (isMarkdown(file.name) || isMermaidFile(file.name))
										? react.createElement('button', { className: 'cg-btn', onClick: toggleView }, file.view === 'preview' ? '源码' : (isMermaidFile(file.name) ? '图表' : '预览'))
										: null,
									file && !file.reading && !file.error && !file.tooLarge && isMarkdown(file.name) && file.view === 'preview'
										? react.createElement('button', {
											className: 'cg-btn' + (tocOpen ? ' cg-btn-on' : ''),
											title: '目录',
											onClick: () => setTocOpen((v) => !v),
										}, '目录')
										: null,
									file && !file.reading && !file.error && !file.tooLarge && isExplainable(file.name)
										? react.createElement('button', { className: 'cg-btn', title: file.guideOn ? '重新解读' : '解读', onClick: runExplain }, file.guideOn ? '重新解读' : '解读')
										: null,
								),
								findState && findState.open && !file.reading && !file.error && !file.tooLarge && !file.binary && (file.view !== 'preview' || isMarkdown(file.name))
									? react.createElement(FindBar, {
										query: findState.query || '',
										caseSensitive: !!findState.caseSensitive,
										current: findState.current || 0,
										total: findMatches.length,
										onQuery: updateFindQuery,
										onNav: findNav,
										onToggleCase: toggleFindCase,
										onClose: closeFind,
									})
									: null,
								renderCode(),
								tocOpen && isMarkdown(file.name) && file.view === 'preview' ? react.createElement(TocOverlay, {
									title: '目录',
									emptyText: '本文档没有标题',
									items: tocItems,
									activeId: mdActiveId,
									onPick: onTocPick,
								}) : null,
							),
							showGuide ? react.createElement('div', { className: 'cg-divider' + (drag && drag.kind === 'code' ? ' cg-divider-on' : ''), title: '调整宽度', onPointerDown: onDividerStart('code') }) : null,
							showGuide ? react.createElement('div', { className: 'cg-guide-pane', style: { width: Math.max(PANE_MIN_PX, Math.min(s.pane.guide, effCodeOf(s.pane, true) - PANE_DIV_W - PANE_MIN_PX)) + 'px' } },
								react.createElement('div', { className: 'cg-tabs' },
									react.createElement('button', { className: 'cg-tab' + (tab === 'guide' ? ' cg-tab-on' : ''), onClick: () => setTab('guide') }, '函数解读'),
									react.createElement('button', { className: 'cg-tab' + (tab === 'graph' ? ' cg-tab-on' : ''), onClick: () => setTab('graph') }, '调用图'),
									react.createElement('button', { className: 'cg-iconbtn cg-tab-close', title: '关闭解读', onClick: closeGuide }, react.createElement(Icon, { name: 'close', size: 13 })),
								),
								tab === 'guide' ? renderGuide() : renderCallGraph(),
							) : null,
						),
						react.createElement('div', { className: 'cg-meta' },
							file.error || file.tooLarge ? '就绪'
								: file.explaining ? '解读生成中…'
									: !file.guideOn ? (isExplainable(file.name) ? '文件已加载 · 点「解读」开始解读' : '文件已加载')
										: (file.model ? '模型 ' + file.model + ' · ' : '') + (file.functions || []).length + ' 个函数' + (file.chunks && file.chunks > 1 ? ' · 分 ' + file.chunks + ' 组解读' : ''),
						),
					) : null,
					file ? react.createElement('div', { className: 'cg-divider' + (drag && drag.kind === 'tree' ? ' cg-divider-on' : ''), title: '调整宽度', onPointerDown: onDividerStart('tree') }) : null,
					// 文件树常驻最右;未打开文件时是唯一视窗,面板即树宽
					react.createElement('div', { className: 'cg-tree', style: { width: s.pane.tree + 'px' } },
						react.createElement('div', { className: 'cg-searchbar' },
							react.createElement('input', { className: 'cg-search', type: 'text', placeholder: '搜索文件', value: s.query, spellCheck: false, onChange: (e) => setQuery(e.target.value) }),
							s.searching ? react.createElement('span', { className: 'cg-search-state' }, '…') : null,
						),
						status ? react.createElement('div', { className: 'cg-status ' + (status.ok ? 'cg-status-ok' : 'cg-status-err'), style: { padding: '2px 10px', flex: 'none' } }, status.text) : null,
						react.createElement('div', { className: 'cg-tree-scroll' }, s.query.trim() ? renderSearch() : renderTree()),
					),
				),
			);
			return react.createElement('div', { className: 'cg-overlay-root' },
				drag ? react.createElement('div', { className: 'cg-drag-capture', onPointerMove: onResizeMove, onPointerUp: endDrag, onPointerLeave: endDrag }) : null,
				panel,
			);
		};

		function apply(ctx) {
			const styleEl = document.createElement('style');
			styleEl.textContent = CSS;
			document.head.appendChild(styleEl);
			ctx.effect(() => () => { styleEl.remove() }, 'dsh-files: styles');

			// 双击对话区收起面板(排除输入控件与可交互元素)
			const onChatDblClick = (e) => {
				if (!store.open) return;
				const target = e.target;
				if (!target || typeof target.closest !== 'function') return;
				if (target.closest('input, textarea, select, button, a, [contenteditable="true"], [role="button"]')) return;
				const root = target.closest('[data-phase]');
				if (!root) return;
				const phase = root.getAttribute('data-phase');
				if (phase !== 'active' && phase !== 'hero') return;
				setOpen(false);
			};
			document.addEventListener('dblclick', onChatDblClick);
			ctx.effect(() => () => { document.removeEventListener('dblclick', onChatDblClick) }, 'dsh-files: chat dblclick collapse');

			const slots = ctx.get('slots');
			if (slots === undefined) return;
			const slotDisposers = [
				slots.inject('shell.overlay', () => slots.register(
					{ name: 'shell.overlay', id: 'dsh-files', order: 100, label: '文件' },
					(props) => react.createElement(GuidePanel, props),
				)),
				slots.inject('conversation.session.header.utilities', () => slots.register(
					{ name: 'conversation.session.header.utilities', id: 'dsh-files-toggle', order: 20, label: '文件' },
					(props) => react.createElement(ToggleButton, props),
				)),
			].filter((d) => typeof d === 'function');
			ctx.effect(() => () => { for (const d of slotDisposers) d() }, 'dsh-files: slots');
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
