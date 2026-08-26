import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
interface CloudDiskFooterInjected {
    readonly open: () => void;
}
type CloudDiskFooterProps = PropsRuntime<'sidebar.footer.action'> & PropsLocale<'cloudDisk'> & InjectFace<CloudDiskFooterInjected>;
/** Opens the legacy full-screen CloudDisk workspace from the sidebar foot. */
export declare function CloudDiskFooterItem({ wide, open, t }: CloudDiskFooterProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=CloudDiskFooterItem.d.ts.map