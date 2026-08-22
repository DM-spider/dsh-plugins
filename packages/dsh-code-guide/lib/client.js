window.__ModuleLoader__.load({
	id: "dsh-code-guide",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		var react = require("react");

		// ---------- styles ----------
		const CSS = `
html {
  --cg-width: 680px;
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
.cg-collapse-tab-on { background: var(--dsw-alias-brand-primary); color: #fff; border-color: var(--dsw-alias-brand-primary); }
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
  flex: none; overflow: auto;
  padding: 4px 0 8px; user-select: none;
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
.cg-code-pane { flex: none; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }
.cg-pane-head {
  display: flex; align-items: center; gap: 6px;
  padding: 4px 8px; flex: none;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-secondary); font-size: 12px;
}
.cg-pane-head .cg-pane-title { font-weight: 600; color: var(--dsw-alias-label-primary); flex: none; }
.cg-pane-path { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; }
.cg-pane-act {
  flex: none; display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 8px; border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 5px; background: transparent;
  color: var(--dsw-alias-brand-primary); font-size: 12px; cursor: pointer;
}
.cg-pane-act:hover { background: var(--dsw-alias-bg-layer-2); border-color: var(--dsw-alias-brand-primary); }
.cg-pane-act-on { background: var(--dsw-alias-bg-layer-2); border-color: var(--dsw-alias-brand-primary); }
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
.cg-line-jump { animation: cg-line-jump 1.5s ease-out 1; }
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
  padding: 8px 10px; margin-bottom: 8px; cursor: pointer;
  background: var(--dsw-alias-bg-layer-1);
}
.cg-card:hover { border-color: var(--dsw-alias-brand-primary); }
.cg-card-on { border-color: var(--dsw-alias-brand-primary); box-shadow: 0 0 0 1px var(--dsw-alias-brand-primary); }
.cg-item-flash { animation: cg-card-flash 1.5s ease-out 1; }
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
  background-color: rgba(59, 130, 246, .18);
  border-radius: 2px; padding: 0 1px;
  animation: cg-flash 1.5s ease-in-out 1;
}
@keyframes cg-flash {
  0% { background-color: rgba(59, 130, 246, .95); color: #fff; }
  100% { background-color: rgba(59, 130, 246, .18); }
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
.cg-mermaid-pending { color: var(--dsw-alias-label-secondary); font-size: 12px; padding: 6px 4px; }
.cg-mermaid-error { color: var(--dsw-alias-state-error-primary); font-size: 12px; margin-bottom: 6px; }
.cg-mermaid-src {
  margin: 0; padding: 8px 10px;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 6px;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 12px; overflow: auto; white-space: pre-wrap;
}
`;

		// ---------- fetch api ----------
		const api = {
			list: (path) => fetch('/plugins/code-guide/list?path=' + encodeURIComponent(path)).then((r) => r.json()),
			read: (path) => fetch('/plugins/code-guide/read?path=' + encodeURIComponent(path)).then((r) => r.json()),
			explain: (path, refresh) => fetch('/plugins/code-guide/explain', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ path, refresh: !!refresh }),
			}).then((r) => r.json()),
		};

		const inject = ["slots"];

		const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

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

		// 调用图视图:工具栏(放大/缩小/复位/复制)+ 滚轮缩放 + 拖拽平移
		const GraphView = (props) => {
			const [view, setView] = react.useState({ scale: 1, tx: 0, ty: 0 });
			const [copied, setCopied] = react.useState(false);
			const dragRef = react.useRef(null);
			const vpRef = react.useRef(null);
			const reset = () => setView({ scale: 1, tx: 0, ty: 0 });
			const zoomBy = (d) => setView((v) => ({ ...v, scale: Math.max(0.4, Math.min(4, +(v.scale + d).toFixed(2))) }));
			react.useEffect(() => {
				const el = vpRef.current;
				if (!el) return;
				const onWheel = (e) => {
					e.preventDefault();
					zoomBy(e.deltaY < 0 ? 0.15 : -0.15);
				};
				el.addEventListener('wheel', onWheel, { passive: false });
				return () => el.removeEventListener('wheel', onWheel);
			}, []);
			const onPointerDown = (e) => {
				// 仅 Alt+点击才算拖拽;普通点击不拦截,正常派发给 SVG 节点跳转
				if (!e.altKey) return;
				dragRef.current = { pointerId: e.pointerId, x: e.clientX, y: e.clientY, tx: view.tx, ty: view.ty };
				if (vpRef.current && vpRef.current.setPointerCapture) {
					try { vpRef.current.setPointerCapture(e.pointerId) } catch { /* ignore */ }
				}
			};
			const onPointerMove = (e) => {
				const d = dragRef.current;
				if (!d || e.pointerId !== d.pointerId) return;
				setView((v) => ({ ...v, tx: d.tx + (e.clientX - d.x), ty: d.ty + (e.clientY - d.y) }));
			};
			const onPointerUp = (e) => {
				const d = dragRef.current;
				dragRef.current = null;
				if (d && vpRef.current && vpRef.current.hasPointerCapture && vpRef.current.hasPointerCapture(e.pointerId)) {
					try { vpRef.current.releasePointerCapture(e.pointerId) } catch { /* ignore */ }
				}
			};
			const onCopy = () => {
				if (navigator.clipboard && navigator.clipboard.writeText) {
					navigator.clipboard.writeText(String(props.code)).then(() => {
						setCopied(true);
						setTimeout(() => setCopied(false), 1500);
					}).catch(() => {});
				}
			};
			return react.createElement('div', { className: 'cg-graph' },
				react.createElement('div', { className: 'cg-graph-toolbar' },
					react.createElement('button', { className: 'cg-gbtn', title: '放大', onClick: () => zoomBy(0.2) }, '＋'),
					react.createElement('button', { className: 'cg-gbtn', title: '缩小', onClick: () => zoomBy(-0.2) }, '－'),
					react.createElement('button', { className: 'cg-gbtn', title: '复位视图', onClick: reset }, react.createElement(Icon, { name: 'reset', size: 14 })),
					react.createElement('button', { className: 'cg-gbtn', title: copied ? '已复制' : '复制 mermaid 源码', onClick: onCopy }, react.createElement(Icon, { name: copied ? 'check' : 'copy', size: 14 })),
				),
				react.createElement('div', {
					className: 'cg-graph-viewport',
					ref: vpRef,
					onPointerDown: onPointerDown,
					onPointerMove: onPointerMove,
					onPointerUp: onPointerUp,
					onPointerLeave: onPointerUp,
				},
					react.createElement('div', {
						style: { transform: 'translate(' + view.tx + 'px,' + view.ty + 'px) scale(' + view.scale + ')', transformOrigin: '0 0', display: 'inline-block', minWidth: '100%' },
					},
						react.createElement(CallGraphBlock, { code: props.code, onNodeClick: props.onNodeClick }),
					),
				),
			);
		};

		// ---------- shared store ----------
		// 面板/分栏尺寸存 localStorage:刷新后保持上次布局
		const store = {
			open: false,
			width: 680,
			paneR: { code: 0.5, tree: 0.25 }, // 源码占主区比例、文件树占面板比例
			listeners: new Set(),
		};
		try {
			const w = Number(localStorage.getItem('cg-panel-w'));
			if (Number.isFinite(w) && w >= 420 && w <= 2400) store.width = w;
			const cr = Number(localStorage.getItem('cg-code-r'));
			if (Number.isFinite(cr) && cr >= 0.05 && cr <= 0.95) store.paneR.code = cr;
			const tr = Number(localStorage.getItem('cg-tree-r'));
			if (Number.isFinite(tr) && tr >= 0.02 && tr <= 0.9) store.paneR.tree = tr;
		} catch (_) { /* localStorage 不可用时忽略 */ }
		const emit = () => { for (const fn of Array.from(store.listeners)) fn() };
		const subscribe = (fn) => { store.listeners.add(fn); return () => { store.listeners.delete(fn) } };
		const setOpen = (value) => { store.open = !!value; emit() };
		const toggleOpen = () => setOpen(!store.open);
		const useStore = () => {
			const [, setTick] = react.useState(0);
			react.useEffect(() => subscribe(() => setTick((x) => x + 1)), []);
			return store;
		};

		// ---------- 面板/分栏尺寸 ----------
		const PANEL_MIN_W = 420;      // 面板最小宽度(低于它的松手值回弹)
		const PANEL_COLLAPSE_W = 280; // 拖到比这更窄(=拖向最右侧)→ 松手收起面板
		const PANE_MIN_TREE = 110;
		const PANE_MIN_CODE = 200;
		const PANE_MIN_GUIDE = 200;
		const PANE_DIV_W = 5;
		const panelMaxW = () => Math.max(PANEL_MIN_W, Math.min(window.innerWidth - 90, 2200));
		// 由面板宽度 + 两个比例算出三个视窗的实际像素宽度:拖分栏线时实时
		// 生效,整体调宽时按比例同步伸缩(和 VS Code/Cursor 侧栏行为一致)
		const paneWidths = (panelW, paneR) => {
			const treeW = Math.max(PANE_MIN_TREE, Math.min(Math.round(panelW * paneR.tree), Math.max(PANE_MIN_TREE, panelW - (PANE_MIN_CODE + PANE_MIN_GUIDE + PANE_DIV_W))));
			const mainW = panelW - treeW - PANE_DIV_W;
			const codeW = Math.max(PANE_MIN_CODE, Math.min(Math.round(mainW * paneR.code), mainW - PANE_MIN_GUIDE));
			return { treeW, mainW, codeW };
		};

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
		// 高亮 HTML 按行切分:逐行补齐跨行 span 的闭合与重开,
		// 保证多行注释/字符串的颜色连续,且每一行都是独立可渲染片段
		const splitHighlighted = (html) => {
			const out = [];
			const stack = [];
			const tagRe = /<\/?span( class="[^"]*")?>/g;
			for (const raw of html.split('\n')) {
				// 行首栈 → 前缀重开跨行 span
				const startStack = stack.slice();
				let prefix = '';
				for (const cls of startStack) prefix += '<span class="' + cls + '">';
				// 按顺序处理本行标签,更新栈
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
				// 行尾栈 → 后缀闭合,保证每行独立平衡
				let suffix = '';
				for (let i = stack.length - 1; i >= 0; i--) suffix += '</span>';
				out.push(prefix + raw + suffix);
			}
			return out;
		};

		// ---------- icons ----------
		const iconPaths = {
			chevronDown: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z',
			chevronRight: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
			close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
			refresh: 'M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 7.73 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z',
			sparkle: 'M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z',
			reset: 'M12 5V2L7 6l5 4V7c3.31 0 6 2.69 6 6 0 2.97-2.17 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93 0-4.42-3.58-8-8-8zm-6 8c0-1.65.62-3.16 1.63-4.29L6.22 7.3C4.85 8.74 4 10.76 4 13c0 4.08 3.05 7.44 7 7.93v-2.02C8.17 18.43 6 15.97 6 13z',
			copy: 'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z',
			check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
			file: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z',
			folder: 'M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z',
			book: 'M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z',
		};
		const Icon = (props) => react.createElement('svg', {
			width: props.size || 14,
			height: props.size || 14,
			viewBox: '0 0 24 24',
			fill: 'currentColor',
			style: { display: 'block' },
		}, react.createElement('path', { d: iconPaths[props.name] }));

		// ---------- header toggle ----------
		const ToggleButton = () => {
			const s = useStore();
			return react.createElement('button', {
				className: 'cg-toggle' + (s.open ? ' cg-toggle-on' : ''),
				title: '代码陪读',
				'aria-label': '代码陪读',
				onClick: toggleOpen,
			}, react.createElement(Icon, { name: 'book', size: 15 }));
		};

		// ---------- file tree ----------
		const TreeNode = (props) => {
			const entry = props.entry;
			const tree = props.tree;
			const isDir = entry.type === 'directory';
			const expanded = tree.expanded.has(entry.path);
			const children = tree.cache.get(entry.path);
			const row = react.createElement('div', {
				className: 'cg-trow' + (tree.selected === entry.path ? ' cg-trow-sel' : ''),
				style: { paddingLeft: 4 + props.depth * 12 },
				onClick: () => isDir ? props.onToggle(entry.path) : props.onOpen(entry),
				title: entry.path,
			},
				react.createElement('span', { style: { display: 'flex', flex: 'none' } }, isDir
					? react.createElement(Icon, { name: expanded ? 'chevronDown' : 'chevronRight', size: 12 })
					: null),
				react.createElement('span', { style: { display: 'flex', flex: 'none' } }, react.createElement(Icon, { name: isDir ? 'folder' : 'file', size: 13 })),
				react.createElement('span', { className: 'cg-trow-name' }, entry.name),
			);
			const nodes = [row];
			if (isDir && expanded && children) {
				for (const child of children) {
					nodes.push(react.createElement(TreeNode, { key: child.path, entry: child, depth: props.depth + 1, tree, onToggle: props.onToggle, onOpen: props.onOpen }));
				}
			}
			return react.createElement('div', null, ...nodes);
		};

		// ---------- main panel ----------
		const MAX_LINES = 10000;

		const GuidePanel = (props) => {
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
			const [file, setFile] = react.useState(null); // { path, name, content, size, functions, callGraph, model, loading, error, tooLarge }
			const [active, setActive] = react.useState(null); // function index
			const [tab, setTab] = react.useState('guide');
			const [drag, setDrag] = react.useState(null);
			// 变量闪烁: { name, funcIndex, seq }
			const [flash, setFlash] = react.useState(null);
			const flashTimerRef = react.useRef(null);
			// 解读项闪烁定时器(点击代码行时)
			const itemFlashTimerRef = react.useRef(null);
			// 跳转目标行闪烁: { line, seq }(Ctrl+点击跳转 / 历史导航)
			const [jumpLine, setJumpLine] = react.useState(null);
			const jumpLineTimerRef = react.useRef(null);
			// 跳转历史:所有跳转入栈,Alt+←/→ 前进后退
			const jumpHistoryRef = react.useRef([]);
			const jumpIndexRef = react.useRef(-1);
			// 最近交互行:跳转的"出发点"取用户最后点击/停留的那一行,
			// 而不是滚动位置折算的顶部行(否则 Alt+← 闪烁落在错行)
			const lastFocusRef = react.useRef(null);

			const codePaneRef = react.useRef(null);
			const guideRef = react.useRef(null);
			const cardRefs = react.useRef([]);

			const without = (set, v) => { const n = new Set(set); n.delete(v); return n };
			const withVal = (set, v) => { const n = new Set(set); n.add(v); return n };

			react.useEffect(() => {
				if (!rootPath) { setTree(null); return }
				let cancelled = false;
				setTree({ rootPath, rootName, expanded: new Set([rootPath]), cache: new Map(), loading: new Set([rootPath]), selected: null });
				api.list(rootPath).then((res) => {
					if (cancelled) return;
					setTree((t) => {
						if (!t || t.rootPath !== rootPath) return t;
						const next = { ...t, loading: without(t.loading, rootPath) };
						if (res && res.error) next.selected = null;
						else next.cache = new Map(t.cache).set(rootPath, (res && res.entries) || []);
						return next;
					});
				}).catch(() => {
					if (!cancelled) setTree((t) => t ? { ...t, loading: without(t.loading, rootPath) } : t);
				});
				return () => { cancelled = true };
			}, [rootPath]);

			react.useEffect(() => {
				const root = document.documentElement;
				if (s.open) root.setAttribute('data-cg-panel-open', '');
				else root.removeAttribute('data-cg-panel-open');
				return () => { root.removeAttribute('data-cg-panel-open') };
			}, [s.open]);
			react.useEffect(() => {
				const root = document.documentElement;
				// 内容避让量跟随面板实际显示宽度(窗口变小时不会多让)
				root.style.setProperty('--cg-width', Math.min(s.width, panelMaxW()) + 'px');
			}, [s.width]);
			// 窗口变窄时把面板宽度收回上限内,避免面板超出屏幕
			react.useEffect(() => {
				const onWin = () => {
					const maxW = panelMaxW();
					if (store.width > maxW) { store.width = maxW; emit(); }
				};
				window.addEventListener('resize', onWin);
				return () => window.removeEventListener('resize', onWin);
			}, []);
			react.useEffect(() => () => {
				if (flashTimerRef.current !== null) clearTimeout(flashTimerRef.current);
				if (itemFlashTimerRef.current !== null) clearTimeout(itemFlashTimerRef.current);
				if (jumpLineTimerRef.current !== null) clearTimeout(jumpLineTimerRef.current);
			}, []);
			// Alt+←/→:跳转历史前进/后退(面板打开期间接管浏览器前进后退)
			react.useEffect(() => {
				const onKey = (e) => {
					if (!s.open) return;
					if (!e.altKey || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
					e.preventDefault();
					const arr = jumpHistoryRef.current;
					if (arr.length === 0) return;
					let idx = jumpIndexRef.current;
					if (e.key === 'ArrowLeft') idx = Math.max(0, idx - 1);
					else idx = Math.min(arr.length - 1, idx + 1);
					if (idx === jumpIndexRef.current) return;
					jumpIndexRef.current = idx;
					lastFocusRef.current = arr[idx];
					jumpToLine(arr[idx]);
					flashJumpLine(arr[idx]);
				};
				window.addEventListener('keydown', onKey, true);
				return () => window.removeEventListener('keydown', onKey, true);
			}, [s.open]);

			const loadChildren = (path) => {
				api.list(path).then((res) => {
					setTree((t) => {
						if (!t) return t;
						const cache = new Map(t.cache);
						if (res && !res.error) cache.set(path, (res && res.entries) || []);
						return { ...t, cache, loading: without(t.loading, path) };
					});
				}).catch(() => {
					setTree((t) => t ? { ...t, loading: without(t.loading, path) } : t);
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

			const applyExplainResult = (path, res) => {
				setFile((f) => {
					if (!f || f.path !== path) return f;
					if (res && res.error) return { ...f, explaining: false, explainError: res.error };
					return { ...f, explaining: false, functions: res.functions || [], callGraph: res.callGraph || '', model: res.model || '', warnings: res.warnings || [], chunks: res.chunks || 0 };
				});
			};
			const failExplain = (path, err) => {
				setFile((f) => f && f.path === path ? { ...f, explaining: false, explainError: String((err && err.message) || err) } : f);
			};

			const openFile = (entry) => {
				setTree((t) => t ? { ...t, selected: entry.path } : t);
				setActive(null);
				setFlash(null);
				setJumpLine(null);
				if (flashTimerRef.current !== null) { clearTimeout(flashTimerRef.current); flashTimerRef.current = null }
				if (itemFlashTimerRef.current !== null) { clearTimeout(itemFlashTimerRef.current); itemFlashTimerRef.current = null }
				if (jumpLineTimerRef.current !== null) { clearTimeout(jumpLineTimerRef.current); jumpLineTimerRef.current = null }
				// 切换文件后,旧文件的跳转历史不再有意义
				jumpHistoryRef.current = [];
				jumpIndexRef.current = -1;
				lastFocusRef.current = null;
				cardRefs.current = [];
				setFile({ path: entry.path, name: entry.name, reading: true, explaining: false });
				// 点击文件只读源码、立刻显示;解读由用户点 ✨ 图标才触发
				api.read(entry.path).then((res) => {
					setFile((f) => {
						if (!f || f.path !== entry.path) return f;
						if (res && res.error) return { ...f, reading: false, error: res.error };
						if (res && res.tooLarge) return { ...f, reading: false, tooLarge: true, size: res.size };
						return { ...f, reading: false, content: res.content, size: res.size };
					});
				}).catch((err) => {
					setFile((f) => f && f.path === entry.path ? { ...f, reading: false, error: String((err && err.message) || err) } : f);
				});
			};

			// ✨ 按钮开关:无解读 → 展开板块并生成;已有解读 → 收起板块(数据保留,再点秒开)
			const toggleExplain = () => {
				if (!file || file.reading || file.error || file.tooLarge) return;
				if (file.guideOn) {
					setFile((f) => ({ ...f, guideOn: false }));
					return;
				}
				if (file.explaining) {
					// 生成仍在进行:只展开板块等结果,不重复请求
					setFile((f) => ({ ...f, guideOn: true }));
					return;
				}
				if (Array.isArray(file.functions)) {
					// 已有解读结果:直接展开,不重新请求
					setFile((f) => ({ ...f, guideOn: true }));
					return;
				}
				setFile((f) => ({ ...f, guideOn: true, explaining: true, explainError: null, warnings: [] }));
				api.explain(file.path, false).then((res) => applyExplainResult(file.path, res)).catch((err) => failExplain(file.path, err));
			};
			const reExplain = () => {
				if (!file || file.explaining) return;
				setFile((f) => ({ ...f, guideOn: true, explaining: true, explainError: null, warnings: [] }));
				api.explain(file.path, true).then((res) => applyExplainResult(file.path, res)).catch((err) => failExplain(file.path, err));
			};

			const lineFuncAt = (lineNo) => {
				if (!file || !file.functions) return null;
				for (let i = 0; i < file.functions.length; i++) {
					const f = file.functions[i];
					if (lineNo >= f.start && lineNo <= f.end) return i;
				}
				return null;
			};

			const jumpToLine = (start) => {
				const pane = codePaneRef.current;
				if (!pane) return;
				const lines = pane.querySelectorAll('.cg-line');
				const el = lines[Math.min(Math.max(start - 1, 0), lines.length - 1)];
				if (!el) return;
				// 用目标行相对滚动容器视口的坐标差计算,避免 offsetTop 相对
				// 定位祖先(fixed 面板)多算头部高度导致的滚动偏移
				const delta = el.getBoundingClientRect().top - pane.getBoundingClientRect().top;
				pane.scrollTo({ top: pane.scrollTop + delta - pane.clientHeight * 0.2 });
			};

			// 目标行闪烁 1.5s(跳转定位反馈)
			const flashJumpLine = (line) => {
				const seq = Date.now();
				setJumpLine({ line, seq });
				if (jumpLineTimerRef.current !== null) clearTimeout(jumpLineTimerRef.current);
				jumpLineTimerRef.current = setTimeout(() => {
					jumpLineTimerRef.current = null;
					setJumpLine((j) => (j && j.seq === seq ? null : j));
				}, 1500);
			};
			// 当前滚动位置折算行号(动态取实际行高,字号调整后依然准确)
			const currentLineOf = () => {
				const pane = codePaneRef.current;
				if (!pane) return 1;
				const el = pane.querySelector('.cg-line');
				const lineH = el ? (el.getBoundingClientRect().height || 21) : 21;
				return Math.max(1, Math.round(pane.scrollTop / lineH) + 1);
			};
			// 所有跳转统一入口:记录出发点+落点入历史栈 → 滚动定位 → 目标行闪烁。
			// 出发点优先取"最近交互行"(用户实际点击的那行),没有才用滚动位置折算
			const navigateTo = (line, from) => {
				const arr = jumpHistoryRef.current;
				const idx = jumpIndexRef.current;
				const origin = from !== undefined && from !== null ? from : (lastFocusRef.current !== null ? lastFocusRef.current : currentLineOf());
				arr.length = idx + 1; // 截断"前进"分支
				if (arr[arr.length - 1] !== origin) arr.push(origin);
				if (arr[arr.length - 1] !== line) arr.push(line);
				jumpIndexRef.current = arr.length - 1;
				lastFocusRef.current = line;
				jumpToLine(line);
				flashJumpLine(line);
			};
			// Ctrl+点击标识符 → 跳转到其定义:优先用已解析的函数表(签名已校正),
			// 否则正则回退 def/class/function/const 等定义行
			const jumpToDef = (name, fromLine) => {
				if (!file || !file.content) return;
				const fns = file.functions || [];
				const hit = fns.find((f) => f.name === name || String(f.name).split('.').pop() === name);
				if (hit) { navigateTo(hit.start, fromLine); return }
				const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
				const defRe = new RegExp('(?:^|\\s)(?:def|class)\\s+' + esc + '\\b|(?:^|\\s)' + esc + '\\s*=|(?:^|\\s)(?:function|const|let|var)\\s+' + esc + '\\b');
				const lines = String(file.content).replace(/\r\n/g, '\n').split('\n');
				for (let i = 0; i < lines.length; i++) {
					if (defRe.test(lines[i])) { navigateTo(i + 1, fromLine); return }
				}
			};

			const onCardClick = (i, e) => {
				// 点击的是变量名时,交给变量定位逻辑,不重复跳转函数
				if (e.target.closest('.cg-var')) return;
				setActive(i);
				if (file && file.functions && file.functions[i]) navigateTo(file.functions[i].start);
			};

			// 多级回退搜索变量出现行:函数范围内精确匹配 → 函数范围内首标识符 →
			// 全文件精确匹配 → 全文件首标识符。保证尽量跳转到
			const findVarLine = (name, start, end, lines) => {
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

			// 点击解读中的变量名:定位到首次出现处并闪烁全部出现位置
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
				const lines = String(file.content || '').replace(/\r\n/g, '\n').split('\n');
				const hitLine = findVarLine(name, fn.start, Math.max(fn.end, fn.start), lines);
				const seq = Date.now();
				setActive(idx);
				setFlash({ name, funcIndex: idx, seq });
				if (hitLine > 0) navigateTo(hitLine);
				if (flashTimerRef.current !== null) clearTimeout(flashTimerRef.current);
				flashTimerRef.current = setTimeout(() => {
					flashTimerRef.current = null;
					setFlash((f) => (f && f.seq === seq ? null : f));
				}, 1500);
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

			// 看代码 → 点代码行 → 解读卡片中"对应的解读项"闪烁 1 次(底色 1.5 秒)
			// 新数据:按模型给出的步骤行号范围精确命中;旧数据(无步骤行号):
			// 标识符匹配流程步骤,匹配不到再按位置比例在步骤间选
			const flashGuideItem = (idx, lineNo) => {
				const guideEl = guideRef.current;
				const card = guideEl ? guideEl.querySelector('.cg-card[data-idx="' + idx + '"]') : null;
				if (!card) return;
				const fn = file && file.functions ? file.functions[idx] : null;
				const lis = card.querySelectorAll('.cg-card-flow-md li');
				const steps = fn ? stepsOf(fn) : null;
				let el = null;
				if (steps) {
					// 有行号范围的步骤:精确命中;行不在任何步骤内(如 def 行)→ 主介绍
					for (let j = 0; j < steps.length; j++) {
						if (steps[j].start > 0 && steps[j].end >= steps[j].start && lineNo >= steps[j].start && lineNo <= steps[j].end) { el = lis[j] || null; break }
					}
					if (!el) {
						// 行不在任何步骤内(空隙行):标识符匹配,匹配不到按位置比例选
						const lines = file ? String(file.content || '').replace(/\r\n/g, '\n').split('\n') : [];
						el = matchStepByTokens(lis, lines[lineNo - 1] || '');
						if (!el && lis.length > 0) {
							const ratio = (lineNo - fn.start) / Math.max(1, fn.end - fn.start + 1);
							el = lis[Math.min(lis.length - 1, Math.floor(ratio * lis.length))];
						}
						if (!el) el = card.querySelector('.cg-card-summary');
					}
				} else {
					const lines = file ? String(file.content || '').replace(/\r\n/g, '\n').split('\n') : [];
					el = matchStepByTokens(lis, lines[lineNo - 1] || '');
					if (!el && lis.length > 0 && fn) {
						const ratio = (lineNo - fn.start) / Math.max(1, fn.end - fn.start + 1);
						el = lis[Math.min(lis.length - 1, Math.floor(ratio * lis.length))];
					}
					if (!el) el = card.querySelector('.cg-card-summary');
				}
				el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
				el.classList.remove('cg-item-flash');
				void el.offsetWidth;
				el.classList.add('cg-item-flash');
				if (itemFlashTimerRef.current !== null) clearTimeout(itemFlashTimerRef.current);
				itemFlashTimerRef.current = setTimeout(() => {
					itemFlashTimerRef.current = null;
					el.classList.remove('cg-item-flash');
				}, 1500);
			};

			// 等宽字体字符宽度(把点击横坐标折算成行内字符偏移)
			let charWidthCache = null;
			const charWidth = () => {
				if (charWidthCache === null) {
					const ctx = document.createElement('canvas').getContext('2d');
					ctx.font = '14px ui-monospace, SFMono-Regular, Consolas, monospace';
					charWidthCache = ctx.measureText('M').width || 8.4;
				}
				return charWidthCache;
			};
			// 行号栏到代码文本起点的实际距离:动态测量(行号栏 sticky 不随横向
			// 滚动,代码文本随滚动偏移,两者差值恒定,且不随字号/栏宽调整失效)
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
				// Ctrl/⌘+点击:跳转到所点标识符的定义处
				if (e && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
					const pane = codePaneRef.current;
					if (pane) {
						const rect = pane.getBoundingClientRect();
						const col = Math.floor((e.clientX - rect.left + pane.scrollLeft - gutterOf(pane)) / charWidth());
						const lines = file && file.content ? String(file.content).replace(/\r\n/g, '\n').split('\n') : [];
						const word = col >= 0 && lines[lineNo - 1] !== undefined ? wordAtCol(lines[lineNo - 1], col) : null;
						if (word) { jumpToDef(word, lineNo); return }
					}
				}
				const i = lineFuncAt(lineNo);
				setActive(i);
				if (i !== null) {
					setTab('guide');
					// 等解读页渲染完成后再定位并闪烁对应解读项
					setTimeout(() => flashGuideItem(i, lineNo), 80);
				}
			};

			// 面板左缘拖动:向左拖变宽(最宽到接近全宽);拖到最右侧阈值以下松手 → 收起面板
			const onResizeStart = (e) => {
				e.preventDefault();
				setDrag({ kind: 'outer', startX: e.clientX, startWidth: s.width });
			};
			// 分栏线拖动:记录起点与当时各窗像素宽度,移动时折算回比例存 store
			const onDividerStart = (kind) => (e) => {
				e.preventDefault();
				const w = paneWidths(s.width, s.paneR);
				setDrag({ kind, startX: e.clientX, startPanelW: s.width, startMainW: w.mainW, startCodeW: w.codeW, startTreeW: w.treeW });
			};
			const onResizeMove = (e) => {
				if (!drag) return;
				if (drag.kind === 'outer') {
					// drag the LEFT edge of a RIGHT panel: moving left widens it
					store.width = Math.max(PANEL_COLLAPSE_W, Math.min(panelMaxW(), drag.startWidth + (drag.startX - e.clientX)));
				} else if (drag.kind === 'code') {
					const w = Math.max(PANE_MIN_CODE, Math.min(drag.startCodeW + (e.clientX - drag.startX), drag.startMainW - PANE_MIN_GUIDE));
					store.paneR = { ...store.paneR, code: w / drag.startMainW };
				} else if (drag.kind === 'tree') {
					// 分栏线在文件树左侧:向左拖 → 文件树变宽
					const w = Math.max(PANE_MIN_TREE, Math.min(drag.startTreeW - (e.clientX - drag.startX), Math.max(PANE_MIN_TREE, drag.startPanelW - (PANE_MIN_CODE + PANE_MIN_GUIDE + PANE_DIV_W))));
					store.paneR = { ...store.paneR, tree: w / drag.startPanelW };
				}
				emit();
			};
			const endDrag = () => {
				if (drag) {
					if (drag.kind === 'outer') {
						if (store.width <= PANEL_COLLAPSE_W) {
							// 拖到最右侧 → 收起面板,并保留收起前的宽度供下次打开
							setOpen(false);
							store.width = drag.startWidth;
						} else {
							store.width = Math.max(PANEL_MIN_W, store.width);
						}
					}
					try {
						localStorage.setItem('cg-panel-w', String(store.width));
						localStorage.setItem('cg-code-r', String(store.paneR.code));
						localStorage.setItem('cg-tree-r', String(store.paneR.tree));
					} catch (_) { /* 忽略存储失败 */ }
				}
				setDrag(null);
			};

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
					react.createElement('span', { style: { display: 'flex', flex: 'none' } }, react.createElement(Icon, { name: 'folder', size: 13 })),
					react.createElement('span', { className: 'cg-trow-name cg-trow-dir' }, tree.rootName || tree.rootPath),
				));
				if (tree.expanded.has(tree.rootPath)) {
					const children = tree.cache.get(tree.rootPath);
					if (children) {
						for (const child of children) {
							rows.push(react.createElement(TreeNode, { key: child.path, entry: child, depth: 1, tree, onToggle: toggleDir, onOpen: openFile }));
						}
					}
				}
				return rows;
			};

			const renderCode = () => {
				if (!file) return react.createElement('div', { className: 'cg-empty' }, '在最右侧文件栏选择要陪读的代码文件');
				if (file.reading) return react.createElement('div', { className: 'cg-empty' }, '源码读取中…');
				if (file.error) return react.createElement('div', { className: 'cg-error' }, '源码读取失败：\n' + file.error);
				if (file.tooLarge) return react.createElement('div', { className: 'cg-empty' }, '文件过大（' + (file.size || 0) + ' 字节），暂不支持陪读');
				const lines = String(file.content || '').replace(/\r\n/g, '\n').split('\n');
				const truncated = lines.length > MAX_LINES;
				const shown = lines.slice(0, MAX_LINES);
				// 变量闪烁:先用占位符把目标区间内的出现处包住,高亮完成后再替换为
				// <mark>,避免正则直接作用于 HTML(会误伤 class 属性里的片段)
				const flashFn = flash && file && file.functions ? file.functions[flash.funcIndex] : null;
				let markedLines = shown;
				if (flashFn && flash && flash.name) {
					const escName = flash.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
					const re = new RegExp('(?<![A-Za-z0-9_$])(' + escName + ')(?![A-Za-z0-9_$])', 'g');
					markedLines = shown.map((line, idx) => {
						const lineNo = idx + 1;
						return (lineNo >= flashFn.start && lineNo <= flashFn.end) ? line.replace(re, '\u0001$1\u0002') : line;
					});
				}
				// 语法高亮:整段一次高亮(保证跨行注释/字符串颜色连续),再按行切分补齐 span
				const lang = file && file.name ? hlLangFor(file.name) : '';
				const html = lang && lang !== 'markdown' && lang !== 'text' ? highlight(markedLines.join('\n'), lang) : escapeHtml(markedLines.join('\n'));
				const lineHtmls = splitHighlighted(html).slice(0, MAX_LINES);
				const els = [];
				for (let i = 0; i < lineHtmls.length; i++) {
					const lineNo = i + 1;
					const fi = lineFuncAt(lineNo);
					els.push(react.createElement('div', {
						key: lineNo,
						className: 'cg-line' + (active !== null && fi === active ? ' cg-line-hi' : '') + (jumpLine && jumpLine.line === lineNo ? ' cg-line-jump' : ''),
						onClick: (e) => onLineClick(lineNo, e),
					},
						react.createElement('span', { className: 'cg-ln' }, lineNo),
						react.createElement('span', {
							className: 'cg-code-text cg-hl',
							dangerouslySetInnerHTML: { __html: lineHtmls[i].replace(/\u0001/g, '<mark class="cg-var-hit">').replace(/\u0002/g, '</mark>') },
						}),
					));
				}
				return react.createElement('div', { className: 'cg-code', ref: codePaneRef }, els, truncated ? react.createElement('div', { className: 'cg-empty' }, '文件较长，仅显示前 ' + MAX_LINES + ' 行') : null);
			};

			const renderGuide = () => {
				if (!file) return react.createElement('div', { className: 'cg-empty' }, '选择文件后，这里逐函数给出通俗解读');
				if (file.reading) return react.createElement('div', { className: 'cg-empty' }, '源码读取中…');
				if (file.explaining) return react.createElement('div', { className: 'cg-empty' }, 'AI 解读生成中…');
				if (file.explainError) return react.createElement('div', { className: 'cg-error' }, '解读失败：\n' + file.explainError + '\n\n可点击右上角「重新解读」重试');
				if (file.error || file.tooLarge) return null;
				const fns = file.functions || [];
				if (fns.length === 0) {
					return react.createElement('div', null,
						file.warnings && file.warnings.length > 0 ? react.createElement('div', { className: 'cg-error', style: { padding: '8px 12px' } }, '⚠ ' + file.warnings.join('\n')) : null,
						react.createElement('div', { className: 'cg-empty' }, '没有识别到函数。若这是代码文件，点右上角「重新解读」重试'),
					);
				}
				return react.createElement('div', { className: 'cg-guide', ref: guideRef, onClick: onGuideClick },
					file.warnings && file.warnings.length > 0 ? react.createElement('div', { className: 'cg-error', style: { padding: '4px 2px 8px' } }, '⚠ ' + file.warnings.length + ' 组函数解读失败，可点击「重新解读」\n' + file.warnings[0]) : null,
					fns.map((f, i) => {
						const steps = stepsOf(f);
						const legacyHtml = !steps && f.flow ? renderFlowMd(f.flow) : '';
						const flowBroken = !steps && !!f.flow && (!legacyHtml || legacyHtml.includes('[object Object]'));
						return react.createElement('div', {
							key: i,
							className: 'cg-card' + (active === i ? ' cg-card-on' : ''),
							'data-idx': i,
							ref: (el) => { cardRefs.current[i] = el },
							onClick: (e) => onCardClick(i, e),
						},
							react.createElement('div', { className: 'cg-card-head' },
								react.createElement('span', { className: 'cg-card-name' }, f.name),
								react.createElement('span', { className: 'cg-card-lines' }, f.end > f.start ? 'L' + f.start + ' – L' + f.end : 'L' + f.start),
							),
							react.createElement('div', { className: 'cg-card-summary' }, f.summary),
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

			// 调用图节点点击:直接定位到对应代码行并高亮,不切换标签页
			const onGraphNodeClick = (rawLabel) => {
				if (!file || !file.functions) return;
				const compact = (s) => String(s || '').replace(/\s+/g, '');
				const needle = compact(rawLabel);
				const i = file.functions.findIndex((f) => compact(f.name) === needle);
				if (i < 0) return;
				setActive(i);
				navigateTo(file.functions[i].start);
			};

			const renderCallGraph = () => {
				if (!file) return react.createElement('div', { className: 'cg-empty' }, '选择文件后生成调用图');
				if (file.explaining) return react.createElement('div', { className: 'cg-empty' }, '生成中…');
				if (!file.callGraph) return react.createElement('div', { className: 'cg-empty' }, '该文件没有生成调用图');
				return react.createElement(GraphView, { code: file.callGraph, onNodeClick: onGraphNodeClick });
			};

			if (!s.open) return null;
			// 拖动中且已过收起阈值:高亮收起把手,提示"松手收起"
			const collapsing = !!drag && drag.kind === 'outer' && s.width <= PANEL_COLLAPSE_W;
			const collapseTab = react.createElement('button', {
				className: 'cg-collapse-tab' + (collapsing ? ' cg-collapse-tab-on' : ''),
				title: collapsing ? '松开收起' : '收起代码陪读',
				'aria-label': '收起代码陪读',
				onClick: () => setOpen(false),
			}, react.createElement(Icon, { name: 'chevronRight', size: 14 }));
			const widths = paneWidths(Math.min(s.width, panelMaxW()), s.paneR);
			const panel = react.createElement('div', { className: 'cg-panel', style: { width: Math.min(s.width, panelMaxW()) + 'px' } },
				react.createElement('div', { className: 'cg-resize', title: '拖动调整宽度 · 拖到最右侧收起', onPointerDown: onResizeStart }),
				collapseTab,
				react.createElement('div', { className: 'cg-header' },
					react.createElement('span', { className: 'cg-title' }, '代码陪读'),
					file && file.guideOn && !file.explaining && !file.error && !file.tooLarge ? react.createElement('button', { className: 'cg-iconbtn', title: '重新解读', onClick: reExplain }, react.createElement(Icon, { name: 'refresh', size: 14 })) : null,
					react.createElement('button', { className: 'cg-iconbtn', title: '关闭', onClick: () => setOpen(false) }, react.createElement(Icon, { name: 'close', size: 14 })),
				),
				react.createElement('div', { className: 'cg-body' },
					react.createElement('div', { className: 'cg-main' },
						react.createElement('div', { className: 'cg-split' },
							react.createElement('div', { className: 'cg-code-pane', style: file && file.guideOn ? { width: widths.codeW + 'px' } : { flex: '1 1 auto' } },
								react.createElement('div', { className: 'cg-pane-head' },
									react.createElement('span', { className: 'cg-pane-title' }, '源码'),
									react.createElement('span', { className: 'cg-pane-path' }, file ? file.path : ''),
									file && !file.reading && !file.error && !file.tooLarge
										? react.createElement('button', {
											className: 'cg-pane-act' + (file.guideOn ? ' cg-pane-act-on' : ''),
											title: file.guideOn ? '取消解读' : '解读',
											onClick: toggleExplain,
										}, react.createElement(Icon, { name: 'sparkle', size: 13 }))
										: null,
								),
								renderCode(),
							),
							file && file.guideOn ? react.createElement('div', { className: 'cg-divider' + (drag && drag.kind === 'code' ? ' cg-divider-on' : ''), title: '拖动调整源码/解读宽度', onPointerDown: onDividerStart('code') }) : null,
							file && file.guideOn ? react.createElement('div', { className: 'cg-guide-pane' },
								react.createElement('div', { className: 'cg-tabs' },
									react.createElement('button', { className: 'cg-tab' + (tab === 'guide' ? ' cg-tab-on' : ''), onClick: () => setTab('guide') }, '函数解读'),
									react.createElement('button', { className: 'cg-tab' + (tab === 'graph' ? ' cg-tab-on' : ''), onClick: () => setTab('graph') }, '调用图'),
								),
								tab === 'guide' ? renderGuide() : renderCallGraph(),
							) : null,
						),
						react.createElement('div', { className: 'cg-meta' },
							file && !file.error ? (
								file.explaining ? '解读生成中…' :
								!file.guideOn ? '源码已加载 · 点 ✨ 开始解读' :
								(file.model ? '模型 ' + file.model + ' · ' : '') + (file.functions || []).length + ' 个函数' + (file.chunks && file.chunks > 1 ? ' · 分 ' + file.chunks + ' 组解读' : '')
							) : '就绪',
						),
					),
					react.createElement('div', { className: 'cg-divider' + (drag && drag.kind === 'tree' ? ' cg-divider-on' : ''), title: '拖动调整文件树宽度', onPointerDown: onDividerStart('tree') }),
					react.createElement('div', { className: 'cg-tree', style: { width: widths.treeW + 'px' } }, renderTree()),
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
			ctx.effect(() => () => { styleEl.remove() }, 'code-guide: styles');

			const slots = ctx.get('slots');
			if (slots === undefined) return;
			slots.inject('shell.overlay', () => slots.register(
				{ name: 'shell.overlay', id: 'code-guide', order: 100, label: '代码陪读' },
				(props) => react.createElement(GuidePanel, props),
			));
			slots.inject('conversation.session.header.utilities', () => slots.register(
				{ name: 'conversation.session.header.utilities', id: 'code-guide-toggle', order: 20, label: '代码陪读' },
				(props) => react.createElement(ToggleButton, props),
			));
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
