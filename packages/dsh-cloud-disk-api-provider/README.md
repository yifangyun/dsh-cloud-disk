# @aicloud360/dsh-cloud-disk-api-provider

English | [中文](README.zh.md)

Host-side direct 360 CloudDisk OpenAPI provider. It exchanges a Host-held user credential for an access token, signs directory and search requests with a separate Host-held application secret, and returns only normalized CloudDisk values.

## Configuration

`DirectCloudDiskProviderOptions` requires these Host-only values:

| Field | Meaning |
|---|---|
| `credentialRef` | User API-key reference. |
| `signingSecret` | Required application signing material from Host configuration. |
| `endpoint` | Audited OpenAPI endpoint. |
| `clientEnv`, `clientSource`, `subChannel` | Deployment identity sent during authentication. |
| `credentials`, `http` | Host credential and HTTP providers. |
| `timeoutMs`, `maxRetries` | Per-attempt timeout and retry limit. |

The user key, access token, qid, signing secret, request headers, and raw API responses must never reach a browser, Session, model, URL, log, or diagnostic.

## Read operations

`getUser()` exchanges the user credential and reads the current user. `list()` maps `File.getList` pages; listed directory ids are resolved to their path only within the current credential generation. `search()` maps form-encoded `File.searchList` pages. Both cursors are opaque source-page numbers.

The provider rejects a missing user credential before a request. A missing signing secret rejects Bundle configuration at load. A credential change clears the in-memory directory-path map. Caller cancellation is not retried; retryable transport failures and retryable HTTP statuses are bounded by `maxRetries`.

## Deployment prerequisite

The signing secret is a literal Host configuration value. The CloudDisk Bundle intentionally places a replacement marker in its tracked patch file, so replacing it with a real value exposes that value to every reader of the Bundle. The package includes a production fetch transport and the Bundle composes its Provider registration.

## Known Limitations and Deferred Work

- The Provider implements only user lookup, directory listing, and search. It has no upload, download, mutation, sharing, or transfer API.
- One configured Provider serves one Host process. Multi-account switching and remote change observation are not implemented.
- Signing material has no managed distribution or rotation service in this package.
