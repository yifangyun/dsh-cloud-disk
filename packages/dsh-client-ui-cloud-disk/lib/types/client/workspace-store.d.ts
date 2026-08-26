import { type EngineStoreHandle } from '@deepseek-ai/dsh-client-runtime/client';
/** Shared visibility state for the legacy CloudDisk workspace. */
export interface CloudDiskWorkspaceState {
    open: boolean;
}
type CloudDiskWorkspaceActions = {
    open: (draft: CloudDiskWorkspaceState) => void;
    close: (draft: CloudDiskWorkspaceState) => void;
};
/**
 * Create the root-scoped legacy workspace store.
 * @returns the shared visibility handle used by the footer action and overlay.
 */
export declare function createCloudDiskWorkspaceStore(): EngineStoreHandle<CloudDiskWorkspaceState, CloudDiskWorkspaceActions>;
export {};
//# sourceMappingURL=workspace-store.d.ts.map