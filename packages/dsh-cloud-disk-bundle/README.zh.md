# `@aicloud360/dsh-cloud-disk-bundle`

[English](README.md) | 中文

这个可选 Profile Bundle 安装 Host 侧的 CloudDisk 服务、直连 360 API Provider 和云盘工作台。Desktop 插件中心和 `dsh plugin` 均安装同一个 Bundle。运行时提供一级页面 slot 时，工作台显示为主侧边栏中的“云盘”；旧运行时则将“云盘”放在侧边栏底部，并在现有侧边栏右侧打开工作区。它不会向任何 Agent 默认增加工具。云盘工具由用户在 Preset 广场安装的“云盘模式”Preset 提供；用户可在新会话中选择它，或将其设为未来新会话的默认 Preset。Provider 通过 `dsh-credentials` 按引用读取 `CLOUD_DISK_API_KEY` 与 `CLOUD_DISK_SIGNING_SECRET`，Bundle 和 Preset 中均不保存密钥值。

[`cordis.patch.yml`](cordis.patch.yml) 内置了已审计的非敏感生产默认值，包括 endpoint、client 标识、超时和重试次数；若部署需要不同值，可由 Profile overlay 覆盖。首次进入时，每位用户都会被引导通过 Host 凭据存储保存自己的 API Key 和签名材料；界面只读取“是否已配置”的状态，绝不读取凭据值。用户可以在同一页面替换任意一项，或删除两项本地凭据。签名材料仍是每位用户请求所需的 Host 侧前置条件。

浏览器支持可点击路径的目录导航、搜索、刷新，以及服务端返回续页游标时的增量加载。目录内容能够在一次远端响应中返回完整结果时，Bundle 不会虚构额外分页。界面会区分 Host 配置不完整、凭据或签名材料缺失、鉴权被拒绝、网络故障和远端服务故障，但不会暴露密钥值或远端响应正文。

## 已知限制与暂缓事项

- 独立 Bundle 只提供确定性的浏览界面。云盘工具只在用户选择或设为默认的“云盘模式”Preset 中启用。
- 当前发布的操作均为只读：账户查询、目录浏览、搜索和分页。上传、下载、分享、变更、传输和破坏性操作审批均暂缓。
- Provider 要求用户通过 Host 凭据存储提供 API Key 与签名材料。Bundle 不能提供、恢复或轮换任一值。
