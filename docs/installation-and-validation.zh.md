# CloudDisk 安装与发布验证

本文适用于 `0.1.1-rc.2.cloud.2`。运行机器必须有可用的 `dsh` 和 `pnpm`。

## 安装

选择要启用云盘的 Profile。npm 与 GitHub tag 均安装同一 Bundle；pnpm 自动解析其余三个包，无需分别安装。

```sh
dsh plugin --profile web add @aicloud360/dsh-cloud-disk-bundle@0.1.1-rc.2.cloud.2
```

或从 GitHub 安装同一发布：

```sh
dsh plugin --profile web add github:yifangyun/dsh-cloud-disk#v0.1.1-rc.2.cloud.2
```

安装后可检查实际装配结果，命令不会启动 Web 服务：

```sh
dsh --profile web --dump-config
```

输出应包含 `@aicloud360/dsh-cloud-disk`、`@aicloud360/dsh-cloud-disk-api-provider`、`@aicloud360/dsh-client-ui-cloud-disk` 和 `@aicloud360/dsh-cloud-disk-bundle/mcp-host`。它不安装 Preset；配置 `CLOUD_DISK_API_KEY` 后，MCP bridge 会为所有 Preset 注册允许的云盘工具。

Desktop 用户在插件中心安装同一个 Bundle。安装后重启 Host 并确认侧边栏出现“云盘”；新版运行时位于主侧边栏，`dsh@0.1.1-rc.2` 位于侧边栏底部并在右侧工作区打开云盘。工作台完成凭据配置、连接、目录浏览和搜索；连接成功后可直接确认断开。

## 云盘 Preset

Bundle 的 MCP bridge 为所有 Preset 提供允许的云盘工具；选择“云盘模式”不会再注册重复的 `cloud_disk_list` 或 `cloud_disk_search`。该模式保留为后续云盘专有能力的入口。

## 卸载

无论最初从 npm 还是 GitHub 安装，均按 Bundle 的实际包名卸载：

```sh
dsh plugin --profile web remove @aicloud360/dsh-cloud-disk-bundle
```

不要移除 Profile 自带的基础 Bundle。

## 隔离自动验证

以下流程不会写入 `~/.dsh`、当前项目、全局 `dsh` 或现有 Profile。

```sh
TEST_WORK="$(mktemp -d /tmp/dsh-cloud-disk-work.XXXXXX)"
NPM_TEST_HOME="$(mktemp -d /tmp/dsh-cloud-disk-npm-home.XXXXXX)"
GIT_TEST_HOME="$(mktemp -d /tmp/dsh-cloud-disk-git-home.XXXXXX)"

cd "$TEST_WORK"
DSH_TELEMETRY_DISABLED=1 DSH_HOME="$NPM_TEST_HOME" \
  dsh plugin --profile web add @aicloud360/dsh-cloud-disk-bundle@0.1.1-rc.2.cloud.2
DSH_TELEMETRY_DISABLED=1 DSH_HOME="$NPM_TEST_HOME" \
  dsh --profile web --dump-config > "$TEST_WORK/npm-cloud-disk.yml"
rg "@aicloud360/dsh-(cloud-disk|cloud-disk-api-provider|client-ui-cloud-disk)" "$TEST_WORK/npm-cloud-disk.yml"
DSH_TELEMETRY_DISABLED=1 DSH_HOME="$NPM_TEST_HOME" \
  dsh plugin --profile web remove @aicloud360/dsh-cloud-disk-bundle

DSH_TELEMETRY_DISABLED=1 DSH_HOME="$GIT_TEST_HOME" \
  dsh plugin --profile web add github:yifangyun/dsh-cloud-disk#v0.1.1-rc.2.cloud.2
DSH_TELEMETRY_DISABLED=1 DSH_HOME="$GIT_TEST_HOME" \
  dsh --profile web --dump-config > "$TEST_WORK/git-cloud-disk.yml"
rg "@aicloud360/dsh-(cloud-disk|cloud-disk-api-provider|client-ui-cloud-disk)" "$TEST_WORK/git-cloud-disk.yml"
DSH_TELEMETRY_DISABLED=1 DSH_HOME="$GIT_TEST_HOME" \
  dsh plugin --profile web remove @aicloud360/dsh-cloud-disk-bundle
```

两种安装均应完成，配置转储应包含三个实际装配行，且卸载成功。验证界面时，新版运行时检查主侧边栏；`dsh@0.1.1-rc.2` 检查侧边栏底部和右侧工作区。

## pnpm peer 提示

`dsh plugin add` 可能显示运行时 peer dependency 提示；以配置转储和 Web Profile 启动作为验收依据。

## 连接和界面验证

自动流程不会访问云盘 API 或填写凭据。需要验证实际浏览时，在临时 Home 中启动 Web Profile：

```sh
DSH_TELEMETRY_DISABLED=1 DSH_HOME="$NPM_TEST_HOME" dsh --profile web
```

在浏览器中确认云盘入口和工作台。填写测试 API Key 和签名材料后，验证连接、目录浏览、搜索、刷新和续页，再删除测试凭据。

## 发布前本地验证

以下命令构建四个包，将其作为本地 `file:` 依赖装入临时 Profile。CLI 验证会解析 npm 的官方 `@deepseek-ai/dsh@latest` 并使用该精确版本启动；Desktop 验证使用当前项目的 Desktop Host。不会向 npm 发布、写入 `~/.dsh` 或修改现有 Desktop 数据。关闭 CLI Web 或 Desktop 窗口后，脚本会删除临时目录。

```sh
pnpm run verify:cloud-disk-local -- --mode cli
pnpm run verify:cloud-disk-local -- --mode desktop
```

复现指定官方 CLI 版本时，为 CLI 命令加入 `--dsh-version <version>`。

只检查本地候选物时运行：

```sh
pnpm run prepare:cloud-disk-local
```

该命令把四个公开命名包写入被 Git 忽略的 `artifacts/cloud-disk-local/`，其内部依赖指向相邻的本地包。它不是 npm 或 GitHub 发布物，不能用于插件中心的正式安装验证。为检查验证后的临时目录，可给启动命令加入 `--keep`。
