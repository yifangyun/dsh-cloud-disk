import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import { type CloudDiskKey } from './locales.ts';
export type { CloudDiskPageInjected, CloudDiskPageProps } from './CloudDiskPage.tsx';
export type { CloudDiskKey } from './locales.ts';
export declare const inject: string[];
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        cloudDisk: CloudDiskKey;
    }
}
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map