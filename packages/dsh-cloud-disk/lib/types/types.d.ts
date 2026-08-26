/**
 * Stable vocabulary for the CloudDisk capability seam.
 * @module @aicloud360/dsh-cloud-disk/types
 */
import { HarnessError } from '@deepseek-ai/dsh-llm';
import type { CredentialRef } from '@deepseek-ai/dsh-credentials';
/** Opaque identity of one remote cloud-disk node. */
export type CloudDiskNodeId = string & {
    readonly __cloudDiskNodeId: unique symbol;
};
/** Remote node kind exposed to UI and Agent consumers. */
export type CloudDiskNodeKind = 'file' | 'directory';
/** One normalized remote file or directory. */
export interface CloudDiskNode {
    readonly id: CloudDiskNodeId;
    readonly kind: CloudDiskNodeKind;
    readonly name: string;
    readonly parentId?: CloudDiskNodeId;
    readonly size?: number;
    readonly updatedAt?: string;
}
/** A bounded page of remote nodes. */
export interface CloudDiskPage {
    readonly nodes: readonly CloudDiskNode[];
    readonly nextCursor?: string;
}
/** Current-user information without credential material. */
export interface CloudDiskUser {
    readonly id: string;
    readonly displayName?: string;
}
/** Request for one directory page. */
export interface CloudDiskListRequest {
    readonly parentId?: CloudDiskNodeId;
    readonly cursor?: string;
    readonly limit?: number;
}
/** Request for a remote name/content search. */
export interface CloudDiskSearchRequest {
    readonly query: string;
    readonly cursor?: string;
    readonly limit?: number;
}
/** Provider-neutral read capability. */
export interface CloudDiskProvider {
    readonly id: string;
    available(): boolean;
    getUser(signal?: AbortSignal): Promise<CloudDiskUser>;
    list(request: CloudDiskListRequest, signal?: AbortSignal): Promise<CloudDiskPage>;
    search(request: CloudDiskSearchRequest, signal?: AbortSignal): Promise<CloudDiskPage>;
}
/** Stable service failure codes used by all CloudDisk consumers. */
export type CloudDiskErrorCode = 'CLOUD_DISK_DUPLICATE_PROVIDER' | 'CLOUD_DISK_PROVIDER_CONFIGURED_MISSING' | 'CLOUD_DISK_PROVIDER_CONFIGURED_UNAVAILABLE' | 'CLOUD_DISK_PROVIDER_UNAVAILABLE' | 'CLOUD_DISK_PROVIDER_AMBIGUOUS' | 'CLOUD_DISK_CREDENTIAL_MISSING' | 'CLOUD_DISK_SIGNING_SECRET_MISSING' | 'CLOUD_DISK_AUTHENTICATION_FAILED' | 'CLOUD_DISK_NETWORK_FAILED' | 'CLOUD_DISK_INVALID_REQUEST' | 'CLOUD_DISK_PROVIDER_FAILED';
/** Typed failure that consumers can route without matching external API text. */
export declare class CloudDiskError extends HarnessError {
}
/** Host-side provider configuration; the reference is never the secret value. */
export interface CloudDiskProviderConfig {
    readonly credentialRef: CredentialRef;
    readonly endpoint: string;
}
//# sourceMappingURL=types.d.ts.map