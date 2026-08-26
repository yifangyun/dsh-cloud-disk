import type { CloudDiskKey } from './locales.ts';
interface CloudDiskConnectionPanelProps {
    readonly t: (key: CloudDiskKey) => string;
    readonly apiKey: string;
    readonly signingSecret: string;
    readonly apiKeyConfigured: boolean;
    readonly signingSecretConfigured: boolean;
    readonly connecting: boolean;
    readonly failure?: string;
    readonly confirmDisconnect: boolean;
    readonly canReturnToDisk: boolean;
    readonly user?: string;
    readonly showCredentialFields: boolean;
    readonly onApiKeyChange: (value: string) => void;
    readonly onSigningSecretChange: (value: string) => void;
    readonly onConnect: () => void;
    readonly onStartDisconnect: () => void;
    readonly onDisconnect: () => void;
    readonly onCancelDisconnect: () => void;
    readonly onReturnToDisk: () => void;
    readonly onShowCredentialFields: () => void;
}
/**
 * Renders the standalone local-credential connection view.
 * @param props - Connection state and user actions supplied by the CloudDisk page.
 * @returns Centered connection management controls.
 */
declare function CloudDiskConnectionPanel(props: CloudDiskConnectionPanelProps): import("react").JSX.Element;
export { CloudDiskConnectionPanel };
//# sourceMappingURL=CloudDiskConnectionPanel.d.ts.map