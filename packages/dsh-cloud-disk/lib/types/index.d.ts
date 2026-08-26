/**
 * Service Definition for the CloudDisk capability seam (`ctx.cloudDisk`).
 * Providers expose normalized cloud-disk operations; consumers do not depend on
 * MCP transport, external API types, or provider-specific response blocks.
 * @module @aicloud360/dsh-cloud-disk
 */
import { Context, Service } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import { type CloudDiskListRequest, type CloudDiskPage, type CloudDiskProvider, type CloudDiskSearchRequest, type CloudDiskUser } from './types.ts';
export * from './types.ts';
/** Runtime configuration for provider selection. */
export interface CloudDiskConfig {
    /** Explicit provider id. Omitted only when exactly one usable provider exists. */
    readonly provider?: string;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        cloudDisk: CloudDiskRuntime;
    }
}
/** Provider registry and execution service for normalized CloudDisk operations. */
export declare class CloudDiskRuntime extends Service {
    static Config: z<CloudDiskConfig>;
    private readonly providers;
    private readonly providerId;
    constructor(ctx: Context, config: CloudDiskConfig);
    /**
     * Register one provider and return its lifecycle disposer.
     * @param provider - normalized provider selected by this service.
     * @returns a disposer that withdraws the provider.
     */
    registerProvider(provider: CloudDiskProvider): () => void;
    /**
     * Read current-user information through the selected provider.
     * @param signal - cancellation signal for the provider request.
     * @returns normalized current-user information.
     */
    getUser(signal?: AbortSignal): Promise<CloudDiskUser>;
    /**
     * List one normalized remote directory page.
     * @param request - directory, cursor, and optional page-limit request.
     * @param signal - cancellation signal for the provider request.
     * @returns one page of normalized remote nodes.
     */
    list(request: CloudDiskListRequest, signal?: AbortSignal): Promise<CloudDiskPage>;
    /**
     * Search remote nodes using stable ids in the returned page.
     * @param request - query, cursor, and optional page-limit request.
     * @param signal - cancellation signal for the provider request.
     * @returns one page of normalized matching nodes.
     */
    search(request: CloudDiskSearchRequest, signal?: AbortSignal): Promise<CloudDiskPage>;
    private selectProvider;
}
export default CloudDiskRuntime;
//# sourceMappingURL=index.d.ts.map