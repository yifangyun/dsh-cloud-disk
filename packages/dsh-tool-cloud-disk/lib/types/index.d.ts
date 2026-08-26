/**
 * Model-facing `cloud_disk_list` and `cloud_disk_search` tools over `ctx.cloudDisk`.
 * This package owns schemas, validation, model guidance, and presentation; it never
 * owns credential resolution, HTTP, provider selection, or pagination — those belong
 * to the seam and the Host-side provider. Stable node ids flow back to the model so
 * a later action can target the same remote object.
 * @module @aicloud360/dsh-tool-cloud-disk
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
/** Cordis plugin name used by loader diagnostics. */
export declare const name = "tool-cloud-disk";
/** Services required by the CloudDisk tool suite. */
export declare const inject: string[];
/** Default cooperative tool-call timeout budget (ms) for the CloudDisk tools. */
export declare const DEFAULT_CLOUD_DISK_TOOL_TIMEOUT_MS = 30000;
/** Default upper bound on nodes returned by one CloudDisk page. */
export declare const DEFAULT_PAGE_LIMIT = 50;
/** Plugin config: which CloudDisk tools to register and the per-call page bound. */
export interface Config {
    /** Register `cloud_disk_list`. Defaults to true. */
    list?: boolean;
    /** Register `cloud_disk_search`. Defaults to true. */
    search?: boolean;
    /** Cooperative timeout budget (ms) for both tools. Defaults to 30000. */
    timeoutMs?: number;
    /** Upper bound on nodes in one page. Defaults to 50. */
    pageLimit?: number;
}
export declare const Config: z<Config>;
/** The `cloud_disk_list`/`cloud_disk_search` tool's private `tool/result` meta payload. */
export interface CloudDiskPageMeta {
    /** The node ids returned this page, in result order. */
    ids: string[];
    /** Whether another page may follow the returned cursor. */
    hasMore: boolean;
}
/**
 * Register the enabled CloudDisk tools and their system-prompt guidance.
 *
 * @param ctx - context whose `tools`, `cloudDisk`, and `systemPrompt` are composed
 *   (tools/systemPrompt registrations are effect-scoped and unregister on dispose).
 * @param config - resolved tool config.
 */
export declare function apply(ctx: Context, config: Config): void;
//# sourceMappingURL=index.d.ts.map