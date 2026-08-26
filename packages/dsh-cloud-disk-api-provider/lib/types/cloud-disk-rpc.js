/** Private Connection RPC for the CloudDisk browser workspace. */
import { credentialRef } from '@deepseek-ai/dsh-credentials';
import { CloudDiskError } from '@aicloud360/dsh-cloud-disk';
import z from '@deepseek-ai/schemastery';
const CHANNEL = '/cloud-disk';
const API_KEY_REF = credentialRef('CLOUD_DISK_API_KEY');
const SIGNING_SECRET_REF = credentialRef('CLOUD_DISK_SIGNING_SECRET');
const credentialKindSchema = z.union([z.const('apiKey'), z.const('signingSecret')]);
const listSchema = z.object({
    parentId: z.string(),
    cursor: z.string(),
    limit: z.number().step(1).min(1),
});
const searchSchema = z.object({
    query: z.string().required(),
    cursor: z.string(),
    limit: z.number().step(1).min(1),
});
const credentialSetSchema = z.object({ kind: credentialKindSchema.required(), value: z.string().min(1).required() });
const credentialUnsetSchema = z.object({ kind: credentialKindSchema.required() });
const CLOUD_DISK_FAILURE_CODES = new Set([
    'CLOUD_DISK_PROVIDER_CONFIGURED_MISSING',
    'CLOUD_DISK_PROVIDER_CONFIGURED_UNAVAILABLE',
    'CLOUD_DISK_PROVIDER_UNAVAILABLE',
    'CLOUD_DISK_PROVIDER_AMBIGUOUS',
    'CLOUD_DISK_CREDENTIAL_MISSING',
    'CLOUD_DISK_SIGNING_SECRET_MISSING',
    'CLOUD_DISK_AUTHENTICATION_FAILED',
    'CLOUD_DISK_NETWORK_FAILED',
    'CLOUD_DISK_INVALID_REQUEST',
    'CLOUD_DISK_PROVIDER_FAILED',
]);
function credentialFor(kind) {
    return kind === 'apiKey' ? API_KEY_REF : SIGNING_SECRET_REF;
}
function parse(schema, payload) {
    try {
        return schema(payload);
    }
    catch {
        return undefined;
    }
}
function badRequest(message) {
    return { ok: false, error: { code: 'bad-request', message, details: { issues: [] } } };
}
function internalFailure(message) {
    return { ok: false, error: { code: 'internal', message, details: {} } };
}
function cancelled() {
    return { ok: false, error: { code: 'cancelled', message: 'cloud disk request was aborted', details: {} } };
}
function failureCode(error) {
    if (!(error instanceof CloudDiskError) || !CLOUD_DISK_FAILURE_CODES.has(error.code))
        return undefined;
    return error.code;
}
function pageView(page) {
    return {
        nodes: page.nodes.map(node => ({
            id: node.id,
            kind: node.kind,
            name: node.name,
            ...node.parentId === undefined ? {} : { parentId: node.parentId },
            ...node.size === undefined ? {} : { size: node.size },
            ...node.updatedAt === undefined ? {} : { updatedAt: node.updatedAt },
        })),
        ...page.nextCursor === undefined ? {} : { nextCursor: page.nextCursor },
    };
}
/**
 * Register the CloudDisk browser RPC channel. Credential endpoints only address
 * the two CloudDisk references, so this plugin cannot become a general
 * credential-inspection surface.
 * @param ctx - Host context with the selected CloudDisk provider and credentials.
 */
export function installCloudDiskRpc(ctx) {
    ctx.connection.rpc.handle(CHANNEL, async (endpoint, payload, signal) => {
        if (signal.aborted)
            return cancelled();
        switch (endpoint) {
            case 'status': {
                if (parse(z.object({}), payload) === undefined)
                    return badRequest('invalid cloud disk status request');
                try {
                    const user = await ctx.cloudDisk.getUser(signal);
                    return { ok: true, value: { available: true, user } };
                }
                catch (error) {
                    const errorCode = failureCode(error);
                    return { ok: true, value: { available: false, ...errorCode === undefined ? {} : { errorCode } } };
                }
            }
            case 'credentials/describe': {
                if (parse(z.object({}), payload) === undefined)
                    return badRequest('invalid cloud disk credential request');
                const [apiKey, signingSecret] = await Promise.all([
                    ctx.credentials.describe(API_KEY_REF),
                    ctx.credentials.describe(SIGNING_SECRET_REF),
                ]);
                return { ok: true, value: { apiKey, signingSecret } };
            }
            case 'credentials/set': {
                const parsed = parse(credentialSetSchema, payload);
                if (parsed === undefined)
                    return badRequest('invalid cloud disk credential request');
                try {
                    await ctx.credentials.set(credentialFor(parsed.kind), parsed.value);
                    return { ok: true, value: {} };
                }
                catch {
                    return internalFailure('cloud disk credential could not be saved');
                }
            }
            case 'credentials/unset': {
                const parsed = parse(credentialUnsetSchema, payload);
                if (parsed === undefined)
                    return badRequest('invalid cloud disk credential request');
                try {
                    await ctx.credentials.unset(credentialFor(parsed.kind));
                    return { ok: true, value: {} };
                }
                catch {
                    return internalFailure('cloud disk credential could not be removed');
                }
            }
            case 'browse/list': {
                const parsed = parse(listSchema, payload);
                if (parsed === undefined)
                    return badRequest('invalid cloud disk list request');
                try {
                    const page = await ctx.cloudDisk.list({
                        ...parsed.parentId === undefined ? {} : { parentId: parsed.parentId },
                        ...parsed.cursor === undefined ? {} : { cursor: parsed.cursor },
                        ...parsed.limit === undefined ? {} : { limit: parsed.limit },
                    }, signal);
                    if (signal.aborted)
                        return cancelled();
                    return { ok: true, value: pageView(page) };
                }
                catch (error) {
                    return signal.aborted ? cancelled() : internalFailure(error instanceof CloudDiskError ? error.message : 'cloud disk listing failed');
                }
            }
            case 'browse/search': {
                const parsed = parse(searchSchema, payload);
                if (parsed === undefined || parsed.query.trim() === '')
                    return badRequest('invalid cloud disk search request');
                try {
                    const page = await ctx.cloudDisk.search({
                        query: parsed.query.trim(),
                        ...parsed.cursor === undefined ? {} : { cursor: parsed.cursor },
                        ...parsed.limit === undefined ? {} : { limit: parsed.limit },
                    }, signal);
                    if (signal.aborted)
                        return cancelled();
                    return { ok: true, value: pageView(page) };
                }
                catch {
                    return signal.aborted ? cancelled() : internalFailure('cloud disk search failed');
                }
            }
            default:
                return badRequest('unknown cloud disk endpoint');
        }
    }, { authority: 'loopback' });
}
//# sourceMappingURL=cloud-disk-rpc.js.map