/** Private Connection RPC for the CloudDisk browser workspace. */
import type { Context } from '@deepseek-ai/cordis';
/**
 * Register the CloudDisk browser RPC channel. Credential endpoints only address
 * the two CloudDisk references, so this plugin cannot become a general
 * credential-inspection surface.
 * @param ctx - Host context with the selected CloudDisk provider and credentials.
 */
export declare function installCloudDiskRpc(ctx: Context): void;
//# sourceMappingURL=cloud-disk-rpc.d.ts.map