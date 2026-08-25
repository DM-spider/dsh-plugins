/**
 * dsh-themes — host half.
 *
 * Injects a pre-paint theme bootstrap right after the core's boot-theme
 * guard (injected by `@deepseek-ai/dsh-client-ui-theme` through the same
 * `webServer.tapIndex` hook):
 *
 * 1. The selected palette id is resolved from localStorage at parse time
 *    (including the legacy key migration). When the client half has cached
 *    a palette stylesheet (see `lib/client.js`), it is mounted as an early
 *    `<style>` — so the very first paint already carries the palette colors
 *    instead of the built-in dark scheme (the "black first frame").
 * 2. `window.__DSH_THEMES_BOOT__` stashes the guard-resolved dark state and
 *    a `release()` handle for the client half.
 * 3. Until released (or a backstop timeout), a MutationObserver holds
 *    `body[data-ds-dark-theme]` + `color-scheme` at the guard's values.
 *    This closes the core's startup race: the client theme service resolves
 *    `system` before its async settings read lands, so with a light OS and
 *    a persisted dark appearance the presenter would briefly repaint the
 *    built-in light scheme (the "white second frame"). Observer callbacks
 *    are microtasks, so the light state is corrected before any paint.
 *
 * @module dsh-themes
 */

/** 核心引导守卫脚本中的标记(用于定位插入点)。 */
const BOOT_GUARD_MARKER = "data-ds-dark-theme";
/** 客户端侧未能释放时的兜底自动释放窗口(毫秒)。 */
const AUTO_RELEASE_MS = 8000;

/** 解析期引导脚本:早于任何绘制(见模块注释)。 */
function bootThemesScript() {
  return `<script>(() => {
  var BOOT_KEY = "dsh-themes.palette";
  var LEGACY_KEY = "dsh-theme-onedarkpro.enabled";
  var CACHE_KEY = "dsh-themes.boot-css";
  var id = "";
  try { id = localStorage.getItem(BOOT_KEY) || "" } catch (_) {}
  if (!id) {
    try { if (localStorage.getItem(LEGACY_KEY) !== "0") id = "onedarkpro" } catch (_) {}
  }
  var css = "";
  if (id) {
    try {
      var map = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
      if (typeof map[id] === "string") css = map[id];
    } catch (_) {}
  }
  var style = null;
  var observer = null;
  var timer = null;
  var released = false;
  var arm = function () {
    var dark = document.body.hasAttribute("${BOOT_GUARD_MARKER}");
    if (css) {
      style = document.createElement("style");
      style.id = "dsh-themes-boot";
      style.textContent = css;
      document.head.appendChild(style);
    }
    observer = new MutationObserver(function () {
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
      document.body.toggleAttribute("${BOOT_GUARD_MARKER}", dark);
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["${BOOT_GUARD_MARKER}"] });
    timer = setTimeout(release, ${AUTO_RELEASE_MS});
    window.__DSH_THEMES_BOOT__ = { dark: dark, palette: id, release: release };
  };
  var release = function () {
    if (released) return;
    released = true;
    if (timer !== null) { clearTimeout(timer); timer = null; }
    if (observer !== null) { observer.disconnect(); observer = null; }
  };
  if (typeof queueMicrotask === "function") queueMicrotask(arm);
  else Promise.resolve().then(arm);
})()<\/script>`;
}

/**
 * Insert the bootstrap after the core's boot-theme guard (the first body
 * script carrying the dark-theme marker); fall back to right after <body>
 * when the guard is absent.
 * @param html - Raw application index HTML.
 * @returns HTML containing the bootstrap.
 */
function injectBootThemes(html) {
  const script = bootThemesScript();
  const body = /<body(?:\s[^>]*)?>/i.exec(html);
  if (body === null) return `${html}${script}`;
  const from = body.index + body[0].length;
  const guard = /<script>[\s\S]*?data-ds-dark-theme[\s\S]*?<\/script>/.exec(html.slice(from));
  if (guard !== null) {
    const at = from + guard.index + guard[0].length;
    return html.slice(0, at) + script + html.slice(at);
  }
  return html.slice(0, from) + script + html.slice(from);
}

export const name = 'dsh-themes'
export const inject = []
export function apply(ctx) {
  ctx.inject(["webServer"], (httpCtx) => {
    httpCtx.effect(() => httpCtx.webServer.tapIndex(injectBootThemes), "dsh-themes: 首屏主题引导注入");
  });
}
