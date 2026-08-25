# dsh-themes

编辑器风格深色主题包（前身 `dsh-theme-onedarkpro`，本次升级为多主题版）：

- **One Dark Pro**：配色参考 VS Code [One Dark Pro](https://github.com/Binaryify/OneDark-Pro)（强调蓝调浅一档）
- **PyCharm Dark**：配色参考 VS Code 扩展 [nicohlr.pycharm](https://marketplace.visualstudio.com/items?itemName=nicohlr.pycharm) 的 PyCharm Dark Theme

## 类型

自研（配色参考第三方主题；仅使用色值，未拷贝任何代码）。

## 使用

设置 → 通用 → 「主题」行（在「外观」下方）：每个主题一个方块，点击选中（再点取消回到默认）。
选择状态存 localStorage，重启保持。开启时深色档即为所选主题配色；「外观」仍管
浅色/深色/跟随系统，本行只决定深色档用哪个主题。

## 效果

**One Dark Pro**：背景 `#282C34` / 面板 `#21252B` / 前景 `#ABB2BF` / 强调 `#6FA8FF`；
语法：关键字 `#C678DD` · 字符串 `#98C379` · 数字 `#D19A66` · 函数 `#61AFEF` · 参数 `#E06C75`。

**PyCharm Dark**：背景 `#26292C` / 面板 `#313437` / 前景 `#A9B7C6` / 强调 `#007ACC`；
语法：关键字 `#CC7832` · 字符串 `#6A8759` · 数字 `#6897BB` · 函数 `#FFC66D` · 注释 `#808080`。

## 实现方式

通过主题服务的 `overrideTokens` 叠加层实现（不注册新主题、不抢占偏好）：

- **只改深色档**：每个 token 提供 `{ light, dark }` 一对——浅色档给 DSH 默认表达式
  （浅色观感完全不变），深色档给所选主题色值；
- **设置不受影响**：「外观」仍显示浅色/深色/跟随系统三档；
- **偏好照常持久化**：本包自存主题选择（localStorage），重启自动恢复。

### 首屏无闪变

打开页面 / Ctrl+F5 时不会先闪黑再闪白再落到主题，而是首帧即主题色：

- **首帧即主题**：host 半部通过 `webServer.tapIndex` 在核心引导脚本后注入解析期
  脚本，把客户端缓存的调色板样式表（`dsh-themes.boot-css`，每次物化重写）提前挂载，
  首个绘制就带主题色；
- **压掉白帧**：核心主题服务在异步读到持久化偏好前会按 `system`（跟随 OS）解析，
  若 OS 是浅色而偏好是深色，会出现一帧内置浅色。引导脚本用 MutationObserver 在
  解析期就守住 `data-ds-dark-theme` + `color-scheme`，直到客户端确认偏好已采纳
  （或 8s 兜底释放），微任务级修正保证白帧不落屏；
- **覆盖层延迟注册**：偏好采纳前不调用 `overrideTokens`，避免浅色档 token 被
  提前写成内联样式盖过引导样式；偏好为「跟随系统」时引导样式长期承担调色板，
  与属性联动、OS 切换行为一致。

首次更新后的第一次加载会写入引导缓存，再刷新一次即可看到首帧主题色。

## 临时停用

在设置行点掉选中的方块即可；或控制台执行 `localStorage.setItem('dsh-themes.palette', '')`。

## 安装

```powershell
cd "%DSH_HOME%\profiles\web"
dsh plugin --profile web add D:\WorkingSet\dsh-plugins\packages\dsh-themes
pnpm install
```

安装后重启 DSH；之后改 `lib/client.js` 只需 Ctrl+F5 刷新 GUI 页面，改 `lib/index.js`
（host 半部）则需要重启 DSH 后再刷新。

## 结构

- `lib/index.js` — host 半部：`webServer.tapIndex` 注入首屏主题引导脚本（调色板提前 + 深色守卫）
- `lib/client.js` — web client 半部：两套 `--dsw-alias-*` / `--shiki-*` 双档覆盖表 + 深色档叠加注册 + 设置页「主题」开关行 + 引导样式缓存
- `cordis.patch.yml` — bundle 补丁，把插件行插入 profile 的 host 组合

## 升级说明（自 dsh-theme-onedarkpro）

原包 `dsh-theme-onedarkpro` 已并入本包：profile 里的 bundles/依赖项改为 `dsh-themes`。
旧开关 `dsh-theme-onedarkpro.enabled` 自动迁移：`'0'`（曾停用）→ 无主题；其余 → One Dark Pro。
