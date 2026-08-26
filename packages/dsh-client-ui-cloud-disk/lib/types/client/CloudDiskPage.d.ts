import type { IApiClient } from '@deepseek-ai/dsh-client-connection/client';
import type { PropsRuntime, PropsLocale, InjectFace } from '@deepseek-ai/dsh-client-ui-slots';
export interface CloudDiskPageInjected {
    readonly api: Pick<IApiClient, 'cloudDisk' | 'credentials'>;
}
export type CloudDiskPageProps = PropsRuntime<'main.page'> & PropsLocale<'cloudDisk'> & InjectFace<CloudDiskPageInjected>;
export declare function CloudDiskPage({ api, t }: CloudDiskPageProps): import("react").JSX.Element;
//# sourceMappingURL=CloudDiskPage.d.ts.map