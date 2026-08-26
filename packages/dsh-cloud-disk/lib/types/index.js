/**
 * Service Definition for the CloudDisk capability seam (`ctx.cloudDisk`).
 * Providers expose normalized cloud-disk operations; consumers do not depend on
 * MCP transport, external API types, or provider-specific response blocks.
 * @module @aicloud360/dsh-cloud-disk
 */
import { Service } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import { CloudDiskError, } from "./types.js";
export * from "./types.js";
/** Provider registry and execution service for normalized CloudDisk operations. */
export class CloudDiskRuntime extends Service {
    static Config = z.object({ provider: z.string() });
    providers = new Map();
    providerId;
    constructor(ctx, config) {
        super(ctx, 'cloudDisk');
        this.providerId = config.provider;
    }
    /**
     * Register one provider and return its lifecycle disposer.
     * @param provider - normalized provider selected by this service.
     * @returns a disposer that withdraws the provider.
     */
    registerProvider(provider) {
        if (this.providers.has(provider.id)) {
            throw new CloudDiskError(`provider "${provider.id}" is already registered`, 'CLOUD_DISK_DUPLICATE_PROVIDER');
        }
        const dispose = this.ctx.effect(function* () {
            this.providers.set(provider.id, provider);
            yield () => this.providers.delete(provider.id);
        }.bind(this), 'cloudDisk.registerProvider()');
        return () => void dispose();
    }
    /**
     * Read current-user information through the selected provider.
     * @param signal - cancellation signal for the provider request.
     * @returns normalized current-user information.
     */
    async getUser(signal) {
        return await this.selectProvider().getUser(signal);
    }
    /**
     * List one normalized remote directory page.
     * @param request - directory, cursor, and optional page-limit request.
     * @param signal - cancellation signal for the provider request.
     * @returns one page of normalized remote nodes.
     */
    async list(request, signal) {
        return await this.selectProvider().list(request, signal);
    }
    /**
     * Search remote nodes using stable ids in the returned page.
     * @param request - query, cursor, and optional page-limit request.
     * @param signal - cancellation signal for the provider request.
     * @returns one page of normalized matching nodes.
     */
    async search(request, signal) {
        return await this.selectProvider().search(request, signal);
    }
    selectProvider() {
        if (this.providerId !== undefined) {
            const provider = this.providers.get(this.providerId);
            if (provider === undefined) {
                throw new CloudDiskError(`configured provider "${this.providerId}" is missing`, 'CLOUD_DISK_PROVIDER_CONFIGURED_MISSING');
            }
            if (!provider.available()) {
                throw new CloudDiskError(`configured provider "${this.providerId}" is unavailable`, 'CLOUD_DISK_PROVIDER_CONFIGURED_UNAVAILABLE');
            }
            return provider;
        }
        const available = [...this.providers.values()].filter(provider => provider.available());
        if (available.length === 0)
            throw new CloudDiskError('no usable CloudDisk provider is registered', 'CLOUD_DISK_PROVIDER_UNAVAILABLE');
        if (available.length > 1) {
            throw new CloudDiskError(`multiple usable CloudDisk providers: ${available.map(provider => provider.id).join(', ')}`, 'CLOUD_DISK_PROVIDER_AMBIGUOUS');
        }
        return available[0];
    }
}
export default CloudDiskRuntime;
//# sourceMappingURL=index.js.map