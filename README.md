# dsh-plugins

个人 DeepSeek Harness 插件仓库：存放对开源插件的**本地修改版**与**自己开发的插件**。

## 目录结构

```
dsh-plugins/
├── packages/                 # 每个子目录 = 一个可安装的插件
│   └── dsh-file-explorer/    # 开源 dsh-file-explorer 的本地优化版
├── tools/                    # 开发辅助脚本
│   └── gen-material-icons.mjs
├── NOTICE.md                 # 第三方来源与许可说明
└── LICENSE
```

## packages/dsh-file-explorer

基于开源插件 [joejojoking-cloud/dsh-file-explorer](https://github.com/joejojoking-cloud/dsh-file-explorer)（MIT），本地新增三项能力：

1. **Mermaid 渲染**：Markdown 中的 ```mermaid 代码块与 `.mmd`/`.mermaid` 文件渲染为 Mermaid 图（引擎按需复用 GenUI 插件的懒加载资产，失败自动回退源码）
2. **Material Icon Theme 风格文件图标**：按文件类型显示彩色图标（素材取自 [PKief/vscode-material-icon-theme](https://github.com/PKief/vscode-material-icon-theme)，MIT，内嵌于插件）
3. **文件变化自动刷新**：面板打开时每 3 秒检测新增/删除文件并自动更新（标题栏眼睛图标可开关）

详见 `packages/dsh-file-explorer/README.md`。

## 安装方式

### 方式一：本地链接（开发机，改完刷新即生效）

```powershell
git clone <本仓库地址> dsh-plugins
cd "%DSH_HOME%\profiles\web"
dsh plugin --profile web add D:\WorkingSet\dsh-plugins\packages\dsh-file-explorer
# 等价于把 package.json 的依赖改为：
#   "dsh-file-explorer": "link:../../../../WorkingSet/dsh-plugins/packages/dsh-file-explorer"
pnpm install
```

之后直接编辑仓库里的代码 → 刷新 GUI 页面即生效 → `git commit && git push` 保存改动。

### 方式二：打 tarball 分发（其它机器）

```powershell
npm pack D:\WorkingSet\dsh-plugins\packages\dsh-file-explorer
# 得到 dsh-file-explorer-<version>.tgz，拷到目标机后：
dsh plugin --profile web add ./dsh-file-explorer-<version>.tgz
pnpm install   # 在 profiles\web 目录下执行
```

## 注意事项

- 插件 package.json 里的 `name` 必须与 profile `dsh.profile.bundles` 中的条目一致（本包为 `dsh-file-explorer`）
- mermaid 渲染依赖 profile 中存在 `@omdsh-dev/dsh-genui` 插件；没有则自动降级为源码显示
- 修改版本号时同步修改 profile 中的依赖路径/文件名

## 新增自己的插件

1. 在 `packages/<插件名>/` 下按 dsh 插件规范放好 `package.json`（含 `dsh.bundle`/`dshClient` 配置）、`lib/`（host/client 半部）等文件
2. 按上面「安装方式」链接/打包安装，`name` 与 bundles 条目保持一致
