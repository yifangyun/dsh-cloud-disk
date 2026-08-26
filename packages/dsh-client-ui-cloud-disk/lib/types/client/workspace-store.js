import { defineStore } from '@deepseek-ai/dsh-client-runtime/client';
/**
 * Create the root-scoped legacy workspace store.
 * @returns the shared visibility handle used by the footer action and overlay.
 */
export function createCloudDiskWorkspaceStore() {
    return defineStore({
        init: () => ({ open: false }),
        actions: {
            open: (draft) => { draft.open = true; },
            close: (draft) => { draft.open = false; },
        },
    });
}
//# sourceMappingURL=workspace-store.js.map