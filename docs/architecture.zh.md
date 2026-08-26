# CloudDisk 插件架构

`@aicloud360/dsh-cloud-disk-bundle` 是 CloudDisk 的唯一 Profile Bundle。Desktop 插件中心与 `dsh plugin` 均安装这一个包；它将云盘 Host 服务、360 API Provider 和侧边栏云盘页面加入目标 Profile。

## 包关系

```text
@aicloud360/dsh-cloud-disk-bundle
|- @aicloud360/dsh-cloud-disk
|- @aicloud360/dsh-cloud-disk-api-provider
|- @aicloud360/dsh-client-ui-cloud-disk
`- @aicloud360/dsh-tool-cloud-disk

@aicloud360/dsh-cloud-disk-api-provider -> @aicloud360/dsh-cloud-disk
@aicloud360/dsh-tool-cloud-disk         -> @aicloud360/dsh-cloud-disk
```

| 包 | 职责 | 安装后的行为 |
| --- | --- | --- |
| `dsh-cloud-disk-bundle` | Profile patch 和依赖入口 | 添加 Host 服务、Provider 和左侧栏云盘页面。 |
| `dsh-cloud-disk` | Provider 无关的云盘服务接口 | 定义目录、搜索、用户和错误数据。 |
| `dsh-cloud-disk-api-provider` | 360 云盘 HTTP Provider | 使用 Host 凭据存储中的 `CLOUD_DISK_API_KEY` 与 `CLOUD_DISK_SIGNING_SECRET` 请求 360 API。 |
| `dsh-client-ui-cloud-disk` | Web 客户端页面 | 提供连接、目录浏览、搜索、刷新和续页界面。 |
| `dsh-tool-cloud-disk` | Agent 工具实现 | 提供只读云盘工具；独立 Bundle 会安装此依赖，但不会把它加入外部 Profile 的 Agent。 |

`dsh-cloud-disk-bundle` 是唯一应作为 `dsh plugin` 直接安装的包。一次安装会由 pnpm 自动解析和安装其余四个包；不要手工连续执行五次安装命令。Desktop 插件中心对同一包执行等价的 Profile 安装事务。外部 `dsh` 安装还必须已经提供 Bundle 所声明的 `@deepseek-ai/*` peer dependencies。

## Profile 与凭据

Bundle 的 `cordis.patch.yml` 只保存 endpoint、客户端标识、超时和重试等非敏感配置。凭据在云盘页面中由当前用户写入 Host 凭据存储，页面只能读取已配置状态，不能读取凭据值。

## Agent Preset

云盘工具由 `cloud-disk` Agent Preset 提供，而不是 Bundle 的隐式副作用。Desktop Preset 广场安装该制品时，会将它复制到 `~/.dsh/.agent-presets/cloud-disk`，因此它显示在用户的自定义区域。CLI 用户可将等价的 Preset 目录放入同一用户根目录。

用户在新会话中选择“云盘模式”后，Agent 才会获得只读的 `cloud_disk_list` 和 `cloud_disk_search` 工具。缺少 Bundle 时，该 Preset 的工具无法解析 Provider；Desktop 应先安装 Bundle。用户也可在 Agent Preset 设置中将“云盘模式”设为默认值，使之后未显式选择 Preset 的新会话自动获得这些工具；现有会话不受影响。

## 当前范围

当前产品仅提供账户查询、目录浏览、搜索和分页。上传、下载、分享、移动、删除和其他写操作不在本发行范围内。
