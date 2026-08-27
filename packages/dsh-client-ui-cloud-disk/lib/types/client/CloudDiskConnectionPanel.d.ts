import type { CloudDiskKey } from './locales.ts';
interface CloudDiskConnectionPanelProps {
    readonly t: (key: CloudDiskKey) => string;
    readonly apiKey: string;
    readonly apiKeyConfigured: boolean;
    readonly connecting: boolean;
    readonly failure?: string;
    readonly onApiKeyChange: (value: string) => void;
    readonly onConnect: () => void;
}
/**
 * Renders the standalone local-credential connection view.
 * @param props - Connection state and user actions supplied by the CloudDisk page.
 * @returns Centered connection management controls.
 */
declare function CloudDiskConnectionPanel(props: CloudDiskConnectionPanelProps): import("react").JSX.Element;
export { CloudDiskConnectionPanel };
//# sourceMappingURL=CloudDiskConnectionPanel.d.ts.map