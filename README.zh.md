# `@aicloud360/dsh-cloud-disk-bundle`

[English](README.md) | 中文

这个可选 Profile Bundle 安装 Host 侧的 CloudDisk 服务、直连 360 API Provider 和云盘工作台。Desktop 插件中心和 `dsh plugin` 均安装同一个 Bundle。运行时提供一级页面 slot 时，工作台显示为主侧边栏中的“云盘”；旧运行时则将“云盘”放在侧边栏底部，并通过全局弹窗打开工作区。它不会向任何 Agent 默认增加工具。云盘工具由用户在 Preset 广场安装的“云盘模式”Preset 提供；用户可在新会话中选择它，或将其设为未来新会话的默认 Preset。Provider 通过 `dsh-credentials` 按引用读取用户的 `CLOUD_DISK_API_KEY`；应用签名材料使用 Bundle 配置中的字面量 `signingSecret`。

使用前，请将 [`cordis.patch.yml`](cordis.patch.yml) 中的 `signingSecret: REPLACE_WITH_360_SIGNING_SECRET` 替换为应用签名材料。这是有意纳入源码管理的部署配置，因此任何能读取 Bundle 的人都能读取其值。同一文件还包含 endpoint、client 标识、超时和重试次数。首次进入时，每位用户都会被引导通过 Host 凭据存储保存 API Key；界面只读取“是否已配置”的状态，绝不读取凭据值。

浏览器支持可点击路径的目录导航、刷新，以及服务端返回续页游标时的增量加载。目录内容能够在一次远端响应中返回完整结果时，Bundle 不会虚构额外分页。界面会区分 Host 配置不完整、API Key 缺失、鉴权被拒绝、网络故障和远端服务故障，但不会暴露用户 API Key 或远端响应正文。

## 已知限制与暂缓事项

- 独立 Bundle 只提供确定性的浏览界面。云盘工具只在用户选择或设为默认的“云盘模式”Preset 中启用。
- 当前发布的操作均为只读：账户查询、目录浏览和分页。上传、下载、搜索、分享、变更、传输和破坏性操作审批均暂缓。
- Provider 要求用户通过 Host 凭据存储提供 API Key。轮换签名材料需要编辑并重新部署 Bundle 配置。
