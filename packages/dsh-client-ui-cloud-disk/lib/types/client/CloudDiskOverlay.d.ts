import type { InjectFace, PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import { type CloudDiskPageInjected } from './CloudDiskPage.tsx';
import type { createCloudDiskWorkspaceStore } from './workspace-store.ts';
interface CloudDiskOverlayInjected extends CloudDiskPageInjected {
}
type CloudDiskOverlayProps = PropsRuntime<'shell.overlay'> & PropsLocale<'cloudDisk'> & PropsStore<ReturnType<typeof createCloudDiskWorkspaceStore>> & InjectFace<CloudDiskOverlayInjected>;
/** Right-side CloudDisk workspace for runtimes without first-level page slots. */
export declare function CloudDiskOverlay({ api, t, useStore }: CloudDiskOverlayProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=CloudDiskOverlay.d.ts.map