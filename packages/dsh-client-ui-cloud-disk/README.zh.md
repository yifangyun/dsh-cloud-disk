# `@aicloud360/dsh-client-ui-cloud-disk`

[English](README.md) | 中文

CloudDisk 浏览器客户端插件按活动运行时实际声明的 slot 选择界面，不依赖 Desktop 或 DSH 版本号。当运行时同时提供 `sidebar.primary.action` 与 `main.page` 时，它注册一级侧边栏操作和带 key 的主页面；旧运行时则注册 `sidebar.footer.action` 入口，并通过 `shell.overlay` 在全局弹窗中打开同一个页面。工作台通过 Host CloudDisk RPC 完成连接设置、凭据替换与删除、用户查询、浏览、刷新和基于 cursor 的加载。它永远不读取凭据值；只有用户保存时，Host 凭据 API 才接收这些值。已连接工作台直接提供带确认的断开操作；连接表单只保存并验证凭据。

该插件是确定性的浏览界面。它不贡献 Agent 工具，也不创建、安装、选择或修改 Agent Preset。CloudDisk Bundle 提供所需的 Host 服务和 Provider。

## 已知限制与暂缓事项

- 页面只支持只读的账户查询、目录浏览和分页。文件详情、下载、上传、搜索、分享、变更和传输暂缓。
- 页面不会启动 CloudDisk Agent 会话。本仓库集成的 Preset 与这个已发布客户端包保持分离。
- Host 未挂载 CloudDisk RPC 或凭据 API 时页面不可用，且页面无法恢复缺失的 Host 凭据来源。
