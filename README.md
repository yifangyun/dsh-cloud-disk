# `@aicloud360/dsh-cloud-disk-bundle`

English | [中文](README.zh.md)

This optional Profile Bundle installs the Host-side CloudDisk service, direct 360 API Provider, CloudDisk workspace, and a local stdio CloudDisk MCP bridge. Desktop Plugin Center and `dsh plugin` install the same Bundle. The bridge registers the selected CloudDisk tools at the Host level, so built-in and user Presets can call them directly. The Provider resolves the user `CLOUD_DISK_API_KEY` through `dsh-credentials`; the MCP child receives it only as `API_KEY` at startup. Missing or deleted credentials leave its tools unavailable, while a set or replacement starts a new child. `toolCallTimeoutMs` in [`cordis.patch.yml`](cordis.patch.yml) bounds each MCP call.

[`cordis.patch.yml`](cordis.patch.yml) contains the application signing material as a literal deployment value. Anyone able to read the Bundle can read it. The same file includes the endpoint, client identifiers, timeout, and retry count. On first visit, each user is prompted to save their API Key through the Host credential store; the UI reads only configured state, never credential values.

The browser supports directory navigation with a clickable path, refresh, and incremental loading when the remote API supplies a continuation cursor. The Bundle does not invent additional pages when a directory fits in one remote response. It distinguishes incomplete Host configuration, missing API Key, rejected authentication, network failures, and remote service failures without exposing user API Keys or remote response bodies.

## Known Limitations and Deferred Work

- The Bundle exposes only the ten operations documented by the CloudDisk Skill. Create, move, rename, save, share, and upload ask for Harness approval; delete and other MCP operations are not registered.
- The Provider requires a user API Key through the Host credential store. Signing-material rotation requires editing and redeploying the Bundle configuration.
