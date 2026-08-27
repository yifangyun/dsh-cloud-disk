/** CloudDisk's stable private RPC client over the generic Connection channel. */
import type { ConnectionHandle, IApiClient } from '@deepseek-ai/dsh-client-connection/client';
type CloudDiskApi = Pick<IApiClient, 'cloudDisk' | 'credentials'>;
/**
 * Create the CloudDisk browser API from the plugin-private generic RPC channel.
 * The returned credentials methods accept only the CloudDisk API-key reference;
 * they cannot be used to inspect or modify unrelated Host credentials.
 * @param connection - active browser-to-Host connection.
 * @returns The API subset consumed by the CloudDisk workspace.
 */
export declare function createCloudDiskApi(connection: ConnectionHandle): CloudDiskApi;
export {};
//# sourceMappingURL=cloud-disk-api.d.ts.map