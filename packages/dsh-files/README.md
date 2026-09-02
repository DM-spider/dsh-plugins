# dsh-files（自研）

> **类型**:自研插件(非修改版,前身 dsh-code-guide)
> **版本**:0.1.0

「文件」右侧边栏:当前工作区文件树(搜索、彩色类型图标、大小、全部展开/折叠、手动+自动刷新)+ 文件预览(代码逐行高亮、Markdown/mermaid 渲染)+ 代码文件按需 AI 解读(逐函数通俗解读 + mermaid 调用图)。解读由宿主侧默认模型路由(LLM)生成。

## 功能

- 标题栏侧栏图标开关,右侧面板三视窗(文件树 / 源码 / 解读)各自可拖分栏线调宽,文件树可独立收起并把宽度交给源码区,面板左缘可拖宽、拖到最右侧收起,布局持久化
- 文件树:搜索(300ms 防抖)、Material 主题彩色文件类型图标、文件大小、错误行、全部展开/折叠(500 目录上限)、手动刷新、3 秒自动刷新(可关)
- 多页签可拖拽排序 + VSCode 风格预览页签(单击树文件=预览、双击=固定打开;临时预览固定在末尾;切页保留各自滚动/解读/视图)
- 解读/读取进行中切换工作区不中断:结果写回所属页签,切回即显示,不会卡在生成中
- 源码窗:14px 逐行语法高亮 + 行号;点击代码行 → 对应解读项闪烁;点击卡片/变量名反向定位;Ctrl+点击标识符跳转定义;Alt+←/→ 跳转历史;Ctrl+F 文件内搜索(计数 + 全部命中高亮 + 当前命中橙色,Enter/Shift+Enter 上下跳、Aa 区分大小写)
- 万行文件虚拟滚动:只渲染可视行,大文件浏览不卡
- Markdown(md/markdown)默认 GFM 预览(表格/引用/任务列表/代码高亮/mermaid 围栏),可切「源码」;「目录」浮层列出全部标题,点击平滑跳转、滚动跟随高亮当前章节;.mmd/.mermaid 整图渲染
- 图片(png/jpg/webp/gif/svg)内嵌预览;PDF 用浏览器内置查看器预览;二进制文件识别,不再乱码上屏
- 解读:「解读」按钮按需生成,首次/未改动优先缓存(host 按路径+mtime),解读框打开时再点 = 重新解读(强制 LLM);文件外部改动后点解读自动走 LLM 并同步源码;解读框右上角 ✕ 只关解读不关源码
- 失败组定向补全:host 自动修复模型输出里的坏 JSON(反斜杠续行/残缺 \u/双重转义的正则等,迭代消除到稳定),修不动的组进失败清单;报错框最右侧「补全解读」只重跑失败组(成功组一个 token 不花),补全中按钮原位变三点跳动、已有解读保持可见,完成后缺失卡片按 id 原位补齐
- 生成中看板:二次元鲸鱼娘(内嵌透明 PNG,素材来自 dafeiyu-pet 二创)+ 三点循环,延迟 300ms 显示防闪烁
- 双击对话区收起面板

## 依赖

- 宿主:`fs` 服务 + `llm` 服务(**优先使用 flash 快模型**:deepseek-official 的 deepseek-v4-flash,未注册时回退默认模型)+ `webServer`(与 GUI 同源的 `/plugins/dsh-files/*` 路由)
- 客户端:`@changfenhuang/dsh-genui` 插件提供 mermaid 引擎(缺失时 mermaid/调用图降级为源码)

## 安装

见仓库根 `README.md` 的「安装到 harness」:

```powershell
cd "%DSH_HOME%\profiles\web"
dsh plugin --profile web add D:\WorkingSet\dsh-plugins\packages\dsh-files
pnpm install
```

新增插件后需**重启 harness** 才会加载 host 路由与 client 入口。

## 结构

- `lib/index.js` — host 半部:`/plugins/dsh-files/list`(文件树)+ `/plugins/dsh-files/read`(读文件)+ `/plugins/dsh-files/search`(文件名搜索)+ `/plugins/dsh-files/raw`(图片等二进制字节流)+ `/plugins/dsh-files/explain`(读文件 → 默认模型路由生成逐函数解读 JSON + mermaid 调用图)
- `lib/client.js` — web client 半部:`shell.overlay` 右侧面板 + 标题栏开关按钮
- `cordis.patch.yml` — bundle 补丁,把 `files` 行插入 profile 的 host 组合

## 素材声明

- 加载看板的鲸鱼娘图片为 DeepSeek 鲸鱼娘二创素材,来源 [github.com/1190fasheqi/dafeiyu-pet](https://github.com/1190fasheqi/dafeiyu-pet)(sprites/正面_187.png),内嵌于 client.js(base64)
- 文件类型图标来自 PKief/vscode-material-icon-theme v5.37.0(MIT License)

## 后续想法(未实现)

- 学习模式:先输出空白模板由用户自己填,再让 AI 批改
- 解读持久化到项目目录(如 `.files-notes/`),团队共享
