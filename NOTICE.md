# 第三方来源说明

本仓库包含以下第三方开源项目的代码（或其修改版），均按原项目许可使用：

## 1. dsh-file-explorer

- 来源：https://github.com/joejojoking-cloud/dsh-file-explorer
- 许可：MIT（见其 package.json）
- 使用范围：`packages/dsh-file-explorer/`（基于原版的本地修改版，修改点见该目录 README 与根 README）

## 2. Material Icon Theme（VS Code 扩展）

- 来源：https://github.com/PKief/vscode-material-icon-theme
- 许可：MIT License
- 使用范围：`packages/dsh-files/lib/client.js` 与 `packages/dsh-file-explorer/lib/client.js` 中内嵌的 `MATERIAL_ICONS` 图标数据（约 44 个文件类型图标的 SVG path，经工具清洗后内嵌）
- 再生成：`tools/gen-material-icons.mjs`（从本机安装的扩展目录重新提取、清洗并注入）

## 3. 鲸鱼娘加载动画素材（dsh-files）

- 来源：https://github.com/1190fasheqi/dafeiyu-pet （DeepSeek 鲸鱼娘二创桌宠项目）
- 使用范围：`packages/dsh-files/lib/client.js` 中内嵌的加载看板图片（`sprites/正面_187.png`，base64 内嵌）
- 说明：DeepSeek 鲸鱼娘同人/二创素材，仅用于本仓库插件加载动画，非上游开源代码；若日后替换或商用请自行评估

## 4. One Dark Pro 配色（dsh-theme-onedarkpro）

- 来源：https://github.com/Binaryify/OneDark-Pro （MIT License）
- 使用范围：`packages/dsh-theme-onedarkpro/lib/client.js` 中的主题色值（仅引用配色数值，未拷贝任何上游代码）
- 说明：色值本身不受版权保护；登记此条仅为来源透明，若日后自行改配色可从本表移除

若后续修改了以上第三方内容的来源或许可情况，请同步更新本文件。
