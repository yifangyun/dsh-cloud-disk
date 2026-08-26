# @aicloud360/dsh-cloud-disk-api-provider

[English](README.md) | 中文

Host 侧直连 360 云盘 OpenAPI Provider。它用 Host 保存的用户凭据交换 access token，用另一份 Host 保存的应用签名密钥签名目录和搜索请求，只返回标准化的 CloudDisk 值。

## 配置

`DirectCloudDiskProviderOptions` 需要以下 Host-only 值：

| 字段 | 含义 |
|---|---|
| `credentialRef` | 用户 API key 引用。 |
| `signingSecretRef` | 应用签名密钥引用。 |
| `endpoint` | 已审计的 OpenAPI endpoint。 |
| `clientEnv`、`clientSource`、`subChannel` | 鉴权时发送的部署身份。 |
| `credentials`、`http` | Host 凭据和 HTTP Provider。 |
| `timeoutMs`、`maxRetries` | 单次超时和重试上限。 |

用户 key、access token、qid、签名密钥、请求头和原始 API 响应不得进入浏览器、Session、模型、URL、日志或诊断。

## 只读操作

`getUser()` 交换用户凭据并读取当前用户。`list()` 映射 `File.getList` 分页；已列出的目录 id 仅在当前凭据代次内解析为路径。`search()` 映射表单编码的 `File.searchList` 分页。两种 cursor 都是不透明的源页码。

缺少用户凭据或签名密钥时，Provider 会在发出签名请求前拒绝。凭据变化会清除内存目录路径映射。调用方取消不会重试；可重试的传输失败和 HTTP 状态由 `maxRetries` 限制。

## 部署前提

签名密钥需要经过批准、可轮换的 Host-only 来源。不得从 MCP 参考项目复制签名材料，也不得将其提交到源码、fixture、Bundle YAML 或客户端配置。本包已包含生产 fetch transport；但在该来源与 Provider 注册被组合到 Bundle 前，它只是经过测试的 Provider 实现，不是已部署集成。

## 已知限制与暂缓事项

- Provider 只实现用户查询、目录列表和搜索；不提供上传、下载、变更、分享或传输 API。
- 一个已配置的 Provider 服务于一个 Host 进程，尚未实现多账户切换和远端变更观察。
- 本发布中的签名材料仍是用户自管的 Host 凭据；本包不提供托管分发或轮换服务。
