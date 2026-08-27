/** CloudDisk's stable private RPC client over the generic Connection channel. */
const CHANNEL = '/cloud-disk';
const API_KEY_REF = 'CLOUD_DISK_API_KEY';
function response(result) {
    return { rpcId: 'cloud-disk', result: result };
}
function badCredentialResponse(message) {
    return {
        rpcId: 'cloud-disk',
        result: { ok: false, error: { code: 'bad-request', message, details: { issues: [] } } },
    };
}
/**
 * Create the CloudDisk browser API from the plugin-private generic RPC channel.
 * The returned credentials methods accept only the CloudDisk API-key reference;
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
                if (payload.refs.some(ref => ref !== API_KEY_REF)) {
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
                            value.apiKey,
                        ])),
                    },
                });
            },
            async set(payload, signal) {
                if (payload.ref !== API_KEY_REF)
                    return badCredentialResponse('unknown cloud disk credential');
                return response(await connection.rpc.call(CHANNEL, 'credentials/set', { value: payload.value }, signal));
            },
            async unset(payload, signal) {
                if (payload.ref !== API_KEY_REF)
                    return badCredentialResponse('unknown cloud disk credential');
                return response(await connection.rpc.call(CHANNEL, 'credentials/unset', {}, signal));
            },
        },
    };
}
//# sourceMappingURL=cloud-disk-api.js.map