# `@aicloud360/dsh-cloud-disk-bundle`

[English](README.md) | 中文

这个可选 Profile Bundle 安装 Host 侧的 CloudDisk 服务、直连 360 API Provider、云盘工作台和本地 stdio 云盘 MCP 桥接。Desktop 插件中心和 `dsh plugin` 均安装同一个 Bundle。它声明绑定版本的插件中心图标，因此发布包身份不依赖发布者头像。桥接在 Host 级注册选定的云盘工具，因此内置和用户 Preset 都可以直接调用。Provider 通过 `dsh-credentials` 按引用读取用户的 `CLOUD_DISK_API_KEY`；MCP 子进程只在启动时以 `API_KEY` 接收它。凭据缺失或删除时工具不可用；设置或替换凭据时会启动新子进程。[`cordis.patch.yml`](cordis.patch.yml) 中的 `toolCallTimeoutMs` 限制每次 MCP 调用。

[`cordis.patch.yml`](cordis.patch.yml) 将应用签名材料作为字面部署值纳入源码。任何能读取 Bundle 的人都能读取它。同一文件还包含 endpoint、client 标识、超时和重试次数。首次进入时，每位用户都会被引导通过 Host 凭据存储保存 API Key；界面只读取“是否已配置”的状态，绝不读取凭据值。

浏览器支持可点击路径的目录导航、刷新，以及服务端返回续页游标时的增量加载。目录内容能够在一次远端响应中返回完整结果时，Bundle 不会虚构额外分页。界面会区分 Host 配置不完整、API Key 缺失、鉴权被拒绝、网络故障和远端服务故障，但不会暴露用户 API Key 或远端响应正文。

## 已知限制与暂缓事项

- Bundle 只公开云盘 Skill 记录的十项操作。创建、移动、重命名、保存、分享和上传会请求 Harness 审批；删除及其他 MCP 操作不会注册。
- Provider 要求用户通过 Host 凭据存储提供 API Key。轮换签名材料需要编辑并重新部署 Bundle 配置。
