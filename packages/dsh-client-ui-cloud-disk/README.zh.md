# `@aicloud360/dsh-client-ui-cloud-disk`

[English](README.md) | 中文

CloudDisk 浏览器客户端插件。它注册一个一级侧边栏操作及其带 key 的主页面。该页面通过 Host CloudDisk RPC 完成连接设置、凭据替换与删除、用户查询、浏览、搜索、刷新和基于 cursor 的加载。它永远不读取凭据值；只有用户保存时，Host 凭据 API 才接收这些值。

该插件是确定性的浏览界面。它不贡献 Agent 工具，也不创建、安装、选择或修改 Agent Preset。CloudDisk Bundle 提供所需的 Host 服务和 Provider。

## 已知限制与暂缓事项

- 页面只支持只读的账户查询、目录浏览、搜索和分页。文件详情、下载、上传、分享、变更和传输暂缓。
- 页面不会启动 CloudDisk Agent 会话。本仓库集成的 Preset 与这个已发布客户端包保持分离。
- Host 未挂载 CloudDisk RPC 或凭据 API 时页面不可用，且页面无法恢复缺失的 Host 凭据来源。
