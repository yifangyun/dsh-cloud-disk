# @aicloud360/dsh-cloud-disk

English | [中文](README.zh.md)

`CloudDiskRuntime` (`ctx.cloudDisk`) defines the provider-neutral native cloud-disk seam used by the 360 AI Cloud Disk UI and Agent consumers. It owns stable node, page, user, provider, and error vocabulary; it does not expose MCP transport, tool result blocks, or external API types.

## Service API

| Member | Semantics |
|---|---|
| `registerProvider(provider)` | Registers one backend by stable id and returns a disposer. Duplicate ids throw `CLOUD_DISK_DUPLICATE_PROVIDER`. |
| `getUser(signal?)` | Reads normalized user information through the selected provider. |
| `list(request, signal?)` | Reads one normalized remote directory page. |
| `search(request, signal?)` | Searches remote nodes and returns stable node ids. |

Provider selection occurs at execution time. A configured `provider` id must be registered and available. Without one, exactly one available provider is required; missing, unavailable, ambiguous, and empty registries use the stable `CloudDiskError` codes.

## Security and model experience

The service accepts a credential reference in provider configuration, never credential bytes. API key resolution, HTTP requests, authentication, signing, retries, and external response parsing belong to a Host-side provider. Consumers receive only normalized domain values. A model-facing consumer must log every directory or file id it sends to the model; this package itself contributes no prompt or model-facing tool.

#### KV Cache effect

No direct invalidation. Agent and UI consumers own prompt-prefix and context updates.

## Known Limitations and Deferred Work

- This first seam contains read-only user, listing, and search operations. Mutations, transfers, approvals, and invalidation events are added only with their owning executor and tests.
- The service does not provide an observation or status API; availability is observed by executing an operation and routing `CloudDiskError`.
- The direct 360 API provider is a separate package and is not an MCP runtime dependency.
