/** CloudDisk-owned stdio MCP bridge with fixed tool and approval policy. */
import type { Context } from '@deepseek-ai/cordis';
import s from '@deepseek-ai/schemastery';
/** Cordis plugin name used by loader diagnostics. */
export declare const name = "cloud-disk-mcp-host";
/** The bridge registers host-global model tools. */
export declare const inject: string[];
/** Configuration for CloudDisk MCP calls. */
export interface Config {
    /** Maximum duration of one CloudDisk MCP call in milliseconds. */
    toolCallTimeoutMs: number;
}
/** Validate the tool-call timeout supplied by the Bundle patch. */
export declare const Config: s<Config>;
/** Start, stop, and restart the CloudDisk child around credential changes. */
export declare function apply(ctx: Context, config: Config): Promise<void>;
//# sourceMappingURL=mcp-host.d.ts.map