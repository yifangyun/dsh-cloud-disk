# `@aicloud360/dsh-cloud-disk-bundle`

English | [中文](README.zh.md)

This optional Profile Bundle installs the Host-side CloudDisk service, direct 360 API Provider, and CloudDisk workspace. Desktop Plugin Center and `dsh plugin` install the same Bundle. When the runtime provides first-level page slots, the workspace appears as the Cloud Disk item in the primary sidebar. Older runtimes show Cloud Disk in the sidebar footer and open its workspace in a global modal. It does not add tools to any Agent. The CloudDisk tools come from the user-installed CloudDisk Preset in Desktop Preset Square: choose it for a new session, or make it the default for future new sessions. The Provider resolves the user `CLOUD_DISK_API_KEY` through `dsh-credentials`; its application signing material is the literal `signingSecret` value in the Bundle configuration.

Replace `signingSecret: REPLACE_WITH_360_SIGNING_SECRET` in [`cordis.patch.yml`](cordis.patch.yml) with the application signing material before use. This is intentionally source-controlled deployment configuration, so anyone able to read the Bundle can read the value. The same file includes the endpoint, client identifiers, timeout, and retry count. On first visit, each user is prompted to save their API Key through the Host credential store; the UI reads only configured state, never credential values.

The browser supports directory navigation with a clickable path, refresh, and incremental loading when the remote API supplies a continuation cursor. The Bundle does not invent additional pages when a directory fits in one remote response. It distinguishes incomplete Host configuration, missing API Key, rejected authentication, network failures, and remote service failures without exposing user API Keys or remote response bodies.

## Known Limitations and Deferred Work

- The standalone Bundle provides deterministic browsing only. CloudDisk tools are enabled only in the user-selected or default CloudDisk Preset.
- The released operations are read-only: account lookup, directory browsing, and pagination. Upload, download, search, sharing, mutations, transfers, and destructive-operation approvals are deferred.
- The Provider requires a user API Key through the Host credential store. Signing-material rotation requires editing and redeploying the Bundle configuration.
