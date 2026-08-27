/** Direct Host-side adapter for the audited 360 CloudDisk OpenAPI. */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import { type CredentialProvider } from '@deepseek-ai/dsh-credentials';
import CloudDiskRuntime, { type CloudDiskListRequest, type CloudDiskPage, type CloudDiskProvider, type CloudDiskProviderConfig, type CloudDiskSearchRequest, type CloudDiskUser } from '@aicloud360/dsh-cloud-disk';
/** Cordis loader name for the direct CloudDisk Provider plugin. */
export declare const name = "cloud-disk-api-provider";
/** Host services required to register and operate the direct Provider. */
export declare const inject: string[];
/** Loader configuration for the direct CloudDisk Provider. */
export interface Config {
    /** OpenAPI endpoint URL. */
    endpoint: string;
    /** Credential reference containing the user API key. */
    apiKeyRef: string;
    /** Host-only application secret used to sign directory and search requests. */
    signingSecret: string;
    /** 360 client environment identifier. */
    clientEnv: string;
    /** 360 client source identifier. */
    clientSource: string;
    /** 360 sub-channel identifier. */
    subChannel: string;
    /** Maximum duration of one HTTP attempt in milliseconds. */
    timeoutMs: number;
    /** Number of retry attempts after the initial HTTP attempt. */
    maxRetries: number;
}
/** Runtime schema for the complete, explicit Provider configuration. */
export declare const Config: z<Config>;
/** Response returned by the Provider's injectable Host HTTP transport. */
export interface CloudDiskHttpResponse {
    readonly status: number;
    readonly json: unknown;
}
/** Host HTTP transport. It must not log request headers or response bodies. */
export interface CloudDiskHttpClient {
    request(input: {
        readonly method: 'GET' | 'POST';
        readonly url: string;
        readonly headers: Readonly<Record<string, string>>;
        readonly body?: string;
        readonly signal?: AbortSignal;
    }): Promise<CloudDiskHttpResponse>;
}
/**
 * Create the production fetch transport used by the Host-side Provider.
 * @param fetchImpl - Host fetch implementation; injectable only for tests.
 * @returns A transport that parses JSON without logging sensitive request data.
 */
export declare function createFetchCloudDiskHttpClient(fetchImpl?: typeof fetch): CloudDiskHttpClient;
/** Host-only configuration for the audited direct 360 OpenAPI Provider. */
export interface DirectCloudDiskProviderOptions extends CloudDiskProviderConfig {
    readonly signingSecret: string;
    readonly clientEnv: string;
    readonly clientSource: string;
    readonly subChannel: string;
    readonly credentials: CredentialProvider;
    readonly http: CloudDiskHttpClient;
    readonly timeoutMs: number;
    readonly maxRetries: number;
}
/** Provider that keeps API key, token, and signing material on the Host. */
export declare class DirectCloudDiskProvider implements CloudDiskProvider {
    private readonly options;
    readonly id = "360-http";
    private readonly parentPaths;
    private credentialFingerprint;
    constructor(options: DirectCloudDiskProviderOptions);
    /** Report that the Provider is configured; each operation verifies its credentials. */
    available(): boolean;
    /**
     * Read the authenticated user without exposing credential or token fields.
     * @param signal - Cancels the request.
     * @returns Normalized user information.
     */
    getUser(signal?: AbortSignal): Promise<CloudDiskUser>;
    /**
     * List one directory page.
     * @param request - Stable parent id and opaque cursor.
     * @param signal - Cancels the request.
     * @returns Normalized remote nodes.
     */
    list(request: CloudDiskListRequest, signal?: AbortSignal): Promise<CloudDiskPage>;
    /** Search remote nodes. @param request - Query and opaque cursor. @param signal - Cancels the request. @returns Normalized matches. */
    search(request: CloudDiskSearchRequest, signal?: AbortSignal): Promise<CloudDiskPage>;
    private authenticate;
    private signed;
    private signingSecret;
    private getInput;
    private postInput;
    private call;
    private data;
    private page;
    private node;
}
/**
 * Register a direct Provider and return its disposer.
 * @param ctx - CloudDisk service owner.
 * @param options - Host-only Provider configuration.
 * @returns Registration disposer.
 */
export declare function applyDirectCloudDiskProvider(ctx: Context, options: DirectCloudDiskProviderOptions): () => void;
/**
 * Register the production fetch Provider from a profile's API-key reference and signing material.
 * @param ctx - Host context that owns the CloudDisk and credential services.
 * @param config - Complete direct-Provider configuration from the profile Bundle.
 */
export declare function apply(ctx: Context, config: Config): void;
export { CloudDiskRuntime };
//# sourceMappingURL=index.d.ts.map