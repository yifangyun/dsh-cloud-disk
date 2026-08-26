# @aicloud360/dsh-cloud-disk：云盘能力

[English](README.md) | 中文

`CloudDiskRuntime`（`ctx.cloudDisk`）定义 360 AI 云盘 UI 和 Agent Consumer 使用的、与提供方无关的原生云盘能力 seam。本包拥有稳定的节点、分页、用户、提供方和错误词汇，不公开 MCP transport、工具结果 block 或外部 API 类型。

## 服务 API

| 成员 | 语义 |
|---|---|
| `registerProvider(provider)` | 按稳定 id 注册一个后端并返回 disposer。id 重复时抛出 `CLOUD_DISK_DUPLICATE_PROVIDER`。 |
| `getUser(signal?)` | 通过选中的提供方读取规范化用户信息。 |
| `list(request, signal?)` | 读取一个规范化的远端目录分页。 |
| `search(request, signal?)` | 搜索远端节点并返回稳定节点 id。 |

提供方在每次执行时选择。配置了 `provider` 时，该 id 必须已注册且可用；未配置时必须恰好存在一个可用提供方。缺失、不可用、歧义和空注册表都使用稳定的 `CloudDiskError` code。

## 安全与模型体验

提供方配置只接受 credential reference，不接受密钥字节。API Key 解析、HTTP 请求、鉴权、签名、重试和外部响应解析属于 Host 侧 Provider。Consumer 只能接收规范化领域值。面向模型的 Consumer 必须记录发送给模型的每个目录或文件 id；本包本身不贡献提示词或面向模型的工具。

#### KV Cache 影响

不会直接导致失效。Agent 和 UI Consumer 拥有提示词前缀及上下文更新。

## 已知限制与暂缓事项

- 首个 seam 只包含用户信息、目录列表和搜索。变更、传输、审批和失效事件必须与所属执行器及测试一起加入。
- 服务不提供观测或状态查询 API；可用性通过执行操作并路由 `CloudDiskError` 观察。
- 直连 360 API Provider 属于独立包，首期运行时不依赖 MCP。
