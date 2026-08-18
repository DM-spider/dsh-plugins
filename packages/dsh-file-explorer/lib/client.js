window.__ModuleLoader__.load({
	id: "dsh-file-explorer",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		var react = require("react");

		// ---------- styles ----------
		const CSS = `
html {
  --fe-panel-width: 340px;
  --fe-preview-width: 0px;
  --fe-panel-shift: calc(var(--fe-panel-width) + var(--fe-preview-width) + 12px);
}
html[data-fe-panel-open] [data-phase=active] {
  box-sizing: border-box;
  padding-right: var(--fe-panel-shift);
}
[data-phase=active] {
  will-change: padding-right;
  transition: padding-right .36s cubic-bezier(.22,1,.36,1);
}
.fe-panel {
  position: fixed; top: 0; right: 0; bottom: 0; z-index: 100;
  display: flex; flex-direction: column;
  background: var(--dsw-alias-bg-overlay);
  border-left: 1px solid var(--dsw-alias-border-l1);
  box-shadow: -4px 0 16px rgba(0,0,0,.12);
  color: var(--dsw-alias-label-primary);
  font-size: 13px; line-height: 1.45;
  max-width: 78vw; min-width: 220px;
  pointer-events: auto;
  box-sizing: border-box;
}
.fe-panel * { box-sizing: border-box; }
.fe-resize {
  position: absolute; left: -4px; top: 0; bottom: 0; width: 8px;
  cursor: col-resize; z-index: 5;
}
.fe-resize:hover { background: var(--dsw-alias-brand-primary); opacity: .35; }
.fe-collapse-tab {
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
.fe-collapse-tab:hover { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-brand-primary); }
.fe-collapse-tab:active { color: var(--dsw-alias-brand-primary); }
.fe-drag-capture {
  position: fixed; inset: 0; z-index: 9999; cursor: col-resize;
  background: transparent;
}
.fe-header {
  display: flex; align-items: center; gap: 2px;
  padding: 7px 8px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  flex: none;
}
.fe-title { font-weight: 600; flex: 1; padding: 0 4px; }
.fe-iconbtn {
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; padding: 0;
  border: none; border-radius: 5px;
  background: transparent; color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}
.fe-iconbtn:hover { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); }
.fe-iconbtn-on { color: var(--dsw-alias-brand-primary); }
.fe-icon-vscode { color: #007acc; }
.fe-icon-vscode:hover { color: #007acc; background: var(--dsw-alias-bg-layer-2); }
.fe-searchbar { position: relative; padding: 6px 8px 4px; flex: none; }
.fe-search {
  width: 100%; padding: 5px 22px 5px 8px;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 5px;
  color: var(--dsw-alias-label-primary); font-size: 12px; outline: none;
}
.fe-search:focus { border-color: var(--dsw-alias-brand-primary); }
.fe-search::placeholder { color: var(--dsw-alias-label-secondary); }
.fe-search-state {
  position: absolute; right: 16px; top: 10px;
  color: var(--dsw-alias-label-secondary); font-size: 11px;
}
.fe-status { padding: 4px 10px; font-size: 11px; flex: none; }
.fe-status-ok { color: var(--dsw-alias-state-success-primary); }
.fe-status-err { color: var(--dsw-alias-state-error-primary); }
.fe-tree { flex: 1; overflow: auto; padding: 2px 0 8px; user-select: none; }
.fe-row {
  display: flex; align-items: center; gap: 4px;
  padding: 2px 8px; margin: 0 4px;
  border-radius: 5px; cursor: pointer; white-space: nowrap;
}
.fe-row:hover { background: var(--dsw-alias-bg-layer-1); }
.fe-row-selected { background: var(--dsw-alias-bg-layer-2); }
.fe-row-selected .fe-node-name { color: var(--dsw-alias-label-primary); }
.fe-chevron {
  width: 14px; height: 14px; flex: none;
  display: flex; align-items: center; justify-content: center;
  color: var(--dsw-alias-label-secondary);
}
.fe-chevron-none { visibility: hidden; }
.fe-node-icon { display: flex; flex: none; }
.fe-node-dir { color: var(--dsw-alias-brand-primary); }
.fe-node-file { color: var(--dsw-alias-label-secondary); }
.fe-node-name { overflow: hidden; text-overflow: ellipsis; }
.fe-node-size, .fe-node-rel {
  margin-left: auto; padding-left: 8px; flex: none;
  color: var(--dsw-alias-label-secondary); font-size: 11px;
}
.fe-node-rel { max-width: 45%; overflow: hidden; text-overflow: ellipsis; }
.fe-node-loading { color: var(--dsw-alias-label-secondary); font-size: 11px; }
.fe-node-error { color: var(--dsw-alias-state-error-primary); font-size: 12px; padding: 4px 8px; }
.fe-empty { color: var(--dsw-alias-label-secondary); padding: 14px 10px; font-size: 12px; }
.fe-preview {
  position: fixed; top: 0; bottom: 0; z-index: 99;
  display: flex; flex-direction: column;
  background: var(--dsw-alias-bg-overlay);
  border-right: 1px solid var(--dsw-alias-border-l1);
  box-shadow: -4px 0 16px rgba(0,0,0,.12);
  color: var(--dsw-alias-label-primary);
  font-size: 13px; line-height: 1.45;
  min-width: 180px;
  pointer-events: auto;
  box-sizing: border-box;
}
.fe-preview * { box-sizing: border-box; }
.fe-preview-resize {
  position: absolute; left: -4px; top: 0; bottom: 0; width: 8px;
  cursor: col-resize; z-index: 5;
}
.fe-preview-resize:hover { background: var(--dsw-alias-brand-primary); opacity: .35; }
.fe-preview-body { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.fe-preview-plain {
  flex: 1; overflow: auto; margin: 0;
  padding: 8px 10px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font-family: ui-monospace, SFMono-Regular, Consolas, 'Courier New', monospace;
  font-size: 12px; line-height: 1.5;
  white-space: pre-wrap; word-break: break-word;
}
.fe-editor-head {
  display: flex; align-items: center; gap: 6px;
  padding: 5px 8px; flex: none;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-secondary); font-size: 12px;
}
.fe-editor-name { font-weight: 600; color: var(--dsw-alias-label-primary); flex: none; }
.fe-editor-path { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; }
.fe-btn {
  padding: 2px 9px; flex: none;
  border: 1px solid var(--dsw-alias-border-l2); border-radius: 5px;
  background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary);
  font-size: 12px; cursor: pointer;
}
.fe-btn:hover { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); }
.fe-editor-textarea {
  flex: 1; width: 100%; resize: none;
  padding: 8px; border: none; outline: none;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font-family: ui-monospace, SFMono-Regular, Consolas, 'Courier New', monospace;
  font-size: 12px; line-height: 1.5; white-space: pre;
}
.fe-editor-msg { padding: 10px 12px; font-size: 12px; color: var(--dsw-alias-label-secondary); }
.fe-editor-msg.fe-err { color: var(--dsw-alias-state-error-primary); }
.fe-md {
  flex: 1; overflow: auto; padding: 10px 14px;
  font-size: 13px; line-height: 1.6; word-break: break-word;
}
.fe-md h1 { font-size: 20px; margin: 10px 0 6px; }
.fe-md h2 { font-size: 17px; margin: 10px 0 6px; }
.fe-md h3 { font-size: 15px; margin: 8px 0 4px; }
.fe-md h4, .fe-md h5, .fe-md h6 { font-size: 13px; margin: 8px 0 4px; }
.fe-md p { margin: 6px 0; }
.fe-md ul, .fe-md ol { margin: 6px 0; padding-left: 22px; }
.fe-md li { margin: 2px 0; }
.fe-md strong { font-weight: 700; }
.fe-md em { font-style: italic; }
.fe-md del { text-decoration: line-through; }
.fe-md code {
  background: var(--dsw-alias-bg-layer-2); border-radius: 3px; padding: 1px 4px;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 12px;
}
.fe-md pre {
  background: var(--dsw-alias-bg-layer-2); border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 6px; padding: 8px 10px; overflow: auto; margin: 8px 0;
}
.fe-md pre code { background: none; padding: 0; }
.fe-md a { color: var(--dsw-alias-brand-primary); }
.fe-md blockquote {
  border-left: 3px solid var(--dsw-alias-border-l2);
  margin: 6px 0; padding: 2px 10px;
  color: var(--dsw-alias-label-secondary);
}
.fe-md hr { border: none; border-top: 1px solid var(--dsw-alias-border-l1); margin: 10px 0; }
.fe-md table { border-collapse: collapse; margin: 8px 0; width: 100%; font-size: 12.5px; }
.fe-md th, .fe-md td { border: 1px solid var(--dsw-alias-border-l1); padding: 4px 8px; text-align: left; }
.fe-md th { background: var(--dsw-alias-bg-layer-2); font-weight: 600; }
.fe-md table code { font-size: 11.5px; }
.fe-md input[type=checkbox] { vertical-align: -2px; margin-right: 6px; }
.fe-md img { max-width: 100%; border-radius: 4px; }
/* mermaid diagrams in markdown preview / .mmd files */
.fe-mermaid {
  margin: 10px 0; padding: 8px;
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px;
  overflow: auto;
}
.fe-mermaid svg { max-width: 100%; height: auto; display: block; margin: 0 auto; }
.fe-mermaid-pending { color: var(--dsw-alias-label-secondary); font-size: 12px; padding: 6px 4px; }
.fe-mermaid-error { color: var(--dsw-alias-state-error-primary); font-size: 12px; margin-bottom: 6px; }
.fe-mermaid-src {
  margin: 0; padding: 8px 10px;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 6px;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 12px; overflow: auto; white-space: pre-wrap;
}
.fe-mmd .fe-mermaid { margin: 0; }
.fe-toggle {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; padding: 0;
  border: 1px solid var(--dsw-alias-border-l2); border-radius: 18px;
  background: transparent; color: var(--dsw-alias-label-primary);
  cursor: pointer; flex: none;
}
.fe-toggle:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.fe-toggle svg { flex: none; }
.fe-toggle-on { color: var(--dsw-alias-brand-primary); }
/* 隐藏会话下载按钮（Session Log 下载胶囊） */
.nL4_yW_sessionLogButton { display: none !important; }
.fe-hl { tab-size: 4; }
.fe-hl .fe-tok-c { color: var(--fe-hl-comment, #7f848e); font-style: italic; }
.fe-hl .fe-tok-s { color: var(--fe-hl-string, #98c379); }
.fe-hl .fe-tok-n { color: var(--fe-hl-number, #d19a66); }
.fe-hl .fe-tok-k { color: var(--fe-hl-keyword, #c678dd); }
.fe-hl .fe-tok-b { color: var(--fe-hl-builtin, #56b6c2); }
.fe-hl .fe-tok-t { color: var(--fe-hl-type, #e5c07b); }
.fe-hl .fe-tok-f { color: var(--fe-hl-func, #61afef); }
.fe-hl .fe-tok-p { color: var(--fe-hl-prop, #e06c75); }
.fe-hl .fe-tok-o { color: var(--fe-hl-operator, #abb2bf); }
.fe-hl .fe-tok-a { color: var(--fe-hl-attr, #d19a66); }
.fe-hl .fe-tok-d { color: var(--fe-hl-directive, #c678dd); }
`;

		// ---------- fetch API (same origin as the GUI) ----------
		const api = {
			list: (path) => fetch('/plugins/file-explorer/list?path=' + encodeURIComponent(path)).then((r) => r.json()),
			search: (root, q) => fetch('/plugins/file-explorer/search?root=' + encodeURIComponent(root) + '&q=' + encodeURIComponent(q)).then((r) => r.json()),
			read: (path) => fetch('/plugins/file-explorer/read?path=' + encodeURIComponent(path)).then((r) => r.json()),
			write: (path, content) => fetch('/plugins/file-explorer/write', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ path, content }),
			}).then((r) => r.json()),
			openVscode: (path) => fetch('/plugins/file-explorer/open-vscode', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ path }),
			}).then((r) => r.json()),
		};

		const inject = ["slots"];

		// Expand-all/collapse-all coordination, stable across renders (the panel
		// is a single instance per page). A token bump cancels an in-flight run.
		let expandToken = 0;
		let expandBusy = false;
		const MAX_EXPAND_DIRS = 500;

		// ---------- shared store (open/width/search) ----------
		const store = {
			open: false,
			width: 340,
			rootPath: null,
			query: '',
			searching: false,
			searchError: null,
			matches: null,
			truncated: false,
			listeners: new Set(),
		};
		const emit = () => { for (const fn of Array.from(store.listeners)) fn() };
		const subscribe = (fn) => { store.listeners.add(fn); return () => { store.listeners.delete(fn) } };
		const setOpen = (value) => { store.open = !!value; emit() };
		const toggleOpen = () => setOpen(!store.open);

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

		const useStore = () => {
			const [, setTick] = react.useState(0);
			react.useEffect(() => subscribe(() => setTick((x) => x + 1)), []);
			return store;
		};

		// ---------- markdown ----------
		const isMarkdown = (name) => /\.(md|markdown|mdown|mkd)$/i.test(name);
		const isMermaidFile = (name) => /\.(mmd|mermaid)$/i.test(name);
		const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
		const mdInline = (s) => {
			let t = escapeHtml(s);
			t = t.replace(/`([^`\n]+)`/g, (m, c) => '<code>' + c + '</code>');
			t = t.replace(/\*\*([^*]+)\*\*/g, (m, c) => '<strong>' + c + '</strong>');
			t = t.replace(/~~([^~]+)~~/g, (m, c) => '<del>' + c + '</del>');
			t = t.replace(/\*([^*\s][^*]*)\*/g, (m, c) => '<em>' + c + '</em>');
			t = t.replace(/!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g, (m, alt, src) => '<img src="' + src + '" alt="' + alt + '" />');
			t = t.replace(/(?<!!)\[([^\]]+)\]\(([^)\s]+)\)/g, (m, txt, href) => '<a href="' + href + '" target="_blank" rel="noreferrer">' + txt + '</a>');
			return t;
		};
		const itemContent = (content) => {
			const task = /^\[([ xX])\]\s+(.*)$/.exec(content);
			if (task) return '<input type="checkbox" disabled' + (task[1] !== ' ' ? ' checked' : '') + ' /> ' + mdInline(task[2]);
			return mdInline(content);
		};
		const splitRow = (line) => {
			let s = String(line).trim();
			if (s.startsWith('|')) s = s.slice(1);
			if (s.endsWith('|')) s = s.slice(0, -1);
			return s.split('|').map((c) => c.trim());
		};
		const isTableSep = (line) => /^\s*\|?[\s:|-]+\|?\s*$/.test(String(line)) && String(line).includes('-');
		const buildListHtml = (entries, start, minIndent) => {
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
					let itemHtml = '<li>' + itemContent(e.content);
					if (i + 1 < entries.length && entries[i + 1].indent > minIndent) {
						const sub = buildListHtml(entries, i + 1, entries[i + 1].indent);
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
		const renderMarkdown = (text) => {
			mermaidBlocks = [];
			const lines = String(text).replace(/\r\n/g, '\n').split('\n');
			const out = [];
			let inCode = false;
			let codeLines = [];
			let codeLang = '';
			const flushCode = () => {
				if (inCode) {
					const code = codeLines.join('\n');
					if ((codeLang === 'mermaid' || codeLang === 'mmd') && code.trim()) {
						// Mermaid fence: emit a placeholder rendered async after
						// the HTML is injected (see renderMermaidBlocks).
						const id = mermaidBlocks.length;
						mermaidBlocks.push(code);
						out.push('<div class="fe-mermaid" data-mermaid-id="' + id + '"><div class="fe-mermaid-pending">Mermaid 图渲染中…</div></div>');
					} else {
						const lang = hlLangForFence(codeLang);
						const body = lang ? highlight(code, lang) : escapeHtml(code);
						out.push('<pre class="fe-hl' + (lang ? ' lang-' + lang : '') + '"><code>' + body + '</code></pre>');
					}
					codeLines = [];
					inCode = false;
					codeLang = '';
				}
			};
			// Shared GFM table builder: header line + separator line + data rows.
			// Used for plain tables and for tables inside blockquotes.
			const tableFrom = (headerLine, sepLine, rowLines) => {
				const header = splitRow(headerLine);
				const aligns = splitRow(sepLine).map((c) => {
					if (/^:.*:$/.test(c)) return 'center';
					if (/^:/.test(c)) return 'left';
					if (/:$/.test(c)) return 'right';
					return '';
				});
				const cell = (content, tag, idx) => {
					const align = aligns[Math.min(idx, aligns.length - 1)];
					return '<' + tag + (align ? ' style="text-align:' + align + '"' : '') + '>' + mdInline(content) + '</' + tag + '>';
				};
				let html = '<table><thead><tr>';
				header.forEach((c, idx) => { html += cell(c, 'th', idx) });
				html += '</tr></thead><tbody>';
				for (const row of rowLines) {
					html += '<tr>';
					splitRow(row).forEach((c, idx) => { html += cell(c, 'td', idx) });
					html += '</tr>';
				}
				return html + '</tbody></table>';
			};
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i];
				if (/^```/.test(line.trim())) {
					if (inCode) {
						flushCode(); // closing fence: exit code mode and push the block
					} else {
						inCode = true;
						codeLines = [];
						const fm = /^```\s*([\w+-]*)/.exec(line.trim());
						codeLang = fm && fm[1] ? fm[1] : '';
					}
					continue;
				}
				if (inCode) { codeLines.push(line); continue }
				// GFM table: header row + separator row
				if (/^\s*\|/.test(line) && i + 1 < lines.length && isTableSep(lines[i + 1])) {
					const rowLines = [];
					let k = i + 2;
					while (k < lines.length && /^\s*\|/.test(lines[k]) && !isTableSep(lines[k])) {
						rowLines.push(lines[k]);
						k++;
					}
					out.push(tableFrom(line, lines[i + 1], rowLines));
					i = k - 1;
					continue;
				}
				const heading = /^(#{1,6})\s+(.*)$/.exec(line);
				if (heading) { out.push('<h' + heading[1].length + '>' + mdInline(heading[2]) + '</h' + heading[1].length + '>'); continue }
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
					out.push(buildListHtml(entries, 0, entries[0].indent).out);
					i = j - 1;
					continue;
				}
				const quote = /^\s*>\s?(.*)$/.exec(line);
				if (quote) {
					// Collect consecutive quoted lines into ONE blockquote, and
					// render GFM tables inside it: a quoted table row starts with
					// "> |", invisible to the plain table detector above.
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
						if (/^\s*\|/.test(ql) && qi + 1 < q.length && isTableSep(q[qi + 1])) {
							const rowLines = [];
							let k2 = qi + 2;
							while (k2 < q.length && /^\s*\|/.test(q[k2]) && !isTableSep(q[k2])) {
								rowLines.push(q[k2]);
								k2++;
							}
							inner.push(tableFrom(ql, q[qi + 1], rowLines));
							qi = k2;
							continue;
						}
						if (ql.trim() === '') { qi++; continue }
						inner.push('<p>' + mdInline(ql) + '</p>');
						qi++;
					}
					out.push('<blockquote>' + inner.join('') + '</blockquote>');
					i = k - 1;
					continue;
				}
				if (/^\s*-+\s*$/.test(line)) { out.push('<hr/>'); continue }
				if (line.trim() === '') continue;
				out.push('<p>' + mdInline(line) + '</p>');
			}
			flushCode();
			return out.join('');
		};

		// ---------- mermaid rendering ----------
		// Mermaid sources of the LAST renderMarkdown run, keyed by the
		// data-mermaid-id placeholders in the produced HTML. Rendered
		// asynchronously after injection (see renderMermaidBlocks).
		let mermaidBlocks = [];
		// The mermaid engine is bundled as a lazy asset of @omdsh-dev/dsh-genui
		// (`/plugins/@omdsh-dev/dsh-genui/assets/mermaid.js`). Load it at most
		// once per page; on failure allow a later retry.
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
					const api = window.__GenuiAssets__ && window.__GenuiAssets__.mermaid;
					if (api) resolve(api);
					else { mermaidAssetPromise = null; reject(new Error('mermaid 引擎未注册')); }
				};
				script.onerror = () => { mermaidAssetPromise = null; reject(new Error('mermaid 引擎加载失败')); };
				document.head.appendChild(script);
			});
			return mermaidAssetPromise;
		};
		// Render one mermaid source into a container element (replaces its
		// content with the sanitized SVG). On any failure the raw source is
		// shown escaped so the file stays readable.
		const renderMermaidInto = (el, code) => {
			if (!el) return Promise.resolve();
			loadMermaidAsset().then((api) => api.renderMermaid(String(code))).then((svg) => {
				el.innerHTML = svg;
				const svgEl = el.querySelector('svg');
				if (svgEl) {
					svgEl.style.maxWidth = '100%';
					svgEl.style.height = 'auto';
				}
			}).catch((err) => {
				el.innerHTML = '<div class="fe-mermaid-error">Mermaid 渲染失败：' + escapeHtml(String((err && err.message) || err)) + '</div>'
					+ '<pre class="fe-mermaid-src">' + escapeHtml(String(code)) + '</pre>';
			});
		};
		// Walk the injected markdown DOM and render every mermaid placeholder.
		const renderMermaidBlocks = (container) => {
			if (!container) return;
			const els = container.querySelectorAll('.fe-mermaid[data-mermaid-id]');
			for (const el of els) {
				const id = Number(el.getAttribute('data-mermaid-id'));
				const code = mermaidBlocks[id];
				if (typeof code === 'string') renderMermaidInto(el, code);
			}
		};
		// React wrapper for a whole-file diagram (.mmd / .mermaid preview).
		// Owns its container exclusively (no children), so the async engine
		// can swap innerHTML without fighting React reconciliation.
		const MermaidBlock = (props) => {
			const ref = react.useRef(null);
			react.useEffect(() => {
				const el = ref.current;
				if (!el) return;
				el.innerHTML = '<div class="fe-mermaid-pending">Mermaid 图渲染中…</div>';
				renderMermaidInto(el, props.code);
			}, [props.code]);
			return react.createElement('div', { className: 'fe-mermaid', ref });
		};

		// ---------- syntax highlighting (self-contained, no runtime deps) ----------
		// Extension -> language id for direct file previews.
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
		// Fence-info aliases used by markdown code blocks (```lang).
		const HL_ALIAS = {
			javascript: 'js', jsx: 'js', typescript: 'ts', tsx: 'ts',
			py: 'python', 'c++': 'cpp', sh: 'shell', bash: 'shell',
			yml: 'yaml', jsonc: 'json',
		};
		const hlLangFor = (name) => {
			const n = String(name || '').toLowerCase();
			const i = n.lastIndexOf('.');
			const ext = i >= 0 ? n.slice(i + 1) : n;
			return HL_EXT[ext] || '';
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
		const hlSpan = (cls, html) => '<span class="fe-tok-' + cls + '">' + html + '</span>';
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

		// ---------- icons ----------
		const iconPaths = {
			vscode: 'M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74l3.06 2.26-3.06 2.26a1 1 0 0 0 .001 1.479L1.65 15.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 18.06V5.94a1.5 1.5 0 0 0-.85-1.353zm-5.105 14.698L9.429 12l8.616-5.285z',
			chevronDown: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z',
			chevronRight: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
			refresh: 'M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 7.73 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z',
			edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
			close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
			folder: 'M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z',
			file: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z',
			files: 'M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z',
			eye: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
			eyeOff: 'M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z',
		};
		const Icon = (props) => react.createElement('svg', {
			width: props.size || 14,
			height: props.size || 14,
			viewBox: '0 0 24 24',
			fill: 'currentColor',
			style: { display: 'block' },
		}, react.createElement('path', { d: iconPaths[props.name] }));

		const fmtSize = (n) => {
			if (n === null || n === undefined) return '';
			if (n < 1024) return n + ' B';
			if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
			if (n < 1073741824) return (n / 1048576).toFixed(1) + ' MB';
			return (n / 1073741824).toFixed(1) + ' GB';
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
			return react.createElement('span', { className: 'fe-node-icon fe-node-file', title: info.title },
				ic
					? react.createElement('svg', {
						width: size, height: size,
						viewBox: ic.viewBox || '0 0 24 24',
						style: { display: 'block' },
						dangerouslySetInnerHTML: { __html: ic.body },
					})
					: react.createElement(Icon, { name: 'file', size }));
		};

		// ---------- header toggle button ----------
		const ToggleButton = () => {
			const s = useStore();
			return react.createElement('button', {
				className: 'fe-toggle' + (s.open ? ' fe-toggle-on' : ''),
				title: '文件资源管理器',
				'aria-label': '文件资源管理器',
				onClick: toggleOpen,
			}, react.createElement(Icon, { name: 'files', size: 15 }));
		};

		// ---------- tree node ----------
		const TreeNode = (props) => {
			const entry = props.entry;
			const tree = props.tree;
			const isDir = entry.type === 'directory';
			const expanded = tree.expanded.has(entry.path);
			const loading = tree.loading.has(entry.path);
			const error = tree.errors[entry.path];
			const children = tree.cache.get(entry.path);
			const row = react.createElement('div', {
				className: 'fe-row' + (tree.selected === entry.path ? ' fe-row-selected' : ''),
				style: { paddingLeft: 6 + props.depth * 14 },
				onClick: () => isDir ? props.onToggle(entry.path) : props.onOpen(entry, true),
				onDoubleClick: () => props.onOpen(entry, false),
				title: entry.path,
			},
				react.createElement('span', { className: 'fe-chevron' + (isDir ? '' : ' fe-chevron-none') }, isDir
					? react.createElement(Icon, { name: expanded ? 'chevronDown' : 'chevronRight', size: 12 })
					: null),
				react.createElement('span', { className: 'fe-node-icon fe-node-' + (isDir ? 'dir' : 'file') },
					isDir ? react.createElement(Icon, { name: 'folder', size: 14 }) : react.createElement(FileTypeIcon, { entry })),
				react.createElement('span', { className: 'fe-node-name', title: entry.name }, entry.name),
				isDir && loading ? react.createElement('span', { className: 'fe-node-loading' }, '…') : null,
				!isDir && typeof entry.size === 'number' ? react.createElement('span', { className: 'fe-node-size' }, fmtSize(entry.size)) : null,
			);
			const nodes = [row];
			if (isDir && expanded) {
				if (children) {
					for (const child of children) {
						nodes.push(react.createElement(TreeNode, { key: child.path, entry: child, depth: props.depth + 1, tree, onToggle: props.onToggle, onSelect: props.onSelect, onOpen: props.onOpen }));
					}
				} else if (!loading && error) {
					nodes.push(react.createElement('div', { key: '__err', className: 'fe-node-error', style: { paddingLeft: 6 + (props.depth + 1) * 14 } }, error));
				}
			}
			return react.createElement('div', { className: 'fe-node' }, ...nodes);
		};

		// ---------- main panel ----------
		const ExplorerPanel = (props) => {
			const s = useStore();
			const currentSessionId = props.useSessions((st) => st.current);
			const wsItems = props.useWorkspaces((st) => st.items);
			const recentWorkspaceId = props.useWorkspaces((st) => st.recentWorkspaceId);

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
			const [editor, setEditor] = react.useState(null);
			const [status, setStatus] = react.useState(null);
			const [previewWidth, setPreviewWidth] = react.useState(400);
			const [drag, setDrag] = react.useState(null);
			// Auto-refresh: poll expanded dirs while the panel is open and
			// merge new/removed entries into the tree (default on).
			const [autoWatch, setAutoWatch] = react.useState(true);
			// Latest-tree mirror for the polling interval (avoids stale
			// closures), plus a busy flag so ticks never overlap.
			const treeRef = react.useRef(null);
			const pollBusyRef = react.useRef(false);
			// Preview containers for async mermaid rendering.
			const mdRef = react.useRef(null);
			// Re-click on the previewed file schedules a close; a following
			// double-click cancels it, so dblclick never flickers.
			const previewToggleRef = react.useRef(null);
			const clearPreviewToggle = () => {
				if (previewToggleRef.current !== null) {
					clearTimeout(previewToggleRef.current);
					previewToggleRef.current = null;
				}
			};
			react.useEffect(() => () => {
				if (previewToggleRef.current !== null) clearTimeout(previewToggleRef.current);
			}, []);

			let statusSeq = 0;
			const showStatus = (msg) => {
				const seq = ++statusSeq;
				setStatus(msg);
				setTimeout(() => { if (seq === statusSeq) setStatus(null) }, 4000);
			};

			const without = (set, v) => { const n = new Set(set); n.delete(v); return n };
			const withVal = (set, v) => { const n = new Set(set); n.add(v); return n };

			react.useEffect(() => {
				if (!rootPath) { setTree(null); return }
				store.rootPath = rootPath;
				let cancelled = false;
				setTree({ rootPath, rootName, expanded: new Set([rootPath]), cache: new Map(), loading: new Set([rootPath]), selected: null, errors: {} });
				api.list(rootPath).then((res) => {
					if (cancelled) return;
					setTree((t) => {
						if (!t || t.rootPath !== rootPath) return t;
						const next = { ...t, loading: without(t.loading, rootPath) };
						if (res && res.error) next.errors = { ...t.errors, [rootPath]: res.error };
						else next.cache = new Map(t.cache).set(rootPath, (res && res.entries) || []);
						return next;
					});
				}).catch((err) => {
					if (cancelled) return;
					setTree((t) => {
						if (!t || t.rootPath !== rootPath) return t;
						return { ...t, loading: without(t.loading, rootPath), errors: { ...t.errors, [rootPath]: String((err && err.message) || err) } };
					});
				});
				return () => { cancelled = true };
			}, [rootPath]);

			// Native-style layout yield: while the panel is open, the conversation
			// column ([data-phase=active]) gets right padding equal to the tree +
			// preview widths, so its content really reflows instead of being covered.
			react.useEffect(() => {
				const root = document.documentElement;
				if (s.open) root.setAttribute('data-fe-panel-open', '');
				else root.removeAttribute('data-fe-panel-open');
				return () => {
					root.removeAttribute('data-fe-panel-open');
				};
			}, [s.open]);
			react.useEffect(() => {
				const root = document.documentElement;
				root.style.setProperty('--fe-panel-width', s.width + 'px');
				root.style.setProperty('--fe-preview-width', (editor ? previewWidth : 0) + 'px');
			}, [s.width, previewWidth, editor ? 1 : 0]);

			react.useEffect(() => { treeRef.current = tree }, [tree]);

			// Auto-refresh: every 3s re-list the root plus each expanded dir
			// (capped) and merge changed listings into the cache, preserving
			// expansion/selection. Runs only while the panel is open and the
			// watch toggle is on; paused while the tab is hidden.
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
						const fpCur = ct.cache.get(dir).map((e) => e.type + ':' + e.name).join('|');
						const fpNew = (res.entries || []).map((e) => e.type + ':' + e.name).join('|');
						if (fpCur === fpNew) continue;
						changed++;
						setTree((prev) => prev ? { ...prev, cache: new Map(prev.cache).set(dir, res.entries || []) } : prev);
					}
					pollBusyRef.current = false;
					if (changed > 0) showStatus({ ok: true, text: '检测到文件变化，已自动刷新' });
				};
				timer = setInterval(tick, 3000);
				return () => { disposed = true; pollBusyRef.current = false; if (timer !== null) clearInterval(timer) };
			}, [s.open, tree && tree.rootPath, autoWatch]);

			// Render mermaid fences after the markdown HTML is injected.
			react.useEffect(() => {
				if (editor && editor.state === 'ready' && !editor.editing && editor.preview && isMarkdown(editor.name)) {
					renderMermaidBlocks(mdRef.current);
				}
			}, [editor && editor.path, editor && editor.content, editor && editor.state, editor && editor.preview, editor && editor.editing]);

			const loadChildren = (path) => {
				api.list(path).then((res) => {
					setTree((t) => {
						if (!t) return t;
						const cache = new Map(t.cache);
						const errors = { ...t.errors };
						if (res && !res.error) cache.set(path, (res && res.entries) || []);
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

			const selectFile = (path) => setTree((t) => t ? { ...t, selected: path } : t);

			const openFile = (entry, startEditing, toggle) => {
				if (editor && editor.path === entry.path) {
					if (editor.editing) { clearPreviewToggle(); return; }
					if (startEditing) {
						clearPreviewToggle();
						if (editor.state === 'ready' && !editor.editing) {
							setEditor((e) => ({ ...e, editing: true, preview: false }));
						}
						return;
					}
					if (editor.state === 'ready' || editor.state === 'loading') {
						if (toggle) {
							// Single click on the previewed file closes the preview;
							// a double-click arriving in the window cancels it.
							clearPreviewToggle();
							previewToggleRef.current = setTimeout(() => {
								previewToggleRef.current = null;
								setEditor(null);
								setStatus(null);
							}, 220);
						} else {
							clearPreviewToggle();
						}
						return;
					}
					// 'error' / 'too-large': fall through and re-open (retry).
				}
				clearPreviewToggle();
				selectFile(entry.path);
				setEditor({ path: entry.path, name: entry.name, content: null, size: entry.size || 0, state: 'loading', editing: !!startEditing, preview: (isMarkdown(entry.name) || isMermaidFile(entry.name)) && !startEditing });
				setStatus(null);
				api.read(entry.path).then((res) => {
					setEditor((e) => {
						if (!e || e.path !== entry.path) return e;
						if (res && res.error) return { ...e, state: 'error', message: res.error, editing: false, preview: false };
						if (res && res.tooLarge) return { ...e, state: 'too-large', size: res.size, editing: false, preview: false };
						return { ...e, state: 'ready', content: res.content, size: res.size };
					});
				}).catch((err) => {
					setEditor((e) => e && e.path === entry.path ? { ...e, state: 'error', message: String((err && err.message) || err), editing: false, preview: false } : e);
				});
			};

			const findEntry = (t, path) => {
				const walk = (dir) => {
					const children = t.cache.get(dir);
					if (!children) return null;
					for (const e of children) {
						if (e.path === path) return e;
						if (e.type === 'directory') { const hit = walk(e.path); if (hit) return hit }
					}
					return null;
				};
				return t && t.rootPath ? walk(t.rootPath) : null;
			};

			const onEditClick = () => {
				setStatus(null);
				if (editor && editor.state === 'ready') {
					setEditor((e) => e.editing
						? { ...e, editing: false, preview: isMarkdown(e.name) || isMermaidFile(e.name) }
						: { ...e, editing: true, preview: false });
				} else if (!editor && tree && tree.selected) {
					const sel = findEntry(tree, tree.selected);
					if (sel && sel.type !== 'directory') openFile(sel, true);
				}
			};

			const onSave = () => {
				if (!editor || editor.state !== 'ready') return;
				const path = editor.path;
				const content = editor.content;
				api.write(path, content).then((res) => {
					if (res && res.error) showStatus({ ok: false, text: '保存失败：' + res.error });
					else {
						setEditor((e) => e && e.path === path ? { ...e, editing: false } : e);
						showStatus({ ok: true, text: '已保存' });
					}
				}).catch((err) => showStatus({ ok: false, text: '保存失败：' + String((err && err.message) || err) }));
			};

			const refresh = () => {
				if (!tree || !tree.rootPath) return;
				const root = tree.rootPath;
				const name = tree.rootName;
				setTree({ rootPath: root, rootName: name, expanded: new Set([root]), cache: new Map(), loading: new Set([root]), selected: null, errors: {} });
				loadChildren(root);
			};

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
				// Clicking while an expansion is in flight collapses (and cancels) it.
				if (expandBusy || tree.expanded.size > 1) collapseAll();
				else expandAll();
			};

			// Real recursive expand: every directory is actually LOADED, not just
			// flagged, so deeper levels appear too. Collapse cancels the run.
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

			const onVscode = () => {
				if (!tree || !tree.rootPath) return;
				api.openVscode(tree.rootPath).then((res) => {
					showStatus(res && res.ok
						? { ok: true, text: '已在 VS Code 中打开项目' }
						: { ok: false, text: (res && res.error) || '打开失败（未检测到 code 命令）' });
				}).catch((err) => showStatus({ ok: false, text: '打开失败：' + String((err && err.message) || err) }));
			};

			const onResizeStart = (kind, e) => {
				e.preventDefault();
				setDrag({ kind, startX: e.clientX, startWidth: kind === 'tree' ? s.width : previewWidth });
			};
			const onResizeMove = (e) => {
				if (!drag) return;
				if (drag.kind === 'tree') {
					store.width = Math.max(220, Math.min(1000, drag.startWidth + (drag.startX - e.clientX)));
					emit();
				} else {
					// preview: drag its LEFT edge; moving left widens the preview
					setPreviewWidth(Math.max(180, Math.min(1000, drag.startWidth + (drag.startX - e.clientX))));
				}
			};
			const endDrag = () => setDrag(null);

			const renderTree = () => {
				if (!tree || !tree.rootPath) return react.createElement('div', { className: 'fe-empty' }, '未找到当前工作区');
				const rows = [];
				rows.push(react.createElement('div', {
					key: 'root',
					className: 'fe-row fe-row-root',
					style: { paddingLeft: 6 },
					onClick: () => toggleDir(tree.rootPath),
					title: tree.rootPath,
				},
					react.createElement('span', { className: 'fe-chevron' }, react.createElement(Icon, { name: tree.expanded.has(tree.rootPath) ? 'chevronDown' : 'chevronRight', size: 12 })),
					react.createElement('span', { className: 'fe-node-icon fe-node-dir' }, react.createElement(Icon, { name: 'folder', size: 14 })),
					react.createElement('span', { className: 'fe-node-name', title: tree.rootName }, tree.rootName || tree.rootPath),
					tree.loading.has(tree.rootPath) ? react.createElement('span', { className: 'fe-node-loading' }, '…') : null,
				));
				if (tree.expanded.has(tree.rootPath)) {
					const children = tree.cache.get(tree.rootPath);
					if (children) {
						for (const child of children) {
							rows.push(react.createElement(TreeNode, { key: child.path, entry: child, depth: 1, tree, onToggle: toggleDir, onSelect: selectFile, onOpen: (e, toggle) => openFile(e, false, toggle) }));
						}
					} else if (!tree.loading.has(tree.rootPath) && tree.errors[tree.rootPath]) {
						rows.push(react.createElement('div', { key: 'err', className: 'fe-node-error', style: { paddingLeft: 20 } }, tree.errors[tree.rootPath]));
					}
				}
				return rows;
			};

			const renderSearch = () => {
				if (s.searching && !s.matches) return react.createElement('div', { className: 'fe-empty' }, '搜索中…');
				if (s.searchError) return react.createElement('div', { className: 'fe-node-error' }, s.searchError);
				if (!s.matches || s.matches.length === 0) return react.createElement('div', { className: 'fe-empty' }, '没有匹配的文件');
				const rows = [];
				for (const m of s.matches) {
					const rel = m.path.slice(tree && tree.rootPath ? tree.rootPath.length : 0).replace(/^[\\/]+/, '');
					rows.push(react.createElement('div', {
						key: m.path,
						className: 'fe-row' + (tree && tree.selected === m.path ? ' fe-row-selected' : ''),
						style: { paddingLeft: 6 },
						onClick: () => m.type === 'directory' ? selectFile(m.path) : openFile(m, false, true),
						onDoubleClick: () => m.type === 'directory' ? selectFile(m.path) : openFile(m, false, false),
						title: m.path,
					},
						react.createElement('span', { className: 'fe-node-icon fe-node-' + (m.type === 'directory' ? 'dir' : 'file') }, m.type === 'directory' ? react.createElement(Icon, { name: 'folder', size: 14 }) : react.createElement(FileTypeIcon, { entry: m })),
						react.createElement('span', { className: 'fe-node-name', title: m.name }, m.name),
						react.createElement('span', { className: 'fe-node-rel' }, rel || '.'),
					));
				}
				if (s.truncated) rows.push(react.createElement('div', { key: 'trunc', className: 'fe-node-error' }, '结果过多，已截断（前 300 条）'));
				return rows;
			};

			const renderPreview = () => {
				if (!editor) return null;
				const isMd = isMarkdown(editor.name);
				const isMm = isMermaidFile(editor.name);
				const showPreview = (isMd || isMm) && !editor.editing && editor.preview && editor.state === 'ready';
				const head = react.createElement('div', { className: 'fe-editor-head' },
					react.createElement('span', { className: 'fe-editor-name', title: editor.name }, editor.name),
					react.createElement('span', { className: 'fe-editor-path' }, editor.path),
					(isMd || isMm) && editor.state === 'ready' && !editor.editing
						? react.createElement('button', { className: 'fe-btn', onClick: () => setEditor((e) => ({ ...e, preview: !e.preview })) }, editor.preview ? '源码' : (isMm ? '图表' : '预览'))
						: null,
					editor.state === 'ready' && editor.editing
						? react.createElement('button', { className: 'fe-btn', onClick: onSave }, '保存')
						: null,
					react.createElement('button', { className: 'fe-btn', onClick: () => { setEditor(null); setStatus(null) } }, '关闭'),
				);
				let body = null;
				if (editor.state === 'loading') body = react.createElement('div', { className: 'fe-editor-msg' }, '加载中…');
				else if (editor.state === 'error') body = react.createElement('div', { className: 'fe-editor-msg fe-err' }, editor.message);
				else if (editor.state === 'too-large') body = react.createElement('div', { className: 'fe-editor-msg' }, '文件过大（' + fmtSize(editor.size) + '），不支持预览');
				else if (showPreview && isMd) body = react.createElement('div', { className: 'fe-md', ref: mdRef, dangerouslySetInnerHTML: { __html: renderMarkdown(editor.content) } });
				else if (showPreview && isMm) body = react.createElement('div', { className: 'fe-md fe-mmd' },
					react.createElement(MermaidBlock, { key: editor.path, code: editor.content }));
				else if (!editor.editing) {
					const lang = hlLangFor(editor.name);
					body = lang && lang !== 'markdown' && lang !== 'text'
						? react.createElement('pre', { className: 'fe-preview-plain fe-hl lang-' + lang, dangerouslySetInnerHTML: { __html: highlight(editor.content, lang) } })
						: react.createElement('pre', { className: 'fe-preview-plain' }, editor.content);
				}
				else body = react.createElement('textarea', {
					className: 'fe-editor-textarea',
					spellCheck: false,
					value: editor.content,
					onChange: (e) => setEditor((prev) => ({ ...prev, content: e.target.value })),
				});
				return react.createElement('div', { className: 'fe-preview-body' }, head, body);
			};

			if (!s.open) return null;
			// ">" tab at the middle of the leftmost edge: collapses the whole
			// explorer (tree panel, or preview pane when a file preview is open).
			const collapseTab = react.createElement('button', {
				className: 'fe-collapse-tab',
				title: '收起文件资源管理器',
				'aria-label': '收起文件资源管理器',
				onClick: () => setOpen(false),
			}, react.createElement(Icon, { name: 'chevronRight', size: 14 }));
			const treePanel = react.createElement('div', { className: 'fe-panel', style: { width: s.width + 'px' } },
				react.createElement('div', { className: 'fe-resize', title: '拖动调整宽度', onPointerDown: (e) => onResizeStart('tree', e) }),
				editor ? null : collapseTab,
				react.createElement('div', { className: 'fe-header' },
					react.createElement('span', { className: 'fe-title' }, '文件'),
					react.createElement('button', { className: 'fe-iconbtn fe-icon-vscode', title: '在 Visual Studio Code 中打开项目', onClick: onVscode }, react.createElement(Icon, { name: 'vscode', size: 15 })),
					react.createElement('button', { className: 'fe-iconbtn', title: '全部展开 / 全部折叠', onClick: toggleAll }, react.createElement(Icon, { name: 'chevronDown', size: 14 })),
					react.createElement('button', { className: 'fe-iconbtn', title: '刷新', onClick: refresh }, react.createElement(Icon, { name: 'refresh', size: 14 })),
					react.createElement('button', {
						className: 'fe-iconbtn' + (autoWatch ? ' fe-iconbtn-on' : ''),
						title: autoWatch ? '自动刷新：开' : '自动刷新：关',
						onClick: () => setAutoWatch((v) => !v),
					}, react.createElement(Icon, { name: autoWatch ? 'eye' : 'eyeOff', size: 14 })),
					react.createElement('button', { className: 'fe-iconbtn' + (editor && editor.editing ? ' fe-iconbtn-on' : ''), title: '编辑', onClick: onEditClick }, react.createElement(Icon, { name: 'edit', size: 14 })),
					react.createElement('button', { className: 'fe-iconbtn', title: '关闭', onClick: () => setOpen(false) }, react.createElement(Icon, { name: 'close', size: 14 })),
				),
				react.createElement('div', { className: 'fe-searchbar' },
					react.createElement('input', { className: 'fe-search', type: 'text', placeholder: '搜索文件', value: s.query, spellCheck: false, onChange: (e) => setQuery(e.target.value) }),
					s.searching ? react.createElement('span', { className: 'fe-search-state' }, '…') : null,
				),
				status ? react.createElement('div', { className: 'fe-status ' + (status.ok ? 'fe-status-ok' : 'fe-status-err') }, status.text) : null,
				react.createElement('div', { className: 'fe-tree' }, s.query.trim() ? renderSearch() : renderTree()),
			);
			const previewPane = editor
				? react.createElement('div', {
					className: 'fe-preview',
					style: { right: s.width + 'px', width: previewWidth + 'px', maxWidth: 'calc(100vw - ' + s.width + 'px - 12px)' },
				},
					react.createElement('div', { className: 'fe-preview-resize', title: '拖动调整宽度', onPointerDown: (e) => onResizeStart('preview', e) }),
					collapseTab,
					renderPreview(),
				)
				: null;
			return react.createElement('div', { className: 'fe-overlay-root' },
				drag ? react.createElement('div', { className: 'fe-drag-capture', onPointerMove: onResizeMove, onPointerUp: endDrag, onPointerLeave: endDrag }) : null,
				treePanel,
				previewPane,
			);
		};

		function apply(ctx) {
			const styleEl = document.createElement('style');
			styleEl.textContent = CSS;
			document.head.appendChild(styleEl);
			ctx.effect(() => () => { styleEl.remove() }, 'file-explorer: styles');

			// Double-click anywhere on the chat interface collapses the
			// explorer. Editable fields and interactive controls are excluded
			// so normal double-click behaviors (word select, edit, follow)
			// keep working. The conversation column carries data-phase
			// (active/hero); the explorer overlay lives outside it.
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
			ctx.effect(() => () => { document.removeEventListener('dblclick', onChatDblClick) }, 'file-explorer: chat dblclick collapse');

			const slots = ctx.get('slots');
			if (slots === undefined) return;
			slots.inject('shell.overlay', () => slots.register(
				{ name: 'shell.overlay', id: 'file-explorer', order: 90, label: '文件资源管理器' },
				(props) => react.createElement(ExplorerPanel, props),
			));
			// 标题栏入口：与 Session Log 同区（header.utilities），order 10 排在其后
			slots.inject('conversation.session.header.utilities', () => slots.register(
				{ name: 'conversation.session.header.utilities', id: 'file-explorer-toggle', order: 10, label: '文件资源管理器' },
				(props) => react.createElement(ToggleButton, props),
			));
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
