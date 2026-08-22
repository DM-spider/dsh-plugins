# dsh-theme-onedarkpro

One Dark Pro 风格主题（配色参考 VS Code [One Dark Pro](https://github.com/Binaryify/OneDark-Pro)），
把 One Dark Pro 的深色配色叠加到 DeepSeek Harness 的深色档上。

## 类型

自研（配色参考第三方主题；仅使用色值，未拷贝任何代码）。

## 效果

- 背景 `#282C34`、面板/侧栏 `#21252B`、悬停 `#2C313A`、选中 `#3E4451`
- 前景 `#ABB2BF`、次要文字 `#9DA5B4`、注释 `#5C6370`
- 强调色 `#6FA8FF`（One Dark Pro 品牌蓝调浅一档，hover `#7FAFFF`）
- 语法高亮（markdown 代码块/文件预览共用 shiki）：
  - 关键字 `#C678DD` · 字符串 `#98C379` · 数字/常量 `#D19A66`
  - 函数 `#61AFEF` · 参数 `#E06C75` · 类型/标点 `#ABB2BF`
- 状态色：错误 `#E06C75` · 成功 `#98C379` · 警告 `#E5C07B`

## 实现方式

通过主题服务的 `overrideTokens` 叠加层实现（不注册新主题、不抢占偏好）：

- **只改深色档**：每个 token 提供 `{ light, dark }` 一对——浅色档给 DSH 默认
  表达式（浅色观感完全不变），深色档给 One Dark Pro 色值；
- **设置不受影响**：设置 → 通用 → 外观 仍显示浅色/深色/跟随系统三档，
  选择「深色」或「跟随系统（系统为深色）」即得到 One Dark Pro；
- **偏好照常持久化**：不写入自定义主题 id，重启后自动重新叠加，无偏好冲突。

## 使用

设置 → 通用 → 「主题」行（在「外观」下方）：点 **One Dark Pro** 方块开/关，立即生效，
选择状态存 localStorage，重启后保持。开启时深色档即为 One Dark Pro 配色；
「外观」仍管 浅色/深色/跟随系统，本开关只决定深色档是否用 One Dark Pro。

## 临时停用

除设置行开关外，也可以直接在浏览器控制台执行（或任意页面 localStorage）：

```js
localStorage.setItem('dsh-theme-onedarkpro.enabled', '0')
```

重新启用：`localStorage.removeItem('dsh-theme-onedarkpro.enabled')`，
然后刷新页面。彻底移除：从 profile 卸载本插件即可。

## 安装

```powershell
cd "%DSH_HOME%\profiles\web"
dsh plugin --profile web add D:\WorkingSet\dsh-plugins\packages\dsh-theme-onedarkpro
pnpm install
```

安装后重启 DSH；之后改 `lib/client.js` 只需 Ctrl+F5 刷新 GUI 页面。

## 结构

- `lib/index.js` — host 半部（空壳，本插件无宿主逻辑）
- `lib/client.js` — web client 半部：`--dsw-alias-*` 与 `--shiki-*` 双档覆盖表 + 深色档叠加注册 + 设置页「主题」开关行
- `cordis.patch.yml` — bundle 补丁，把插件行插入 profile 的 host 组合
