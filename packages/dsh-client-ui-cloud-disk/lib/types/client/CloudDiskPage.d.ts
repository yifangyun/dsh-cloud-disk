import type { IApiClient } from '@deepseek-ai/dsh-client-connection/client';
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
export interface CloudDiskPageInjected {
    readonly api: Pick<IApiClient, 'cloudDisk' | 'credentials'>;
}
export type CloudDiskPageProps = PropsLocale<'cloudDisk'> & CloudDiskPageInjected & {
    /** True when the containing dialog supplies the page title. */
    readonly inDialog?: boolean;
};
export declare function CloudDiskPage({ api, t, inDialog }: CloudDiskPageProps): import("react").JSX.Element;
//# sourceMappingURL=CloudDiskPage.d.ts.map