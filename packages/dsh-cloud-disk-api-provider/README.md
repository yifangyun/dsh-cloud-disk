# @aicloud360/dsh-cloud-disk-api-provider

English | [中文](README.zh.md)

Host-side direct 360 CloudDisk OpenAPI provider. It exchanges a Host-held user credential for an access token, signs directory and search requests with a separate Host-held application secret, and returns only normalized CloudDisk values.

## Configuration

`DirectCloudDiskProviderOptions` requires these Host-only values:

| Field | Meaning |
|---|---|
| `credentialRef` | User API-key reference. |
| `signingSecretRef` | Application signing-secret reference. |
| `endpoint` | Audited OpenAPI endpoint. |
| `clientEnv`, `clientSource`, `subChannel` | Deployment identity sent during authentication. |
| `credentials`, `http` | Host credential and HTTP providers. |
| `timeoutMs`, `maxRetries` | Per-attempt timeout and retry limit. |

The user key, access token, qid, signing secret, request headers, and raw API responses must never reach a browser, Session, model, URL, log, or diagnostic.

## Read operations

`getUser()` exchanges the user credential and reads the current user. `list()` maps `File.getList` pages; listed directory ids are resolved to their path only within the current credential generation. `search()` maps form-encoded `File.searchList` pages. Both cursors are opaque source-page numbers.

The provider rejects a missing user credential or signing secret before a signed request. A credential change clears the in-memory directory-path map. Caller cancellation is not retried; retryable transport failures and retryable HTTP statuses are bounded by `maxRetries`.

## Deployment prerequisite

The signing secret needs an approved, rotatable Host-only source. Do not copy signing material from an MCP reference project or commit it to source, fixtures, Bundle YAML, or client configuration. The package includes a production fetch transport, but remains a tested Provider implementation until that secret source and Provider registration are composed into the Bundle.

## Known Limitations and Deferred Work

- The Provider implements only user lookup, directory listing, and search. It has no upload, download, mutation, sharing, or transfer API.
- One configured Provider serves one Host process. Multi-account switching and remote change observation are not implemented.
- Signing material remains a user-managed Host credential in this release; a managed distribution or rotation service is not part of this package.
