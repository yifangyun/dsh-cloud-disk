# `@aicloud360/dsh-cloud-disk-bundle`

English | [中文](README.zh.md)

This optional Profile Bundle installs the Host-side CloudDisk service, direct 360 API Provider, and CloudDisk workspace. Desktop Plugin Center and `dsh plugin` install the same Bundle. When the runtime provides first-level page slots, the workspace appears as the Cloud Disk item in the primary sidebar. Older runtimes show Cloud Disk in the sidebar footer and open the same full-screen workspace. It does not add tools to any Agent. The CloudDisk tools come from the user-installed CloudDisk Preset in Desktop Preset Square: choose it for a new session, or make it the default for future new sessions. The Provider resolves `CLOUD_DISK_API_KEY` and `CLOUD_DISK_SIGNING_SECRET` by reference through `dsh-credentials`; no secret value belongs in the Bundle or a Preset.

[`cordis.patch.yml`](cordis.patch.yml) includes the audited, non-secret production defaults for the endpoint, client identifiers, timeout, and retry count. A profile overlay may replace them when a deployment requires different values. On first visit, each user is prompted to save their own API Key and signing material through the Host credential store; the UI reads only configured state, never credential values. Users can replace either value or delete both local credentials from the same page. The signing material remains a Host-only prerequisite for each user's requests.

The browser supports directory navigation with a clickable path, search, refresh, and incremental loading when the remote API supplies a continuation cursor. The Bundle does not invent additional pages when a directory fits in one remote response. It distinguishes incomplete Host configuration, missing credentials or signing material, rejected authentication, network failures, and remote service failures without exposing secret values or remote response bodies.

## Known Limitations and Deferred Work

- The standalone Bundle provides deterministic browsing only. CloudDisk tools are enabled only in the user-selected or default CloudDisk Preset.
- The released operations are read-only: account lookup, directory browsing, search, and pagination. Upload, download, sharing, mutations, transfers, and destructive-operation approvals are deferred.
- The Provider requires user-supplied API and signing credentials through the Host credential store. The Bundle cannot supply, recover, or rotate either value.
