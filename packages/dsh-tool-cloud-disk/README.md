# @aicloud360/dsh-tool-cloud-disk

English | [中文](README.zh.md)

`@aicloud360/dsh-tool-cloud-disk` registers the model-facing `cloud_disk_list` and `cloud_disk_search` tools over `ctx.cloudDisk`. It owns tool schemas, validation, model guidance, rendering, and presentation metadata; provider selection, credentials, HTTP, pagination transport, and remote error mapping remain in the CloudDisk seam and its Host-side provider.

## Tools

| Tool | Input | Output |
|---|---|---|
| `cloud_disk_list` | Optional `parentId`, `cursor`, and positive `limit`. Omit `parentId` for the root. | One page of stable node ids, kinds, names, optional metadata, and `nextCursor`. |
| `cloud_disk_search` | Required non-empty `query`, optional `cursor` and positive `limit`. | One page of matching nodes and an optional `nextCursor`. |

Each call is a read-only provider operation and is marked concurrency-safe. Results render stable ids so later model turns can refer to the same remote file or folder. A returned cursor is not fetched automatically; the model must pass it explicitly to request the next page.

## Configuration

- `list` and `search` enable the corresponding tools and default to `true`.
- `timeoutMs` sets the cooperative tool-call timeout and defaults to `30000`.
- `pageLimit` supplies the default page size and defaults to `50`.

The package requires the `cloudDisk` service. It does not resolve credentials or expose API keys to tool arguments, rendered output, presentation metadata, session text, or prompts.

## Model and KV-cache effects

The plugin adds one system-prompt section explaining that CloudDisk tools return stable ids. List and search results are model-visible tool output and therefore carry remote node names and ids into the session transcript. The package does not directly invalidate a prompt-prefix or KV cache; the owning agent/session runtime decides when new tool output changes a request.

## Known Limitations and Deferred Work

- This consumer is read-only. Mutations, transfers, approval categories, and change events require their own executor and session contract.
- The tools expose normalized service pages, not provider-specific fields or MCP result blocks.
- UI browsing is not implemented here; deterministic UI consumers should call the CloudDisk service directly rather than drive these model tools.
