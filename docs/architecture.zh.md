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
| `dsh-cloud-disk-bundle` | Profile patch 和依赖入口 | 添加 Host 服务、Provider 和云盘工作台。 |
| `dsh-cloud-disk` | Provider 无关的云盘服务接口 | 定义目录、搜索、用户和错误数据。 |
| `dsh-cloud-disk-api-provider` | 360 云盘 HTTP Provider | 使用 Host 凭据存储中的 `CLOUD_DISK_API_KEY` 和 Bundle 配置中的 `signingSecret` 请求 360 API。 |
| `dsh-client-ui-cloud-disk` | Web 客户端页面 | 提供连接、目录浏览、搜索、刷新和续页界面。 |
| `dsh-tool-cloud-disk` | Agent 工具实现 | 提供只读云盘工具；独立 Bundle 会安装此依赖，但不会把它加入外部 Profile 的 Agent。 |

`dsh-cloud-disk-bundle` 是唯一应作为 `dsh plugin` 直接安装的包。一次安装会由 pnpm 自动解析和安装其余四个包；不要手工连续执行五次安装命令。Desktop 插件中心对同一包执行等价的 Profile 安装事务。外部 `dsh` 安装还必须已经提供 Bundle 所声明的 `@deepseek-ai/*` peer dependencies。

## 运行时界面兼容

客户端根据运行时实际声明的 slot 选择入口，不根据 Desktop、CLI 或 `dsh` 版本号推断。`sidebar.primary.action` 与 `main.page` 同时存在时，云盘位于主侧边栏并作为一级页面打开；这是当前 Desktop 和新运行时的界面。任一 slot 缺失时，客户端改用旧运行时已有的 `sidebar.footer.action` 与 `shell.overlay`：侧边栏底部的“云盘”按钮会在保留侧边栏的右侧工作区打开云盘。旧运行时没有 `main.page`，插件不会替换官方根布局来伪造该 slot。

两种入口复用同一个连接和浏览页面。Bundle 在 Host 注册独立的 `/cloud-disk` Connection RPC，并使用 loopback 权限；它不依赖官方静态 `api.cloudDisk` 字段。因此公开 `dsh@0.1.1-rc.2` 也可完成 API Key、签名材料、连接、目录浏览、搜索、刷新、分页和断开连接。凭据端点只允许 API Key 引用，页面永远不能枚举、读取或修改其他 Host 凭据。用户不需要在设置中配置云盘，也不需要选择 Desktop 专用安装包。运行时加载期间 slot 发生变化时，客户端会释放旧适配器，只保留一种入口。

## Profile 与凭据

Bundle 的 `cordis.patch.yml` 保存 endpoint、客户端标识、超时和重试等配置，并以字面量 `signingSecret` 保存应用签名材料。凭据在云盘页面中由当前用户写入 Host 凭据存储，页面只能读取 API Key 的已配置状态，不能读取凭据值。

## Agent Preset

云盘工具由 `cloud-disk` Agent Preset 提供，而不是 Bundle 的隐式副作用。Desktop Preset 广场安装该制品时，会将它复制到 `~/.dsh/.agent-presets/cloud-disk`，因此它显示在用户的自定义区域。CLI 用户可将等价的 Preset 目录放入同一用户根目录。

用户在新会话中选择“云盘模式”后，Agent 才会获得只读的 `cloud_disk_list` 和 `cloud_disk_search` 工具。缺少 Bundle 时，该 Preset 的工具无法解析 Provider；Desktop 应先安装 Bundle。用户也可在 Agent Preset 设置中将“云盘模式”设为默认值，使之后未显式选择 Preset 的新会话自动获得这些工具；现有会话不受影响。

## 当前范围

当前产品仅提供账户查询、目录浏览、搜索和分页。上传、下载、分享、移动、删除和其他写操作不在本发行范围内。
