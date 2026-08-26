/** Package-owned invariant companion for the optional CloudDisk Bundle. */
import type { Context } from '@deepseek-ai/cordis';
/** Cordis companion plugin name. */
export declare const name = "cloud-disk-bundle-invariant";
/** Service required before the companion can register. */
export declare const inject: string[];
/**
 * Register the Bundle invariant companion.
 * @param ctx - context carrying the invariant registry.
 * @returns registration disposer.
 */
export declare const apply: (ctx: Context) => Promise<() => void>;
//# sourceMappingURL=invariant.d.ts.map