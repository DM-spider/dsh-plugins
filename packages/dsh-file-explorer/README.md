# dsh-file-explorer（本地修改版）

> **来源**：开源插件 [joejojoking-cloud/dsh-file-explorer](https://github.com/joejojoking-cloud/dsh-file-explorer)（MIT 许可）
> **类型**：修改版 —— 基于上游的本地优化，不向上游仓库推送
> **版本**：0.1.3-local.1（`-local.N` 表示自改版本，与上游 0.1.3 区分）

DeepSeek Harness 的全局文件资源管理器插件：在任何会话的标题栏右侧提供文件夹切换按钮，点击后在页面**右侧**打开可调宽度的文件树面板。

## 相对上游的修改（本仓库的维护点）

1. **Mermaid 渲染**：`.md` 预览中的 ```mermaid 代码块渲染为 Mermaid 图（引擎复用 GenUI 插件的懒加载资产 `/plugins/@omdsh-dev/dsh-genui/assets/mermaid.js`，加载/渲染失败自动回退显示源码）；`.mmd` / `.mermaid` 文件直接整体渲染为图，可切换「图表 / 源码」
2. **Material Icon Theme 文件图标**：文件树与搜索结果按文件类型显示彩色图标（替代上游的通用文件图标）。图标数据内嵌于 `lib/client.js` 的 `MATERIAL_ICONS`（位于 `[MATERIAL_ICONS_BEGIN/END]` 标记之间），由仓库 `tools/gen-material-icons.mjs` 从本机安装的 Material Icon Theme 扩展重新生成，素材 MIT 许可
3. **文件变化自动刷新**：面板打开时每 3 秒轮询根目录与已展开目录（上限 30 个），检测到新增/删除文件自动更新树并短暂提示；标题栏「眼睛」图标可开关（默认开）

## 功能

- 右侧面板（`shell.overlay`，可开关）：左边缘拖拽调宽，面板打开时左边缘中间有「>」收起按钮，双击聊天区域也可收回
- 标题栏：「文件」+ 图标 —— VS Code（打开整个工作区）、全部展开/折叠、刷新、自动刷新开关（眼睛）、编辑、关闭
- 搜索框「搜索文件」：递归扫描工作区（跳过 `.git` / `node_modules`，最多 300 条）
- 文件树：根目录默认展开，目录点击展开/折叠（懒加载），文件单击/双击打开预览；按类型显示 Material 图标（JS / TS / Python / JSON / Word / PDF 等，未知类型显示通用文档图标）
- 预览：`.md` 渲染 Markdown（标题/列表/表格/代码块/引用/链接），```mermaid 代码块渲染为图；`.mmd` / `.mermaid` 直接渲染；代码块按围栏语言高亮；其他文本文件按扩展名语法高亮（JSON / YAML / JS / TS / Python / C / C++ / Java / Go / Rust / Shell / SQL / TOML / INI / CSS / HTML 等）；「编辑」图标进入可编辑模式，保存写回磁盘
- 超过 1 MB 的文件提示不支持预览

## 安装

见仓库根 `README.md` 的「安装到 harness」：

```powershell
cd "%DSH_HOME%\profiles\web"
dsh plugin --profile web add D:\WorkingSet\dsh-plugins\packages\dsh-file-explorer
pnpm install
```

依赖：profile 中需存在 `@omdsh-dev/dsh-genui` 插件（Mermaid 引擎来源；缺失时图降级为源码，不影响其他功能）。

## 结构

- `lib/index.js` — host 半部：`fs`/`shell` 服务 + `webServer` HTTP 路由（list / search / read / write / open-vscode）
- `lib/client.js` — web client 半部：`window.__ModuleLoader__` bundle，注册 `shell.overlay` 面板与 `conversation.session.header.actions` 切换按钮
- `cordis.patch.yml` — bundle 补丁，把 `file-explorer` 行插入 profile 的 host 组合

## 维护提示

- 图标更新：装/升级 Material Icon Theme 扩展后运行 `node tools/gen-material-icons.mjs`（可设 `MATERIAL_ICON_DIR` / `DSH_FE_CLIENT` 环境变量覆盖默认路径）
- 上游升级：克隆上游仓库对比合入，再回归上面三个修改点
