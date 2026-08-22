window.__ModuleLoader__.load({
	id: "dsh-theme-onedarkpro",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		// ---------- One Dark Pro 配色(参考 VSCode One Dark Pro) ----------
		// 每个 token 一对 { light, dark }:浅色档给 DSH 默认表达式(浅色观感
		// 完全不变),深色档给 One Dark Pro 配色。覆盖层只作用于深色方案,
		// 设置里的「外观」选择与持久化偏好不受影响——选「深色」或
		// 「跟随系统(系统为深色)」即得到 One Dark Pro。
		const OVERRIDES = {
			// 背景
			'--dsw-alias-bg-base': { light: 'var(--dsw-static-neutral-bluish-00)', dark: '#282C34' },
			'--dsw-alias-bg-layer-1': { light: 'var(--dsw-static-neutral-bluish-00)', dark: '#21252B' },
			'--dsw-alias-bg-layer-2': { light: 'var(--dsw-static-neutral-bluish-00)', dark: '#2C313A' },
			'--dsw-alias-bg-layer-3': { light: 'var(--dsw-static-neutral-bluish-00)', dark: '#2C313A' },
			'--dsw-alias-bg-overlay': { light: 'var(--dsw-static-neutral-bluish-150)', dark: '#21252B' },
			'--dsw-alias-bg-module-platform': { light: 'var(--dsw-static-neutral-bluish-60)', dark: '#21252B' },
			'--dsw-alias-bg-multi-select': { light: 'var(--dsw-static-neutral-bluish-60)', dark: '#2C313A' },
			'--dsw-alias-bg-skeleton': { light: 'rgba(0, 0, 0, 0.04)', dark: 'rgba(255, 255, 255, 0.06)' },
			// 边框
			'--dsw-alias-border-l1': { light: 'rgba(0, 0, 0, 0.04)', dark: '#181A1F' },
			'--dsw-alias-border-l2': { light: 'rgba(0, 0, 0, 0.1)', dark: '#2C313A' },
			'--dsw-alias-border-l3': { light: 'rgba(0, 0, 0, 0.12)', dark: '#3E4451' },
			'--dsw-alias-border-l4': { light: 'rgba(0, 0, 0, 0.16)', dark: '#4B5263' },
			// 品牌强调色(调浅一档,降低刺眼感)
			'--dsw-alias-brand-primary': { light: 'var(--dsw-static-neutral-bluish-1000)', dark: '#6FA8FF' },
			'--dsw-alias-brand-primary-invert': { light: 'var(--dsw-static-neutral-bluish-1000)', dark: '#FFFFFF' },
			'--dsw-alias-brand-primary-new-colorprimary-new-color': { light: 'rgb(65, 118, 230)', dark: '#6FA8FF' },
			'--dsw-alias-brand-text': { light: 'var(--dsw-static-neutral-bluish-1000)', dark: '#6FA8FF' },
			'--dsw-alias-state-business-primary': { light: 'var(--dsw-static-deepseek-500)', dark: '#61AFEF' },
			'--dsw-alias-state-business-tertiary': { light: 'var(--dsw-static-deepseek-100)', dark: '#2C313A' },
			// 按钮
			'--dsw-alias-button-contrast-fill': { light: 'var(--dsw-static-neutral-bluish-700)', dark: '#ABB2BF' },
			'--dsw-alias-button-elevated-fill': { light: 'var(--dsw-static-neutral-bluish-00)', dark: '#2C313A' },
			'--dsw-alias-button-floating-fill': { light: 'var(--dsw-static-neutral-bluish-00)', dark: '#21252B' },
			'--dsw-alias-button-floating-hover': { light: 'var(--dsw-static-neutral-bluish-75)', dark: '#2C313A' },
			'--dsw-alias-button-ghost-active-border': { light: 'var(--dsw-static-neutral-bluish-500)', dark: '#4B5263' },
			'--dsw-alias-button-ghost-active-fill': { light: 'var(--dsw-static-neutral-bluish-100)', dark: '#2C313A' },
			'--dsw-alias-button-ghost-active-hover': { light: 'var(--dsw-static-neutral-bluish-150)', dark: '#3E4451' },
			'--dsw-alias-button-info-fill': { light: 'var(--dsw-static-deepseek-500)', dark: '#6FA8FF' },
			'--dsw-alias-button-info-hover': { light: 'var(--dsw-static-deepseek-400)', dark: '#7FAFFF' },
			'--dsw-alias-button-primary-dimmed': { light: 'var(--dsw-static-neutral-bluish-100)', dark: '#3E4451' },
			'--dsw-alias-button-primary-fill': { light: 'var(--dsw-alias-brand-primary)', dark: '#6FA8FF' },
			'--dsw-alias-button-primary-hover': { light: 'var(--dsw-static-neutral-bluish-750)', dark: '#7FAFFF' },
			// 交互态(hover/active)
			'--dsw-alias-interactive-bg-active': { light: 'rgba(38, 49, 72, 0.1)', dark: '#3E4451' },
			'--dsw-alias-interactive-bg-hover': { light: 'rgba(38, 49, 72, 0.06)', dark: '#2C313A' },
			'--dsw-alias-interactive-bg-hover-accent': { light: 'rgba(38, 49, 72, 0.14)', dark: '#3E4451' },
			'--dsw-alias-interactive-bg-hover-solid': { light: 'var(--dsw-static-neutral-bluish-75)', dark: '#2C313A' },
			// 文字
			'--dsw-alias-label-caption': { light: 'var(--dsw-static-neutral-bluish-400)', dark: '#5C6370' },
			'--dsw-alias-label-dimmed': { light: 'var(--dsw-static-neutral-bluish-200)', dark: '#4B5263' },
			'--dsw-alias-label-primary': { light: 'var(--dsw-static-neutral-bluish-1000)', dark: '#ABB2BF' },
			'--dsw-alias-label-primary-bluish': { light: 'var(--dsw-static-blue-900)', dark: '#ABB2BF' },
			'--dsw-alias-label-primary-dimmed': { light: 'var(--dsw-static-neutral-bluish-950)', dark: '#9DA5B4' },
			'--dsw-alias-label-primary-foreground': { light: 'var(--dsw-static-neutral-bluish-00)', dark: '#FFFFFF' },
			'--dsw-alias-label-primary-inverted': { light: 'var(--dsw-static-neutral-bluish-00)', dark: '#21252B' },
			'--dsw-alias-label-secondary': { light: 'var(--dsw-static-neutral-bluish-700)', dark: '#9DA5B4' },
			'--dsw-alias-label-tertiary': { light: 'var(--dsw-static-neutral-bluish-600)', dark: '#5C6370' },
			// markdown 代码块
			'--dsw-alias-markdown-citation': { light: 'var(--dsw-static-neutral-bluish-100)', dark: '#2C313A' },
			'--dsw-alias-markdown-code-block': { light: 'var(--dsw-static-neutral-bluish-50)', dark: '#282C34' },
			'--dsw-alias-markdown-code-block-banner': { light: 'var(--dsw-static-neutral-bluish-50)', dark: '#21252B' },
			'--dsw-alias-markdown-code-segment-selected': { light: 'var(--dsw-static-neutral-bluish-00)', dark: '#2C313A' },
			'--dsw-alias-markdown-code-segment-unselected': { light: 'var(--dsw-static-neutral-bluish-75)', dark: '#282C34' },
			'--dsw-alias-markdown-inline-code': { light: 'var(--dsw-static-neutral-bluish-100)', dark: '#2C313A' },
			'--dsw-alias-markdown-placeholder': { light: 'var(--dsw-static-neutral-bluish-60)', dark: '#2C313A' },
			'--dsw-alias-markdown-tag': { light: 'var(--dsw-static-neutral-bluish-75)', dark: '#2C313A' },
			// 滚动条
			'--dsw-alias-scrollbar-bg-l1': { light: 'var(--dsw-static-neutral-200)', dark: '#3E4451' },
			'--dsw-alias-scrollbar-bg-l2': { light: 'var(--dsw-static-neutral-200)', dark: '#3E4451' },
			'--dsw-alias-scrollbar-hover-l1': { light: 'var(--dsw-static-neutral-300)', dark: '#4B5263' },
			'--dsw-alias-scrollbar-hover-l2': { light: 'var(--dsw-static-neutral-300)', dark: '#5C6370' },
			// 状态色
			'--dsw-alias-state-error-primary': { light: 'var(--dsw-static-red-600)', dark: '#E06C75' },
			'--dsw-alias-state-error-secondary': { light: 'var(--dsw-static-red-400)', dark: '#E06C75' },
			'--dsw-alias-state-success-primary': { light: 'var(--dsw-static-green-500)', dark: '#98C379' },
			'--dsw-alias-state-success-secondary': { light: 'var(--dsw-static-green-400)', dark: '#98C379' },
			'--dsw-alias-state-warn-label': { light: 'var(--dsw-static-amber-600)', dark: '#E5C07B' },
			'--dsw-alias-state-warn-primary': { light: 'var(--dsw-static-amber-500)', dark: '#E5C07B' },
			'--dsw-alias-state-warn-secondary': { light: 'var(--dsw-static-amber-400)', dark: '#D19A66' },
			// 浮层
			'--dsw-alias-toast-bg': { light: 'var(--dsw-static-neutral-bluish-800)', dark: '#2C313A' },
			'--dsw-alias-tooltip-bg': { light: 'var(--dsw-static-neutral-bluish-850)', dark: '#2C313A' },
			// 布局专有(侧栏/气泡/输入框/菜单)
			'--dsw-specific-bubble': { light: 'var(--dsw-static-deepseek-50)', dark: '#2C313A' },
			'--dsw-specific-bubble-highlight': { light: 'var(--dsw-static-deepseek-200)', dark: '#3E4451' },
			'--dsw-specific-input-major': { light: 'var(--dsw-static-neutral-bluish-00)', dark: '#21252B' },
			'--dsw-specific-login-input': { light: 'var(--dsw-static-neutral-bluish-50)', dark: '#282C34' },
			'--dsw-specific-menu': { light: 'var(--dsw-alias-bg-layer-3)', dark: '#21252B' },
			'--dsw-specific-selector': { light: 'var(--dsw-static-neutral-bluish-60)', dark: '#2C313A' },
			'--dsw-specific-sidebar-fill': { light: 'var(--dsw-static-neutral-bluish-50)', dark: '#21252B' },
			'--dsw-specific-sidebar-nav-item-active': { light: 'var(--dsw-static-neutral-bluish-100)', dark: '#2C313A' },
			'--dsw-specific-sidebar-nav-item-active-accent': { light: 'var(--dsw-static-deepseek-100)', dark: '#6FA8FF' },
			'--dsw-specific-sidebar-nav-item-hover': { light: 'var(--dsw-static-neutral-bluish-75)', dark: '#2C313A' },
			'--dsw-specific-tip': { light: 'var(--dsw-static-neutral-bluish-60)', dark: '#2C313A' },
			// 语法高亮(shiki css-variables 主题)
			'--shiki-foreground': { light: 'var(--dsw-alias-label-primary)', dark: '#ABB2BF' },
			'--shiki-background': { light: 'var(--dsw-alias-markdown-code-block)', dark: '#282C34' },
			'--shiki-token-comment': { light: '#868e96', dark: '#5C6370' },
			'--shiki-token-constant': { light: '#1c7ed6', dark: '#D19A66' },
			'--shiki-token-function': { light: '#6741d9', dark: '#61AFEF' },
			'--shiki-token-keyword': { light: '#d6336c', dark: '#C678DD' },
			'--shiki-token-link': { light: '#1971c2', dark: '#61AFEF' },
			'--shiki-token-parameter': { light: '#e8590c', dark: '#E06C75' },
			'--shiki-token-punctuation': { light: '#495057', dark: '#ABB2BF' },
			'--shiki-token-string': { light: '#2f9e44', dark: '#98C379' },
			'--shiki-token-string-expression': { light: '#2b8a3e', dark: '#98C379' },
		};

		// 开关:localStorage 显式置 '0' 可临时停用(无需卸载插件)
		const DISABLE_KEY = "dsh-theme-onedarkpro.enabled";

		exports.inject = ["theme"];
		exports.apply = function (ctx) {
			ctx.effect(() => {
				if (typeof localStorage !== "undefined" && localStorage.getItem(DISABLE_KEY) === "0") return;
				return ctx.theme.overrideTokens("dsh-theme-onedarkpro", OVERRIDES);
			}, "one-dark-pro: 深色档配色覆盖");
		};
		return module.exports;
	}
});
