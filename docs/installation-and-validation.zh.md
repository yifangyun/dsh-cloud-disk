# CloudDisk 安装与发布验证

本文适用于 `@aicloud360/dsh-cloud-disk-bundle@0.1.1-alpha.1`。`dsh plugin` 会把参数转交给 pnpm，因此运行机器必须有可用的 `dsh` 和 `pnpm`。

## 安装

选择要启用云盘的 Profile。推荐从 npm 安装固定版本：

```sh
dsh plugin --profile web add @aicloud360/dsh-cloud-disk-bundle@0.1.1-alpha.1
```

也可以从 GitHub 安装最新 `main`：

```sh
dsh plugin --profile web add github:yifangyun/dsh-cloud-disk#main
```

两种方式都只需要这一条 Bundle 安装命令。pnpm 会自动安装 Bundle 的四个组件依赖；不要分别安装五个包。npm 固定版本适合可重现部署，GitHub `main` 适合验证仓库最新提交。

安装后可检查实际装配结果，命令不会启动 Web 服务：

```sh
dsh --profile web --dump-config
```

输出应包含 `@aicloud360/dsh-cloud-disk`、`@aicloud360/dsh-cloud-disk-api-provider` 和 `@aicloud360/dsh-client-ui-cloud-disk`。它不应安装 Preset，也不应为通用 Agent 添加云盘工具。

## 卸载

无论最初从 npm 还是 GitHub 安装，均按 Bundle 的实际包名卸载：

```sh
dsh plugin --profile web remove @aicloud360/dsh-cloud-disk-bundle
```

该命令会从 Profile 的 Bundle 列表移除云盘层。不要移除 Profile 自带的基础 Bundle；pnpm 对不再被依赖使用的 CloudDisk 组件进行常规依赖清理。

## 隔离自动验证

以下流程创建临时 Home 和临时工作目录，不会写入 `~/.dsh`、当前项目、全局 `dsh` 或现有 Profile。npm 与 GitHub 安装使用不同的临时 Home，避免结果相互影响。

```sh
TEST_WORK="$(mktemp -d /tmp/dsh-cloud-disk-work.XXXXXX)"
NPM_TEST_HOME="$(mktemp -d /tmp/dsh-cloud-disk-npm-home.XXXXXX)"
GIT_TEST_HOME="$(mktemp -d /tmp/dsh-cloud-disk-git-home.XXXXXX)"

cd "$TEST_WORK"
DSH_TELEMETRY_DISABLED=1 DSH_HOME="$NPM_TEST_HOME" \
  dsh plugin --profile web add @aicloud360/dsh-cloud-disk-bundle@0.1.1-alpha.1
DSH_TELEMETRY_DISABLED=1 DSH_HOME="$NPM_TEST_HOME" \
  dsh --profile web --dump-config > "$TEST_WORK/npm-cloud-disk.yml"
rg "@aicloud360/dsh-(cloud-disk|cloud-disk-api-provider|client-ui-cloud-disk)" "$TEST_WORK/npm-cloud-disk.yml"
DSH_TELEMETRY_DISABLED=1 DSH_HOME="$NPM_TEST_HOME" \
  dsh plugin --profile web remove @aicloud360/dsh-cloud-disk-bundle

DSH_TELEMETRY_DISABLED=1 DSH_HOME="$GIT_TEST_HOME" \
  dsh plugin --profile web add github:yifangyun/dsh-cloud-disk#main
DSH_TELEMETRY_DISABLED=1 DSH_HOME="$GIT_TEST_HOME" \
  dsh --profile web --dump-config > "$TEST_WORK/git-cloud-disk.yml"
rg "@aicloud360/dsh-(cloud-disk|cloud-disk-api-provider|client-ui-cloud-disk)" "$TEST_WORK/git-cloud-disk.yml"
DSH_TELEMETRY_DISABLED=1 DSH_HOME="$GIT_TEST_HOME" \
  dsh plugin --profile web remove @aicloud360/dsh-cloud-disk-bundle
```

成功标准是两种安装方式均能完成、配置转储包含三个实际装配行，并且 Bundle 卸载命令成功。临时目录只在验证完成后清理，方便排查失败的 pnpm 日志与 Profile manifest。

## pnpm peer 提示

外部 Profile 的 `package.json` 只直接记录安装的 Bundle。`dsh` 自身提供的 `@deepseek-ai/*` 运行时包通过 Profile 模块回退路径解析，因此 `dsh plugin add` 可能显示这些 peer dependency 的 pnpm 提示。不要以 `pnpm peers check` 作为此 Bundle 的运行时验收条件；以 `dsh --profile web --dump-config` 成功解析配置，以及 Web Profile 能够启动为准。实际部署仍必须使用与 Bundle 兼容的 `dsh` 发行版。

## 连接和界面验证

自动流程不会访问云盘 API，也不会填写凭据。需要验证实际浏览时，在其中一个临时 Home 中启动 Web Profile：

```sh
DSH_TELEMETRY_DISABLED=1 DSH_HOME="$NPM_TEST_HOME" dsh --profile web
```

在浏览器中确认左侧栏出现云盘入口。填写测试 API Key 和签名材料后，确认连接、目录浏览、搜索、刷新和续页可用，再在同一页面删除测试凭据。凭据仅保存在临时 Home，绝不写入当前用户的 `~/.dsh`。
