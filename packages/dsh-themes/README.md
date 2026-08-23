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

## 临时停用

在设置行点掉选中的方块即可；或控制台执行 `localStorage.setItem('dsh-themes.palette', '')`。

## 安装

```powershell
cd "%DSH_HOME%\profiles\web"
dsh plugin --profile web add D:\WorkingSet\dsh-plugins\packages\dsh-themes
pnpm install
```

安装后重启 DSH；之后改 `lib/client.js` 只需 Ctrl+F5 刷新 GUI 页面。

## 结构

- `lib/index.js` — host 半部（空壳，本插件无宿主逻辑）
- `lib/client.js` — web client 半部：两套 `--dsw-alias-*` / `--shiki-*` 双档覆盖表 + 深色档叠加注册 + 设置页「主题」开关行
- `cordis.patch.yml` — bundle 补丁，把插件行插入 profile 的 host 组合

## 升级说明（自 dsh-theme-onedarkpro）

原包 `dsh-theme-onedarkpro` 已并入本包：profile 里的 bundles/依赖项改为 `dsh-themes`。
旧开关 `dsh-theme-onedarkpro.enabled` 自动迁移：`'0'`（曾停用）→ 无主题；其余 → One Dark Pro。
