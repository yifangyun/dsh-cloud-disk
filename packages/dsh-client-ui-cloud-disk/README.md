# `@aicloud360/dsh-client-ui-cloud-disk`

English | [中文](README.zh.md)

CloudDisk browser client plugin. It detects the slots declared by the active runtime rather than the Desktop or DSH version. A runtime with both `sidebar.primary.action` and `main.page` gets the first-level sidebar action and keyed primary page. An older runtime gets a `sidebar.footer.action` entry that opens the same full-screen CloudDisk workspace through `shell.overlay`. The workspace uses the Host CloudDisk RPC for connection setup, credential replacement and deletion, user lookup, browsing, search, refresh, and cursor-based loading. It never reads credential values; the Host credential API accepts the values only while the user saves them.

The plugin is a deterministic browser surface. It contributes no Agent tools and does not create, install, select, or modify an Agent Preset. The CloudDisk Bundle supplies the required Host service and Provider.

## Known Limitations and Deferred Work

- The page supports read-only account lookup, directory browsing, search, and pagination only. File details, downloads, uploads, sharing, mutations, and transfers are deferred.
- The page does not start a CloudDisk Agent session. The repository's integrated Preset remains separate from this published client package.
- The page is unavailable when the Host does not mount the CloudDisk RPC or credentials API, and it cannot recover a missing Host credential source.
