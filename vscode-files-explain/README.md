# vscode-files-explain（文件解读）

dsh-files 的 VS Code 移植版：活动栏侧边栏里的**文件树 + 预览 + 逐函数 AI 中文解读 + mermaid 调用图**。

> 移植设计见仓库根 `docs/vscode-files-explain-migration.md`。

## 功能

- 文件树：搜索（300ms 防抖）、彩色文件类型图标、文件大小、全部展开/折叠、手动刷新、3 秒自动刷新（可关）
- 多页签 + 预览（单击预览 / 双击固定），切页保留各自滚动/解读/视图
- 源码窗：逐行语法高亮、行号、点击代码行 ↔ 解读项双向定位、Ctrl+点击跳转、Ctrl+F 文件内搜索（计数 + 命中高亮）
- 万行文件虚拟滚动
- Markdown 预览（GFM 表格/引用/任务列表/代码高亮/mermaid 围栏）+「目录」浮层
- 图片内嵌预览、PDF 内嵌预览、二进制识别
- 解读：按需生成，path+mtime 缓存；小文件单次调用，大文件两段式（outline 定位 → 分组解读）；外部改动后自动重读
- 生成中看板（鲸鱼娘 + 三点循环）

## 模型配置

解读功能需要一个 LLM 后端，二选一（可同时配置，DeepSeek 优先）：

| 后端 | 配置 | 说明 |
| --- | --- | --- |
| DeepSeek（默认优先） | 设置 `dsh-files-explain.apiKey` | 与 DSH 版同源模型；`baseUrl` 可用任意 OpenAI 兼容端点 |
| GitHub Copilot | 无需配置 | 要求安装并登录 Copilot（vscode.lm） |

## 开发调试

```powershell
npm install
npm run build      # 产物 dist/extension.js + dist/webview.js
npm run watch      # 开发监听
```

VS Code 里打开本目录 → F5（「运行扩展」配置），会起一个扩展开发宿主窗口，活动栏出现「文件解读」图标。

打包发布：`npm run package`（发布前需改 `package.json` 的 `publisher`）。

## 移植结构

| 文件 | 来源 | 说明 |
| --- | --- | --- |
| `src/host/services.js` | `packages/dsh-files/lib/index.js` | 解读流水线 + 5 条路由，整文件拷贝 + 边缘改造（6 处） |
| `src/webview/panel-vendored.js` | `packages/dsh-files/lib/client.js` | 面板 UI，整文件拷贝、一行未改 |
| `src/host/fsAdapter.js` | 新写 | `vscode.workspace.fs` → DSH fs 接口形态 |
| `src/host/llmAdapter.js` | 新写 | DeepSeek / Copilot 双通道 |
| `src/webview/entry.js` | 新写 | shim 层：模块装载器桩、fetch→postMessage、mermaid、token 映射、工作区 props |

同步上游：DSH 侧 `lib/*.js` 更新后，把 `index.js` 重新拷成 `src/host/services.js` 并重放「移植补丁」、把 `client.js` 拷成 `panel-vendored.js`（后者无需任何改动）。

## 已知差异（相对 DSH 版）

- 主题变量映射为 VS Code 主题（深色/浅色都跟随）；mermaid 固定 dark 主题（待接 VS Code 主题色）
- Ctrl+点击跳转当前为 webview 内跳转（打开真实编辑器在 P3 计划中）
- 符号链接目录不解析真实目标（环路过滤按原始路径比对）
- 目录展开会并发 stat 补齐文件大小，超大目录首次展开略慢
- 多工作区时默认取第一个工作区；工作区增删后面板自动跟随

## 素材声明

见 `NOTICE.md`（Material 文件类型图标 MIT、鲸鱼娘二创素材出处）。
