/** CloudDisk's stable private RPC client over the generic Connection channel. */
const CHANNEL = '/cloud-disk';
const API_KEY_REF = 'CLOUD_DISK_API_KEY';
const SIGNING_SECRET_REF = 'CLOUD_DISK_SIGNING_SECRET';
function response(result) {
    return { rpcId: 'cloud-disk', result: result };
}
function credentialKind(ref) {
    if (ref === API_KEY_REF)
        return 'apiKey';
    if (ref === SIGNING_SECRET_REF)
        return 'signingSecret';
    return undefined;
}
function badCredentialResponse(message) {
    return {
        rpcId: 'cloud-disk',
        result: { ok: false, error: { code: 'bad-request', message, details: { issues: [] } } },
    };
}
/**
 * Create the CloudDisk browser API from the plugin-private generic RPC channel.
 * The returned credentials methods accept only the two CloudDisk references;
 * they cannot be used to inspect or modify unrelated Host credentials.
 * @param connection - active browser-to-Host connection.
 * @returns The API subset consumed by the CloudDisk workspace.
 */
export function createCloudDiskApi(connection) {
    return {
        cloudDisk: {
            async describe(_payload, signal) {
                return response(await connection.rpc.call(CHANNEL, 'status', {}, signal));
            },
            async list(payload, signal) {
                return response(await connection.rpc.call(CHANNEL, 'browse/list', payload, signal));
            },
            async search(payload, signal) {
                return response(await connection.rpc.call(CHANNEL, 'browse/search', payload, signal));
            },
        },
        credentials: {
            async describe(payload, signal) {
                if (payload.refs.some(ref => credentialKind(ref) === undefined)) {
                    return badCredentialResponse('unknown cloud disk credential');
                }
                const rpc = await connection.rpc.call(CHANNEL, 'credentials/describe', {}, signal);
                if (!rpc.ok)
                    return response(rpc);
                const value = rpc.value;
                return response({
                    ok: true,
                    value: {
                        credentials: Object.fromEntries(payload.refs.map(ref => [
                            ref,
                            ref === API_KEY_REF ? value.apiKey : value.signingSecret,
                        ])),
                    },
                });
            },
            async set(payload, signal) {
                const kind = credentialKind(payload.ref);
                if (kind === undefined)
                    return badCredentialResponse('unknown cloud disk credential');
                return response(await connection.rpc.call(CHANNEL, 'credentials/set', { kind, value: payload.value }, signal));
            },
            async unset(payload, signal) {
                const kind = credentialKind(payload.ref);
                if (kind === undefined)
                    return badCredentialResponse('unknown cloud disk credential');
                return response(await connection.rpc.call(CHANNEL, 'credentials/unset', { kind }, signal));
            },
        },
    };
}
//# sourceMappingURL=cloud-disk-api.js.map