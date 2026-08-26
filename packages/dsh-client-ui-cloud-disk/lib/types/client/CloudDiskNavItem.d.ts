import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { CloudDiskKey } from './locales.ts';
interface CloudDiskNavInjected {
    readonly pageId: string;
    readonly open: () => void;
}
type CloudDiskNavProps = PropsRuntime<'sidebar.primary.action'> & PropsLocale<'cloudDisk'> & InjectFace<CloudDiskNavInjected>;
/** First-level sidebar entry for the CloudDisk browser and connection flow. */
export declare function CloudDiskNavItem({ wide, primaryPage, pageId, open, t }: CloudDiskNavProps): import("react").JSX.Element;
export type { CloudDiskKey };
//# sourceMappingURL=CloudDiskNavItem.d.ts.map