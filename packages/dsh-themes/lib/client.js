window.__ModuleLoader__.load({
	id: "dsh-themes",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		var react = require("react");

		// ---------- 配色表 ----------
		// 每个 token 一对 { light, dark }:浅色档给 DSH 默认表达式(浅色观感
		// 完全不变),深色档给所选主题配色。覆盖层只作用于深色方案,
		// 设置里的「外观」选择与持久化偏好不受影响。
		// LIGHT 是全主题共用的浅色默认表达式;DARK_* 是各主题的深色色值。

		const LIGHT = {
			'--dsw-alias-bg-base': 'var(--dsw-static-neutral-bluish-00)',
			'--dsw-alias-bg-layer-1': 'var(--dsw-static-neutral-bluish-00)',
			'--dsw-alias-bg-layer-2': 'var(--dsw-static-neutral-bluish-00)',
			'--dsw-alias-bg-layer-3': 'var(--dsw-static-neutral-bluish-00)',
			'--dsw-alias-bg-overlay': 'var(--dsw-static-neutral-bluish-150)',
			'--dsw-alias-bg-module-platform': 'var(--dsw-static-neutral-bluish-60)',
			'--dsw-alias-bg-multi-select': 'var(--dsw-static-neutral-bluish-60)',
			'--dsw-alias-bg-skeleton': 'rgba(0, 0, 0, 0.04)',
			'--dsw-alias-border-l1': 'rgba(0, 0, 0, 0.04)',
			'--dsw-alias-border-l2': 'rgba(0, 0, 0, 0.1)',
			'--dsw-alias-border-l3': 'rgba(0, 0, 0, 0.12)',
			'--dsw-alias-border-l4': 'rgba(0, 0, 0, 0.16)',
			'--dsw-alias-brand-primary': 'var(--dsw-static-neutral-bluish-1000)',
			'--dsw-alias-brand-primary-invert': 'var(--dsw-static-neutral-bluish-1000)',
			'--dsw-alias-brand-primary-new-colorprimary-new-color': 'rgb(65, 118, 230)',
			'--dsw-alias-brand-text': 'var(--dsw-static-neutral-bluish-1000)',
			'--dsw-alias-state-business-primary': 'var(--dsw-static-deepseek-500)',
			'--dsw-alias-state-business-tertiary': 'var(--dsw-static-deepseek-100)',
			'--dsw-alias-button-contrast-fill': 'var(--dsw-static-neutral-bluish-700)',
			'--dsw-alias-button-elevated-fill': 'var(--dsw-static-neutral-bluish-00)',
			'--dsw-alias-button-floating-fill': 'var(--dsw-static-neutral-bluish-00)',
			'--dsw-alias-button-floating-hover': 'var(--dsw-static-neutral-bluish-75)',
			'--dsw-alias-button-ghost-active-border': 'var(--dsw-static-neutral-bluish-500)',
			'--dsw-alias-button-ghost-active-fill': 'var(--dsw-static-neutral-bluish-100)',
			'--dsw-alias-button-ghost-active-hover': 'var(--dsw-static-neutral-bluish-150)',
			'--dsw-alias-button-info-fill': 'var(--dsw-static-deepseek-500)',
			'--dsw-alias-button-info-hover': 'var(--dsw-static-deepseek-400)',
			'--dsw-alias-button-primary-dimmed': 'var(--dsw-static-neutral-bluish-100)',
			'--dsw-alias-button-primary-fill': 'var(--dsw-alias-brand-primary)',
			'--dsw-alias-button-primary-hover': 'var(--dsw-static-neutral-bluish-750)',
			'--dsw-alias-interactive-bg-active': 'rgba(38, 49, 72, 0.1)',
			'--dsw-alias-interactive-bg-hover': 'rgba(38, 49, 72, 0.06)',
			'--dsw-alias-interactive-bg-hover-accent': 'rgba(38, 49, 72, 0.14)',
			'--dsw-alias-interactive-bg-hover-solid': 'var(--dsw-static-neutral-bluish-75)',
			'--dsw-alias-label-caption': 'var(--dsw-static-neutral-bluish-400)',
			'--dsw-alias-label-dimmed': 'var(--dsw-static-neutral-bluish-200)',
			'--dsw-alias-label-primary': 'var(--dsw-static-neutral-bluish-1000)',
			'--dsw-alias-label-primary-bluish': 'var(--dsw-static-blue-900)',
			'--dsw-alias-label-primary-dimmed': 'var(--dsw-static-neutral-bluish-950)',
			'--dsw-alias-label-primary-foreground': 'var(--dsw-static-neutral-bluish-00)',
			'--dsw-alias-label-primary-inverted': 'var(--dsw-static-neutral-bluish-00)',
			'--dsw-alias-label-secondary': 'var(--dsw-static-neutral-bluish-700)',
			'--dsw-alias-label-tertiary': 'var(--dsw-static-neutral-bluish-600)',
			'--dsw-alias-markdown-citation': 'var(--dsw-static-neutral-bluish-100)',
			'--dsw-alias-markdown-code-block': 'var(--dsw-static-neutral-bluish-50)',
			'--dsw-alias-markdown-code-block-banner': 'var(--dsw-static-neutral-bluish-50)',
			'--dsw-alias-markdown-code-segment-selected': 'var(--dsw-static-neutral-bluish-00)',
			'--dsw-alias-markdown-code-segment-unselected': 'var(--dsw-static-neutral-bluish-75)',
			'--dsw-alias-markdown-inline-code': 'var(--dsw-static-neutral-bluish-100)',
			'--dsw-alias-markdown-placeholder': 'var(--dsw-static-neutral-bluish-60)',
			'--dsw-alias-markdown-tag': 'var(--dsw-static-neutral-bluish-75)',
			'--dsw-alias-scrollbar-bg-l1': 'var(--dsw-static-neutral-200)',
			'--dsw-alias-scrollbar-bg-l2': 'var(--dsw-static-neutral-200)',
			'--dsw-alias-scrollbar-hover-l1': 'var(--dsw-static-neutral-300)',
			'--dsw-alias-scrollbar-hover-l2': 'var(--dsw-static-neutral-300)',
			'--dsw-alias-state-error-primary': 'var(--dsw-static-red-600)',
			'--dsw-alias-state-error-secondary': 'var(--dsw-static-red-400)',
			'--dsw-alias-state-success-primary': 'var(--dsw-static-green-500)',
			'--dsw-alias-state-success-secondary': 'var(--dsw-static-green-400)',
			'--dsw-alias-state-warn-label': 'var(--dsw-static-amber-600)',
			'--dsw-alias-state-warn-primary': 'var(--dsw-static-amber-500)',
			'--dsw-alias-state-warn-secondary': 'var(--dsw-static-amber-400)',
			'--dsw-alias-toast-bg': 'var(--dsw-static-neutral-bluish-800)',
			'--dsw-alias-tooltip-bg': 'var(--dsw-static-neutral-bluish-850)',
			'--dsw-specific-bubble': 'var(--dsw-static-deepseek-50)',
			'--dsw-specific-bubble-highlight': 'var(--dsw-static-deepseek-200)',
			'--dsw-specific-input-major': 'var(--dsw-static-neutral-bluish-00)',
			'--dsw-specific-login-input': 'var(--dsw-static-neutral-bluish-50)',
			'--dsw-specific-menu': 'var(--dsw-alias-bg-layer-3)',
			'--dsw-specific-selector': 'var(--dsw-static-neutral-bluish-60)',
			'--dsw-specific-sidebar-fill': 'var(--dsw-static-neutral-bluish-50)',
			'--dsw-specific-sidebar-nav-item-active': 'var(--dsw-static-neutral-bluish-100)',
			'--dsw-specific-sidebar-nav-item-active-accent': 'var(--dsw-static-deepseek-100)',
			'--dsw-specific-sidebar-nav-item-hover': 'var(--dsw-static-neutral-bluish-75)',
			'--dsw-specific-tip': 'var(--dsw-static-neutral-bluish-60)',
			'--shiki-foreground': 'var(--dsw-alias-label-primary)',
			'--shiki-background': 'var(--dsw-alias-markdown-code-block)',
			'--shiki-token-comment': '#868e96',
			'--shiki-token-constant': '#1c7ed6',
			'--shiki-token-function': '#6741d9',
			'--shiki-token-keyword': '#d6336c',
			'--shiki-token-link': '#1971c2',
			'--shiki-token-parameter': '#e8590c',
			'--shiki-token-punctuation': '#495057',
			'--shiki-token-string': '#2f9e44',
			'--shiki-token-string-expression': '#2b8a3e',
		};

		// One Dark Pro 深色档(参考 VS Code One Dark Pro,强调蓝调浅一档)
		const DARK_ONEDARKPRO = {
			'--dsw-alias-bg-base': '#282C34',
			'--dsw-alias-bg-layer-1': '#21252B',
			'--dsw-alias-bg-layer-2': '#2C313A',
			'--dsw-alias-bg-layer-3': '#2C313A',
			'--dsw-alias-bg-overlay': '#21252B',
			'--dsw-alias-bg-module-platform': '#21252B',
			'--dsw-alias-bg-multi-select': '#2C313A',
			'--dsw-alias-bg-skeleton': 'rgba(255, 255, 255, 0.06)',
			'--dsw-alias-border-l1': '#181A1F',
			'--dsw-alias-border-l2': '#2C313A',
			'--dsw-alias-border-l3': '#3E4451',
			'--dsw-alias-border-l4': '#4B5263',
			'--dsw-alias-brand-primary': '#6FA8FF',
			'--dsw-alias-brand-primary-invert': '#FFFFFF',
			'--dsw-alias-brand-primary-new-colorprimary-new-color': '#6FA8FF',
			'--dsw-alias-brand-text': '#6FA8FF',
			'--dsw-alias-state-business-primary': '#61AFEF',
			'--dsw-alias-state-business-tertiary': '#2C313A',
			'--dsw-alias-button-contrast-fill': '#ABB2BF',
			'--dsw-alias-button-elevated-fill': '#2C313A',
			'--dsw-alias-button-floating-fill': '#21252B',
			'--dsw-alias-button-floating-hover': '#2C313A',
			'--dsw-alias-button-ghost-active-border': '#4B5263',
			'--dsw-alias-button-ghost-active-fill': '#2C313A',
			'--dsw-alias-button-ghost-active-hover': '#3E4451',
			'--dsw-alias-button-info-fill': '#6FA8FF',
			'--dsw-alias-button-info-hover': '#7FAFFF',
			'--dsw-alias-button-primary-dimmed': '#3E4451',
			'--dsw-alias-button-primary-fill': '#6FA8FF',
			'--dsw-alias-button-primary-hover': '#7FAFFF',
			'--dsw-alias-interactive-bg-active': '#3E4451',
			'--dsw-alias-interactive-bg-hover': '#2C313A',
			'--dsw-alias-interactive-bg-hover-accent': '#3E4451',
			'--dsw-alias-interactive-bg-hover-solid': '#2C313A',
			'--dsw-alias-label-caption': '#5C6370',
			'--dsw-alias-label-dimmed': '#4B5263',
			'--dsw-alias-label-primary': '#ABB2BF',
			'--dsw-alias-label-primary-bluish': '#ABB2BF',
			'--dsw-alias-label-primary-dimmed': '#9DA5B4',
			'--dsw-alias-label-primary-foreground': '#FFFFFF',
			'--dsw-alias-label-primary-inverted': '#21252B',
			'--dsw-alias-label-secondary': '#9DA5B4',
			'--dsw-alias-label-tertiary': '#5C6370',
			'--dsw-alias-markdown-citation': '#2C313A',
			'--dsw-alias-markdown-code-block': '#282C34',
			'--dsw-alias-markdown-code-block-banner': '#21252B',
			'--dsw-alias-markdown-code-segment-selected': '#2C313A',
			'--dsw-alias-markdown-code-segment-unselected': '#282C34',
			'--dsw-alias-markdown-inline-code': '#2C313A',
			'--dsw-alias-markdown-placeholder': '#2C313A',
			'--dsw-alias-markdown-tag': '#2C313A',
			'--dsw-alias-scrollbar-bg-l1': '#3E4451',
			'--dsw-alias-scrollbar-bg-l2': '#3E4451',
			'--dsw-alias-scrollbar-hover-l1': '#4B5263',
			'--dsw-alias-scrollbar-hover-l2': '#5C6370',
			'--dsw-alias-state-error-primary': '#E06C75',
			'--dsw-alias-state-error-secondary': '#E06C75',
			'--dsw-alias-state-success-primary': '#98C379',
			'--dsw-alias-state-success-secondary': '#98C379',
			'--dsw-alias-state-warn-label': '#E5C07B',
			'--dsw-alias-state-warn-primary': '#E5C07B',
			'--dsw-alias-state-warn-secondary': '#D19A66',
			'--dsw-alias-toast-bg': '#2C313A',
			'--dsw-alias-tooltip-bg': '#2C313A',
			'--dsw-specific-bubble': '#2C313A',
			'--dsw-specific-bubble-highlight': '#3E4451',
			'--dsw-specific-input-major': '#21252B',
			'--dsw-specific-login-input': '#282C34',
			'--dsw-specific-menu': '#21252B',
			'--dsw-specific-selector': '#2C313A',
			'--dsw-specific-sidebar-fill': '#21252B',
			'--dsw-specific-sidebar-nav-item-active': '#2C313A',
			'--dsw-specific-sidebar-nav-item-active-accent': '#6FA8FF',
			'--dsw-specific-sidebar-nav-item-hover': '#2C313A',
			'--dsw-specific-tip': '#2C313A',
			'--shiki-foreground': '#ABB2BF',
			'--shiki-background': '#282C34',
			'--shiki-token-comment': '#5C6370',
			'--shiki-token-constant': '#D19A66',
			'--shiki-token-function': '#61AFEF',
			'--shiki-token-keyword': '#C678DD',
			'--shiki-token-link': '#61AFEF',
			'--shiki-token-parameter': '#E06C75',
			'--shiki-token-punctuation': '#ABB2BF',
			'--shiki-token-string': '#98C379',
			'--shiki-token-string-expression': '#98C379',
		};

		// PyCharm Dark 深色档(参考 VS Code 扩展 nicohlr.pycharm 的 PyCharm Dark Theme)
		const DARK_PYCHARM = {
			'--dsw-alias-bg-base': '#26292C',
			'--dsw-alias-bg-layer-1': '#313437',
			'--dsw-alias-bg-layer-2': '#26292C',
			'--dsw-alias-bg-layer-3': '#3B3E41',
			'--dsw-alias-bg-overlay': '#313437',
			'--dsw-alias-bg-module-platform': '#313437',
			'--dsw-alias-bg-multi-select': '#26292C',
			'--dsw-alias-bg-skeleton': 'rgba(255, 255, 255, 0.08)',
			'--dsw-alias-border-l1': 'rgba(0, 0, 0, 0.25)',
			'--dsw-alias-border-l2': '#3B3E41',
			'--dsw-alias-border-l3': '#5C6166',
			'--dsw-alias-border-l4': '#7A8288',
			'--dsw-alias-brand-primary': '#007ACC',
			'--dsw-alias-brand-primary-invert': '#FFFFFF',
			'--dsw-alias-brand-primary-new-colorprimary-new-color': '#007ACC',
			'--dsw-alias-brand-text': '#007ACC',
			'--dsw-alias-state-business-primary': '#007ACC',
			'--dsw-alias-state-business-tertiary': '#26292C',
			'--dsw-alias-button-contrast-fill': '#A9B7C6',
			'--dsw-alias-button-elevated-fill': '#313437',
			'--dsw-alias-button-floating-fill': '#26292C',
			'--dsw-alias-button-floating-hover': '#313437',
			'--dsw-alias-button-ghost-active-border': '#5C6166',
			'--dsw-alias-button-ghost-active-fill': '#313437',
			'--dsw-alias-button-ghost-active-hover': '#3B3E41',
			'--dsw-alias-button-info-fill': '#007ACC',
			'--dsw-alias-button-info-hover': '#3173C7',
			'--dsw-alias-button-primary-dimmed': '#313437',
			'--dsw-alias-button-primary-fill': '#007ACC',
			'--dsw-alias-button-primary-hover': '#3173C7',
			'--dsw-alias-interactive-bg-active': 'rgba(255, 255, 255, 0.10)',
			'--dsw-alias-interactive-bg-hover': 'rgba(255, 255, 255, 0.08)',
			'--dsw-alias-interactive-bg-hover-accent': 'rgba(255, 255, 255, 0.12)',
			'--dsw-alias-interactive-bg-hover-solid': '#313437',
			'--dsw-alias-label-caption': '#5C6166',
			'--dsw-alias-label-dimmed': '#5C6166',
			'--dsw-alias-label-primary': '#A9B7C6',
			'--dsw-alias-label-primary-bluish': '#A9B7C6',
			'--dsw-alias-label-primary-dimmed': '#8B9399',
			'--dsw-alias-label-primary-foreground': '#FFFFFF',
			'--dsw-alias-label-primary-inverted': '#26292C',
			'--dsw-alias-label-secondary': '#8B9399',
			'--dsw-alias-label-tertiary': '#7A8288',
			'--dsw-alias-markdown-citation': '#313437',
			'--dsw-alias-markdown-code-block': '#26292C',
			'--dsw-alias-markdown-code-block-banner': '#313437',
			'--dsw-alias-markdown-code-segment-selected': '#313437',
			'--dsw-alias-markdown-code-segment-unselected': '#26292C',
			'--dsw-alias-markdown-inline-code': '#313437',
			'--dsw-alias-markdown-placeholder': '#313437',
			'--dsw-alias-markdown-tag': '#313437',
			'--dsw-alias-scrollbar-bg-l1': 'rgba(255, 255, 255, 0.10)',
			'--dsw-alias-scrollbar-bg-l2': 'rgba(255, 255, 255, 0.10)',
			'--dsw-alias-scrollbar-hover-l1': 'rgba(255, 255, 255, 0.15)',
			'--dsw-alias-scrollbar-hover-l2': 'rgba(255, 255, 255, 0.20)',
			'--dsw-alias-state-error-primary': '#F44747',
			'--dsw-alias-state-error-secondary': '#F44747',
			'--dsw-alias-state-success-primary': '#B5CEA8',
			'--dsw-alias-state-success-secondary': '#B5CEA8',
			'--dsw-alias-state-warn-label': '#E8BF6A',
			'--dsw-alias-state-warn-primary': '#CD9731',
			'--dsw-alias-state-warn-secondary': '#E8BF6A',
			'--dsw-alias-toast-bg': '#313437',
			'--dsw-alias-tooltip-bg': '#313437',
			'--dsw-specific-bubble': '#313437',
			'--dsw-specific-bubble-highlight': '#3B3E41',
			'--dsw-specific-input-major': '#313437',
			'--dsw-specific-login-input': '#26292C',
			'--dsw-specific-menu': '#3B3E41',
			'--dsw-specific-selector': '#313437',
			'--dsw-specific-sidebar-fill': '#313437',
			'--dsw-specific-sidebar-nav-item-active': '#26292C',
			'--dsw-specific-sidebar-nav-item-active-accent': '#007ACC',
			'--dsw-specific-sidebar-nav-item-hover': 'rgba(255, 255, 255, 0.06)',
			'--dsw-specific-tip': '#313437',
			'--shiki-foreground': '#A9B7C6',
			'--shiki-background': '#26292C',
			'--shiki-token-comment': '#808080',
			'--shiki-token-constant': '#6897BB',
			'--shiki-token-function': '#FFC66D',
			'--shiki-token-keyword': '#CC7832',
			'--shiki-token-link': '#287BDE',
			'--shiki-token-parameter': '#A9B7C6',
			'--shiki-token-punctuation': '#A9B7C6',
			'--shiki-token-string': '#6A8759',
			'--shiki-token-string-expression': '#6A8759',
		};

		// 深色表 → { light, dark } 覆盖对
		const pairOf = (dark) => {
			const out = {};
			for (const k of Object.keys(dark)) out[k] = { light: LIGHT[k], dark: dark[k] };
			return out;
		};
		const PALETTES = [
			{ id: 'onedarkpro', label: 'One Dark Pro', tokens: pairOf(DARK_ONEDARKPRO) },
			{ id: 'pycharmdark', label: 'PyCharm Dark', tokens: pairOf(DARK_PYCHARM) },
		];

		// ---------- 首屏引导样式缓存 ----------
		// 宿主侧(tapIndex)注入的解析期引导脚本会读取这份缓存,把选中调色板
		// 提前到首帧绘制;每次物化都重写,调色板改动后最多一屏旧色。
		// 键名必须与 lib/index.js 的引导脚本一致。
		const BOOT_CSS_KEY = "dsh-themes.boot-css";
		const bootCssOf = (tokens) => "html body[data-ds-dark-theme]{" + Object.entries(tokens).map(([k, v]) => `${k}:${v.dark}`).join(";") + "}";
		const cacheBootCss = () => {
			try {
				const map = {};
				for (const p of PALETTES) map[p.id] = bootCssOf(p.tokens);
				localStorage.setItem(BOOT_CSS_KEY, JSON.stringify(map));
			} catch (_) { /* 存储失败仅失去首屏提速 */ }
		};

		// 选择持久化:'dsh-themes.palette' = 主题 id 或空(默认)。
		// 兼容旧包:dsh-theme-onedarkpro.enabled === '0' 视为「未启用」
		const KEY = "dsh-themes.palette";
		const LEGACY_KEY = "dsh-theme-onedarkpro.enabled";
		const readPalette = () => {
			if (typeof localStorage === "undefined") return '';
			const cur = localStorage.getItem(KEY);
			if (cur !== null) return PALETTES.some((p) => p.id === cur) ? cur : '';
			if (localStorage.getItem(LEGACY_KEY) === '0') return '';
			return 'onedarkpro'; // 老用户缺省 = One Dark Pro,保持升级无缝
		};

		exports.inject = ["theme", "slots", "settingsScope"];
		exports.apply = function (ctx) {
			const theme = ctx.theme;
			let current = readPalette();
			let off = null;
			let layerLive = false;
			const boot = typeof window !== "undefined" ? (window.__DSH_THEMES_BOOT__ || null) : null;

			cacheBootCss();

			const disarmBootGuard = () => {
				if (boot !== null && typeof boot.release === "function") boot.release();
			};
			const dropBootSheet = () => {
				const el = document.getElementById("dsh-themes-boot");
				if (el !== null) el.remove();
			};
			const removePalette = () => { if (off !== null) { off(); off = null } layerLive = false };
			const applyPalette = () => {
				removePalette();
				const p = PALETTES.find((x) => x.id === current);
				if (p) {
					off = theme.overrideTokens("dsh-themes", p.tokens);
					layerLive = true;
					disarmBootGuard();
					dropBootSheet();
				}
			};

			// 引导脚本在场时,覆盖层注册延迟到「外观偏好已被采纳」之后:采纳前
			// 主题服务按 system(OS)解析,若 OS 是浅色,提前注册会让浅色档 token
			// 被写进内联样式并盖过引导样式,把白帧带回来。偏好为 system 时不会有
			// 采纳事件,引导样式将长期承担调色板(与属性联动,行为一致)。
			ctx.effect(() => {
				if (boot === null) { applyPalette(); return; }
				let adopted = false;
				const offEvent = ctx.on("theme/change", (snapshot) => {
					if (adopted || snapshot.preference === "system") return;
					adopted = true;
					if (current !== "") applyPalette(); else disarmBootGuard();
				});
				const snap = theme.getTheme();
				if (snap.preference !== "system") {
					adopted = true;
					if (current !== "") applyPalette(); else disarmBootGuard();
				}
				return () => offEvent();
			}, "dsh-themes: 偏好采纳后注册覆盖层");

			// 设置读取完成后释放引导守卫(偏好为 system 时不会有采纳事件,
			// 守卫必须在此之前停用,否则会挡住后续 OS 深浅切换)。
			ctx.effect(() => {
				if (boot === null) return;
				const scope = ctx.settingsScope.bind({ namespace: "ui-theme" });
				const offSub = scope.subscribe(() => {
					const s = scope.getSnapshot();
					if (s.status !== "ready" && s.status !== "unavailable") return;
					disarmBootGuard();
					offSub();
				});
				return () => offSub();
			}, "dsh-themes: 设置就绪后释放引导守卫");

			ctx.effect(() => () => { removePalette(); dropBootSheet(); }, "dsh-themes: 卸载时撤销覆盖");

			// 设置 → 通用:「主题」行,每个主题一个方块,点击选中/再点取消
			const Row = () => {
				const [sel, setSel] = react.useState(current);
				const pick = (id) => {
					current = sel === id ? '' : id;
					try { localStorage.setItem(KEY, current) } catch (_) { /* 忽略存储失败 */ }
					applyPalette();
					setSel(current);
				};
				const cubeStyle = (on) => ({
					display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px",
					borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
					border: "1px solid " + (on ? "var(--dsw-alias-brand-primary)" : "var(--dsw-alias-border-l2)"),
					background: on ? "var(--dsw-alias-interactive-bg-active)" : "var(--dsw-alias-bg-layer-1)",
					color: on ? "var(--dsw-alias-brand-primary)" : "var(--dsw-alias-label-secondary)",
				});
				return react.createElement("div", {
					style: {
						display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
						padding: "12px 16px", borderTop: "1px solid var(--dsw-alias-border-l1)",
					},
				},
					react.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "var(--dsw-alias-label-primary)" } }, "主题"),
					react.createElement("div", { style: { display: "flex", gap: 8 } },
						PALETTES.map((p) => react.createElement("button", {
							key: p.id,
							type: "button",
							onClick: () => pick(p.id),
							title: "深色档使用 " + p.label + " 配色(点击选中/再点取消)",
							style: cubeStyle(sel === p.id),
						}, sel === p.id ? "● " : "○ ", p.label)),
					),
				);
			};
			ctx.slots.inject("settings.general.item", () => ctx.slots.register(
				{ name: "settings.general.item", id: "theme-palettes", order: 15, label: "主题" },
				Row,
			));
		};
		return module.exports;
	}
});
