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
  max-width: 78vw; min-width: 420px;
  pointer-events: auto;
  box-sizing: border-box;
}
.cg-panel * { box-sizing: border-box; }
.cg-resize {
  position: absolute; left: -4px; top: 0; bottom: 0; width: 8px;
  cursor: col-resize; z-index: 5;
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
  width: 170px; flex: none; overflow: auto;
  border-right: 1px solid var(--dsw-alias-border-l1);
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
.cg-code-pane { flex: 1 1 50%; display: flex; flex-direction: column; min-width: 0; }
.cg-pane-head {
  display: flex; align-items: center; gap: 6px;
  padding: 4px 8px; flex: none;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-secondary); font-size: 12px;
}
.cg-pane-head .cg-pane-title { font-weight: 600; color: var(--dsw-alias-label-primary); flex: none; }
.cg-pane-path { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; }
.cg-code {
  flex: 1; overflow: auto; margin: 0;
  font-family: ui-monospace, SFMono-Regular, Consolas, 'Courier New', monospace;
  font-size: 12px; line-height: 18px;
  background: var(--dsw-alias-bg-layer-1);
}
.cg-line { display: flex; white-space: pre; min-width: max-content; cursor: pointer; }
.cg-line:hover { background: var(--dsw-alias-bg-layer-2); }
.cg-ln {
  flex: none; width: 46px; padding-right: 10px; text-align: right;
  color: var(--dsw-alias-label-secondary); user-select: none;
  border-right: 1px solid var(--dsw-alias-border-l1); margin-right: 10px;
  background: var(--dsw-alias-bg-overlay);
  position: sticky; left: 0;
}
.cg-code-text { padding-right: 14px; }
.cg-line-hi { background: var(--dsw-alias-interactive-bg-hover); }
.cg-line-hi .cg-ln { color: var(--dsw-alias-brand-primary); font-weight: 700; }
.cg-guide-pane { flex: 1 1 50%; display: flex; flex-direction: column; min-width: 0; border-left: 1px solid var(--dsw-alias-border-l1); }
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
  padding: 2px 10px; flex: none;
  border: 1px solid var(--dsw-alias-border-l2); border-radius: 5px;
  background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary);
  font-size: 12px; cursor: pointer;
}
.cg-gbtn:hover { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); }
.cg-graph-hint { margin-left: auto; color: var(--dsw-alias-label-secondary); font-size: 11px; }
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
					react.createElement('button', { className: 'cg-gbtn', title: '复位视图', onClick: reset }, '复位'),
					react.createElement('button', { className: 'cg-gbtn', title: '复制 mermaid 源码', onClick: onCopy }, copied ? '已复制' : '复制 mermaid'),
					react.createElement('span', { className: 'cg-graph-hint' }, '点击节点定位函数 · Alt+拖动平移 · 滚轮缩放'),
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
		const store = {
			open: false,
			width: 680,
			listeners: new Set(),
		};
		const emit = () => { for (const fn of Array.from(store.listeners)) fn() };
		const subscribe = (fn) => { store.listeners.add(fn); return () => { store.listeners.delete(fn) } };
		const setOpen = (value) => { store.open = !!value; emit() };
		const toggleOpen = () => setOpen(!store.open);
		const useStore = () => {
			const [, setTick] = react.useState(0);
			react.useEffect(() => subscribe(() => setTick((x) => x + 1)), []);
			return store;
		};

		// ---------- icons ----------
		const iconPaths = {
			chevronDown: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z',
			chevronRight: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
			close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
			refresh: 'M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 7.73 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z',
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
				root.style.setProperty('--cg-width', s.width + 'px');
			}, [s.width]);
			react.useEffect(() => () => {
				if (flashTimerRef.current !== null) clearTimeout(flashTimerRef.current);
				if (itemFlashTimerRef.current !== null) clearTimeout(itemFlashTimerRef.current);
			}, []);

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
				if (flashTimerRef.current !== null) { clearTimeout(flashTimerRef.current); flashTimerRef.current = null }
				if (itemFlashTimerRef.current !== null) { clearTimeout(itemFlashTimerRef.current); itemFlashTimerRef.current = null }
				cardRefs.current = [];
				setFile({ path: entry.path, name: entry.name, reading: true, explaining: true });
				// 源码与解读完全独立:源码直接读文件、立刻显示;解读异步生成
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
				api.explain(entry.path, false).then((res) => applyExplainResult(entry.path, res)).catch((err) => failExplain(entry.path, err));
			};

			const reExplain = () => {
				if (!file || file.explaining) return;
				setFile((f) => ({ ...f, explaining: true, explainError: null, warnings: [] }));
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
				if (el) pane.scrollTo({ top: el.offsetTop - pane.clientHeight * 0.2 });
			};

			const onCardClick = (i, e) => {
				// 点击的是变量名时,交给变量定位逻辑,不重复跳转函数
				if (e.target.closest('.cg-var')) return;
				setActive(i);
				if (file && file.functions && file.functions[i]) jumpToLine(file.functions[i].start);
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
				if (hitLine > 0) jumpToLine(hitLine);
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

			const onLineClick = (lineNo) => {
				const i = lineFuncAt(lineNo);
				setActive(i);
				if (i !== null) {
					setTab('guide');
					// 等解读页渲染完成后再定位并闪烁对应解读项
					setTimeout(() => flashGuideItem(i, lineNo), 80);
				}
			};

			const onResizeStart = (e) => {
				e.preventDefault();
				setDrag({ startX: e.clientX, startWidth: s.width });
			};
			const onResizeMove = (e) => {
				if (!drag) return;
				// drag the LEFT edge of a RIGHT panel: moving left widens it
				store.width = Math.max(420, Math.min(1400, drag.startWidth + (drag.startX - e.clientX)));
				emit();
			};
			const endDrag = () => setDrag(null);

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
				if (!file) return react.createElement('div', { className: 'cg-empty' }, '在左侧选择要陪读的代码文件');
				if (file.reading) return react.createElement('div', { className: 'cg-empty' }, '源码读取中…');
				if (file.error) return react.createElement('div', { className: 'cg-error' }, '源码读取失败：\n' + file.error);
				if (file.tooLarge) return react.createElement('div', { className: 'cg-empty' }, '文件过大（' + (file.size || 0) + ' 字节），暂不支持陪读');
				const lines = String(file.content || '').replace(/\r\n/g, '\n').split('\n');
				const truncated = lines.length > MAX_LINES;
				const shown = lines.slice(0, MAX_LINES);
				const flashFn = flash && file && file.functions ? file.functions[flash.funcIndex] : null;
				const flashRe = flashFn ? new RegExp('(?<![A-Za-z0-9_$])' + flash.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![A-Za-z0-9_$])', 'g') : null;
				const els = [];
				for (let i = 0; i < shown.length; i++) {
					const lineNo = i + 1;
					const fi = lineFuncAt(lineNo);
					const inFlash = flashRe !== null && flashFn !== null && lineNo >= flashFn.start && lineNo <= flashFn.end;
					let codeEl;
					if (inFlash) {
						const parts = [];
						let last = 0;
						let m;
						let k = 0;
						while ((m = flashRe.exec(shown[i])) !== null) {
							if (m.index > last) parts.push(shown[i].slice(last, m.index));
							parts.push(react.createElement('mark', { key: 'm' + k++, className: 'cg-var-hit' }, m[0]));
							last = m.index + m[0].length;
						}
						parts.push(shown[i].slice(last));
						codeEl = react.createElement('span', { className: 'cg-code-text' }, ...parts);
					} else {
						codeEl = react.createElement('span', { className: 'cg-code-text' }, shown[i]);
					}
					els.push(react.createElement('div', {
						key: lineNo,
						className: 'cg-line' + (active !== null && fi === active ? ' cg-line-hi' : ''),
						onClick: () => onLineClick(lineNo),
					},
						react.createElement('span', { className: 'cg-ln' }, lineNo),
						codeEl,
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
					react.createElement('div', { className: 'cg-empty', style: { padding: '4px 2px 8px' } }, '看代码 → 点代码行 → 对应解读项闪烁；点卡片/变量名反向定位'),
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
				jumpToLine(file.functions[i].start);
			};

			const renderCallGraph = () => {
				if (!file) return react.createElement('div', { className: 'cg-empty' }, '选择文件后生成调用图');
				if (file.explaining) return react.createElement('div', { className: 'cg-empty' }, '生成中…');
				if (!file.callGraph) return react.createElement('div', { className: 'cg-empty' }, '该文件没有生成调用图');
				return react.createElement(GraphView, { code: file.callGraph, onNodeClick: onGraphNodeClick });
			};

			if (!s.open) return null;
			const collapseTab = react.createElement('button', {
				className: 'cg-collapse-tab',
				title: '收起代码陪读',
				'aria-label': '收起代码陪读',
				onClick: () => setOpen(false),
			}, react.createElement(Icon, { name: 'chevronRight', size: 14 }));
			const panel = react.createElement('div', { className: 'cg-panel', style: { width: s.width + 'px' } },
				react.createElement('div', { className: 'cg-resize', title: '拖动调整宽度', onPointerDown: onResizeStart }),
				collapseTab,
				react.createElement('div', { className: 'cg-header' },
					react.createElement('span', { className: 'cg-title' }, '代码陪读'),
					file && !file.explaining && !file.error && !file.tooLarge ? react.createElement('button', { className: 'cg-iconbtn', title: '重新解读', onClick: reExplain }, react.createElement(Icon, { name: 'refresh', size: 14 })) : null,
					react.createElement('button', { className: 'cg-iconbtn', title: '关闭', onClick: () => setOpen(false) }, react.createElement(Icon, { name: 'close', size: 14 })),
				),
				react.createElement('div', { className: 'cg-body' },
					react.createElement('div', { className: 'cg-tree' }, renderTree()),
					react.createElement('div', { className: 'cg-main' },
						react.createElement('div', { className: 'cg-split' },
							react.createElement('div', { className: 'cg-code-pane' },
								react.createElement('div', { className: 'cg-pane-head' },
									react.createElement('span', { className: 'cg-pane-title' }, '源码'),
									react.createElement('span', { className: 'cg-pane-path' }, file ? file.path : ''),
								),
								renderCode(),
							),
							react.createElement('div', { className: 'cg-guide-pane' },
								react.createElement('div', { className: 'cg-tabs' },
									react.createElement('button', { className: 'cg-tab' + (tab === 'guide' ? ' cg-tab-on' : ''), onClick: () => setTab('guide') }, '函数解读'),
									react.createElement('button', { className: 'cg-tab' + (tab === 'graph' ? ' cg-tab-on' : ''), onClick: () => setTab('graph') }, '调用图'),
								),
								tab === 'guide' ? renderGuide() : renderCallGraph(),
							),
						),
						react.createElement('div', { className: 'cg-meta' },
							file && !file.error ? (file.explaining ? '解读生成中…' : (file.model ? '模型 ' + file.model + ' · ' : '') + (file.functions || []).length + ' 个函数' + (file.chunks && file.chunks > 1 ? ' · 分 ' + file.chunks + ' 组解读' : '')) : '就绪',
						),
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
