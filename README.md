# dsh-plugins

个人 DeepSeek Harness 插件仓库：统一存放两类内容——

- **修改版（DIY）**：基于开源插件的本地修改版，保留上游署名，修改点在各插件自己的 README 中说明
- **自研插件**：自己从零开发的插件

## 目录结构

```
dsh-plugins/
├── packages/                  # 每个子目录 = 一个可安装插件
│   └── <插件名>/
│       ├── package.json       # name 必须与 profile bundles 条目一致；含 dsh.bundle / dshClient 配置
│       ├── cordis.patch.yml   # bundle 补丁（把插件行插入 host 组合）
│       ├── lib/
│       │   ├── index.js       # host 半部（HTTP 路由、服务）
│       │   └── client.js      # web client 半部（window.__ModuleLoader__ 格式）
│       └── README.md          # 本插件专属说明：来源、功能、修改点、安装
├── tools/                     # 仓库级开发脚本（如图标再生成）
├── NOTICE.md                  # 所有第三方来源与许可登记（新增来源时同步更新）
└── LICENSE
```

## 插件清单

| 插件 | 类型 | 说明 | 上游 |
|---|---|---|---|
| [dsh-file-explorer](packages/dsh-file-explorer) | 修改版 | 文件资源管理器：Mermaid 渲染 / Material 文件图标 / 自动刷新 | [joejojoking-cloud/dsh-file-explorer](https://github.com/joejojoking-cloud/dsh-file-explorer)（MIT） |
| [dsh-code-guide](packages/dsh-code-guide) | 自研 | 代码陪读：逐函数解读（作用/流转/公式）+ 联动跳转 + mermaid 调用图 | — |

> 新增插件后：在表格登记一行；若使用第三方内容，同步在 `NOTICE.md` 登记来源与许可。

## 安装到 harness

统一入口：在 web profile 目录执行

```powershell
cd "%DSH_HOME%\profiles\web"
dsh plugin --profile web add <路径或包>
pnpm install
```

`<路径或包>` 按场景选择：

| 场景 | 写法 | 说明 |
|---|---|---|
| 开发机（改代码） | `D:\WorkingSet\dsh-plugins\packages\<插件名>` | 等价 `link:` 依赖，改完刷新 GUI 页面即生效，无需重新安装 |
| 其它机器（有 git） | `git clone` 本仓库后同上 | 同上 |
| 其它机器（无 git，分发） | `npm pack packages\<插件名>` 得到 tgz，再 add 该 tgz | 离线分发；改代码后需重新打包 |

## 日常开发流程

```powershell
cd D:\WorkingSet\dsh-plugins
# 编辑 packages/<插件名>/ 下的代码…
# Ctrl+F5 刷新 GUI 页面即看到效果
git add -A
git commit -m "fix(<插件名>): 说明"
git push
```

其它机器同步：`git pull`；依赖配置有变化时再跑一次 `pnpm install`。

## 新增插件规范（自研或再 DIY 一个）

1. 复制现有插件目录做模板 → `packages/<插件名>/`
2. `package.json`：`name` 与 profile `dsh.profile.bundles` 条目一致；保留 `dsh.bundle.patch` 与 `dshClient`（或 `dsh.client`）配置
3. 写好本插件 README：**来源**（自研 or 上游地址+许可）、**类型**（自研/修改版）、功能、修改点
4. 用了第三方内容 → 在 `NOTICE.md` 登记
5. 版本号：自研 `x.y.z`；修改版建议上游版本加 `-local.N` 后缀（如 `0.1.3-local.1`），与上游可区分

## 工具

| 脚本 | 用途 |
|---|---|
| `tools/gen-material-icons.mjs` | 从本机安装的 Material Icon Theme VS Code 扩展重新提取/清洗/注入文件图标到 dsh-file-explorer 的 client.js |
