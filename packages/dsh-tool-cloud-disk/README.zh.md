# @aicloud360/dsh-tool-cloud-disk：云盘工具 Consumer

[English](README.md) | 中文

`@aicloud360/dsh-tool-cloud-disk` 基于 `ctx.cloudDisk` 注册面向模型的 `cloud_disk_list` 和 `cloud_disk_search` 工具。本包负责工具 schema、校验、模型提示、渲染和展示元数据；Provider 选择、凭据、HTTP、传输分页和远端错误映射仍属于 CloudDisk seam 及其 Host 侧 Provider。

## 工具

| 工具 | 输入 | 输出 |
|---|---|---|
| `cloud_disk_list` | 可选 `parentId`、`cursor` 和正整数 `limit`。省略 `parentId` 时读取根目录。 | 一页稳定节点 id、类型、名称、可选元数据和 `nextCursor`。 |
| `cloud_disk_search` | 必填非空 `query`，可选 `cursor` 和正整数 `limit`。 | 一页匹配节点及可选 `nextCursor`。 |

每次调用都是只读 Provider 操作，并标记为可并发执行。结果会渲染稳定 id，使后续模型轮次可以引用同一个远程文件或文件夹。返回的 cursor 不会自动继续请求；模型必须显式传入它来获取下一页。

## 配置

- `list` 和 `search` 控制对应工具是否注册，默认均为 `true`。
- `timeoutMs` 设置协作式工具调用超时，默认 `30000`。
- `pageLimit` 设置默认分页大小，默认 `50`。

本包要求存在 `cloudDisk` 服务，但不解析凭据，也不会把 API Key 放入工具参数、渲染结果、展示元数据、Session 文本或提示词。

## 模型与 KV-cache 影响

插件增加一个系统提示段，说明 CloudDisk 工具会返回稳定 id。列表和搜索结果属于模型可见工具输出，因此远程节点名称和 id 会进入 Session transcript。本包不会直接导致提示词前缀或 KV cache 失效；由所属 Agent/Session runtime 决定新工具输出何时改变模型请求。

## 已知限制与暂缓事项

- 当前 Consumer 只读。变更、传输、审批分类和 Session 事件需要独立执行器及其 Session contract。
- 工具只公开规范化服务分页，不公开 Provider 特有字段或 MCP result block。
- 本包不实现 UI 浏览；确定性 UI Consumer 应直接调用 CloudDisk service，而不是驱动面向模型的工具。
