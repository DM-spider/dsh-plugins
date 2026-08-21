# dsh-code-guide（自研）

> **类型**:自研插件(非修改版)
> **版本**:0.1.0

「代码陪读」面板:打开一个脚本后,**右侧**面板内源码区与解读区双栏联动——逐函数给出通俗解读(作用 / 执行流程与数据流转 / 关键公式),点击函数卡片跳转对应代码行,点击代码行高亮对应解读;另提供该文件函数的 **mermaid 调用图**。解读由宿主侧默认模型路由(LLM)生成。

## 功能

- 标题栏圆形开关按钮(文件资源管理器开关旁边),点击打开**右侧**可拖宽面板(420px 起,右缘撑开对话区)
- 左侧窄栏:当前工作区文件树(目录懒加载展开,点击文件开始陪读)
- 源码区:带行号、按行渲染;当前解读函数所在行区间高亮;**点击卡片 → 代码区跳转**,**点击代码行 → 解读卡片高亮滚动**
- 解读区:「函数解读 / 调用图」两个标签页
  - 函数解读:每个函数一张卡片——函数名、行号范围(Lx–Ly)、一句话作用、执行流程与数据流转、关键公式/算法(没有则省略)
  - 调用图:AI 生成的 mermaid 流程图,复用 GenUI 插件的 mermaid 懒加载引擎渲染,失败自动回退显示源码
- 「重新解读」按钮强制重新生成;结果按 文件路径+mtime 缓存,重复打开不重复调模型
- 单个脚本 1 MB(约 10000 行)以内可直接打开;超过 10000 行只显示前 10000 行,模型输入超长时自动截断并提示

## 依赖

- 宿主:`fs` 服务 + `llm` 服务(**优先使用 flash 快模型**:deepseek-official 的 deepseek-v4-flash,未注册时回退默认模型)+ `webServer`(与 GUI 同源的 `/plugins/code-guide/*` 路由)
- 客户端:`@omdsh-dev/dsh-genui` 插件提供 mermaid 引擎(缺失时调用图降级为源码)

## 安装

见仓库根 `README.md` 的「安装到 harness」:

```powershell
cd "%DSH_HOME%\profiles\web"
dsh plugin --profile web add D:\WorkingSet\dsh-plugins\packages\dsh-code-guide
pnpm install
```

新增插件后需**重启 harness** 才会加载 host 路由与 client 入口。

## 结构

- `lib/index.js` — host 半部:`/plugins/code-guide/list`(文件树)+ `/plugins/code-guide/explain`(读文件 → 默认模型路由生成逐函数解读 JSON + mermaid 调用图)
- `lib/client.js` — web client 半部:`shell.overlay` 左侧面板 + 标题栏开关按钮
- `cordis.patch.yml` — bundle 补丁,把 `code-guide` 行插入 profile 的 host 组合

## 后续想法(未实现)

- 学习模式:先输出空白模板由用户自己填,再让 AI 批改
- 解读持久化到项目目录(如 `.code-guide/`),团队共享
- 支持多种编程语言的结构化解析与精确行号校验
