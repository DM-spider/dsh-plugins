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
.cg-card-head { display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px; }
.cg-card-name { font-weight: 700; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 12.5px; color: var(--dsw-alias-brand-primary); word-break: break-all; }
.cg-card-lines { flex: none; color: var(--dsw-alias-label-secondary); font-size: 11px; }
.cg-card-summary { margin: 2px 0 6px; }
.cg-card-label { font-size: 11px; font-weight: 700; color: var(--dsw-alias-label-secondary); margin-top: 6px; }
.cg-card-flow { margin: 2px 0; color: var(--dsw-alias-label-primary); white-space: pre-wrap; }
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
		const renderMermaidInto = (el, code) => {
			if (!el) return;
			loadMermaidAsset().then((engine) => engine.renderMermaid(String(code))).then((svg) => {
				el.innerHTML = svg;
				const svgEl = el.querySelector('svg');
				if (svgEl) { svgEl.style.maxWidth = '100%'; svgEl.style.height = 'auto'; }
			}).catch((err) => {
				el.innerHTML = '<div class="cg-mermaid-error">Mermaid 渲染失败：' + escapeHtml(String((err && err.message) || err)) + '</div>'
					+ '<pre class="cg-mermaid-src">' + escapeHtml(String(code)) + '</pre>';
			});
		};
		const MermaidBlock = (props) => {
			const ref = react.useRef(null);
			react.useEffect(() => {
				const el = ref.current;
				if (!el) return;
				el.innerHTML = '<div class="cg-mermaid-pending">调用图渲染中…</div>';
				renderMermaidInto(el, props.code);
			}, [props.code]);
			return react.createElement('div', { className: 'cg-mermaid', ref });
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
			chevronLeft: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z',
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

			const openFile = (entry) => {
				setTree((t) => t ? { ...t, selected: entry.path } : t);
				setActive(null);
				cardRefs.current = [];
				setFile({ path: entry.path, name: entry.name, loading: true });
				api.explain(entry.path, false).then((res) => {
					setFile((f) => {
						if (!f || f.path !== entry.path) return f;
					if (res && res.error) return { ...f, loading: false, error: res.error };
					if (res && res.tooLarge) return { ...f, loading: false, tooLarge: true, size: res.size };
					return { ...f, loading: false, content: res.content, size: res.size, functions: res.functions || [], callGraph: res.callGraph || '', model: res.model || '', llmTruncated: !!res.llmTruncated };
					});
				}).catch((err) => {
					setFile((f) => f && f.path === entry.path ? { ...f, loading: false, error: String((err && err.message) || err) } : f);
				});
			};

			const reExplain = () => {
				if (!file || file.loading) return;
				setFile((f) => ({ ...f, loading: true, error: null }));
				api.explain(file.path, true).then((res) => {
					setFile((f) => {
						if (!f || f.path !== file.path) return f;
					if (res && res.error) return { ...f, loading: false, error: res.error };
					return { ...f, loading: false, content: res.content, size: res.size, functions: res.functions || [], callGraph: res.callGraph || '', model: res.model || '', llmTruncated: !!res.llmTruncated };
					});
				}).catch((err) => {
					setFile((f) => f && f.path === file.path ? { ...f, loading: false, error: String((err && err.message) || err) } : f);
				});
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

			const jumpToCard = (i) => {
				const el = cardRefs.current[i];
				if (el && guideRef.current) {
					el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
				}
			};

			const onCardClick = (i) => {
				setActive(i);
				if (file && file.functions && file.functions[i]) jumpToLine(file.functions[i].start);
			};

			const onLineClick = (lineNo) => {
				const i = lineFuncAt(lineNo);
				setActive(i);
				if (i !== null) jumpToCard(i);
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
				if (file.loading) return react.createElement('div', { className: 'cg-empty' }, 'AI 解读生成中…（首次约几秒到十几秒）');
				if (file.error) return react.createElement('div', { className: 'cg-error' }, '解读失败：\n' + file.error + '\n\n可点击右上角「重新解读」重试');
				if (file.tooLarge) return react.createElement('div', { className: 'cg-empty' }, '文件过大（' + (file.size || 0) + ' 字节），暂不支持陪读');
				const lines = String(file.content || '').replace(/\r\n/g, '\n').split('\n');
				const truncated = lines.length > MAX_LINES;
				const shown = lines.slice(0, MAX_LINES);
				const els = [];
				for (let i = 0; i < shown.length; i++) {
					const lineNo = i + 1;
					const fi = lineFuncAt(lineNo);
					els.push(react.createElement('div', {
						key: lineNo,
						className: 'cg-line' + (active !== null && fi === active ? ' cg-line-hi' : ''),
						onClick: () => onLineClick(lineNo),
					},
						react.createElement('span', { className: 'cg-ln' }, lineNo),
						react.createElement('span', { className: 'cg-code-text' }, shown[i]),
					));
				}
				return react.createElement('div', { className: 'cg-code', ref: codePaneRef }, els, truncated ? react.createElement('div', { className: 'cg-empty' }, '文件较长，仅显示前 ' + MAX_LINES + ' 行') : null);
			};

			const renderGuide = () => {
				if (!file) return react.createElement('div', { className: 'cg-empty' }, '选择文件后，这里逐函数给出通俗解读');
				if (file.loading) return react.createElement('div', { className: 'cg-empty' }, 'AI 解读生成中…');
				if (file.error || file.tooLarge) return null;
				const fns = file.functions || [];
				if (fns.length === 0) return react.createElement('div', { className: 'cg-empty' }, '没有识别到函数（可能是配置/文本类文件）');
				return react.createElement('div', { className: 'cg-guide', ref: guideRef },
					react.createElement('div', { className: 'cg-empty', style: { padding: '4px 2px 8px' } }, file.llmTruncated ? '文件很长，AI 解读仅覆盖文件前部分；点击卡片跳转代码' : '点击卡片跳转代码；点击代码行高亮对应解读'),
					fns.map((f, i) => react.createElement('div', {
						key: i,
						className: 'cg-card' + (active === i ? ' cg-card-on' : ''),
						ref: (el) => { cardRefs.current[i] = el },
						onClick: () => onCardClick(i),
					},
						react.createElement('div', { className: 'cg-card-head' },
							react.createElement('span', { className: 'cg-card-name' }, f.name),
							react.createElement('span', { className: 'cg-card-lines' }, 'L' + f.start + ' – L' + f.end),
						),
						react.createElement('div', { className: 'cg-card-summary' }, f.summary),
						f.flow ? react.createElement('div', { className: 'cg-card-label' }, '执行流程 / 数据流转') : null,
						f.flow ? react.createElement('div', { className: 'cg-card-flow' }, f.flow) : null,
						f.formula ? react.createElement('div', { className: 'cg-card-label' }, '关键公式 / 算法') : null,
						f.formula ? react.createElement('div', { className: 'cg-card-formula' }, f.formula) : null,
					)),
				);
			};

			const renderCallGraph = () => {
				if (!file) return react.createElement('div', { className: 'cg-empty' }, '选择文件后生成调用图');
				if (file.loading) return react.createElement('div', { className: 'cg-empty' }, '生成中…');
				if (!file.callGraph) return react.createElement('div', { className: 'cg-empty' }, '该文件没有生成调用图');
				return react.createElement(MermaidBlock, { code: file.callGraph });
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
					file && !file.loading && !file.error && !file.tooLarge ? react.createElement('button', { className: 'cg-iconbtn', title: '重新解读', onClick: reExplain }, react.createElement(Icon, { name: 'refresh', size: 14 })) : null,
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
							file && !file.loading && !file.error ? (file.model ? '模型 ' + file.model + ' · ' : '') + (file.functions || []).length + ' 个函数' : '就绪',
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
