import { createHash } from "node:crypto";
import z from "@deepseek-ai/schemastery";
import { credentialRef } from "@deepseek-ai/dsh-credentials";
import CloudDiskRuntime, { CloudDiskError } from "@aicloud360/dsh-cloud-disk";
//#region lib/types/cloud-disk-rpc.js
/** Private Connection RPC for the CloudDisk browser workspace. */
const CHANNEL = "/cloud-disk";
const API_KEY_REF = credentialRef("CLOUD_DISK_API_KEY");
const listSchema = z.object({
	parentId: z.string(),
	cursor: z.string(),
	limit: z.number().step(1).min(1)
});
const searchSchema = z.object({
	query: z.string().required(),
	cursor: z.string(),
	limit: z.number().step(1).min(1)
});
const credentialSetSchema = z.object({ value: z.string().min(1).required() });
const credentialUnsetSchema = z.object({});
const CLOUD_DISK_FAILURE_CODES = new Set([
	"CLOUD_DISK_PROVIDER_CONFIGURED_MISSING",
	"CLOUD_DISK_PROVIDER_CONFIGURED_UNAVAILABLE",
	"CLOUD_DISK_PROVIDER_UNAVAILABLE",
	"CLOUD_DISK_PROVIDER_AMBIGUOUS",
	"CLOUD_DISK_CREDENTIAL_MISSING",
	"CLOUD_DISK_AUTHENTICATION_FAILED",
	"CLOUD_DISK_NETWORK_FAILED",
	"CLOUD_DISK_INVALID_REQUEST",
	"CLOUD_DISK_PROVIDER_FAILED"
]);
function parse(schema, payload) {
	try {
		return schema(payload);
	} catch {
		return;
	}
}
function badRequest(message) {
	return {
		ok: false,
		error: {
			code: "bad-request",
			message,
			details: { issues: [] }
		}
	};
}
function internalFailure(message) {
	return {
		ok: false,
		error: {
			code: "internal",
			message,
			details: {}
		}
	};
}
function cancelled() {
	return {
		ok: false,
		error: {
			code: "cancelled",
			message: "cloud disk request was aborted",
			details: {}
		}
	};
}
function failureCode(error) {
	if (!(error instanceof CloudDiskError) || !CLOUD_DISK_FAILURE_CODES.has(error.code)) return void 0;
	return error.code;
}
function pageView(page) {
	return {
		nodes: page.nodes.map((node) => ({
			id: node.id,
			kind: node.kind,
			name: node.name,
			...node.parentId === void 0 ? {} : { parentId: node.parentId },
			...node.size === void 0 ? {} : { size: node.size },
			...node.updatedAt === void 0 ? {} : { updatedAt: node.updatedAt }
		})),
		...page.nextCursor === void 0 ? {} : { nextCursor: page.nextCursor }
	};
}
/**
* Register the CloudDisk browser RPC channel. Credential endpoints only address
* the CloudDisk API-key reference, so this plugin cannot become a general
* credential-inspection surface.
* @param ctx - Host context with the selected CloudDisk provider and credentials.
*/
function installCloudDiskRpc(ctx) {
	ctx.connection.rpc.handle(CHANNEL, async (endpoint, payload, signal) => {
		if (signal.aborted) return cancelled();
		switch (endpoint) {
			case "status":
				if (parse(z.object({}), payload) === void 0) return badRequest("invalid cloud disk status request");
				try {
					return {
						ok: true,
						value: {
							available: true,
							user: await ctx.cloudDisk.getUser(signal)
						}
					};
				} catch (error) {
					const errorCode = failureCode(error);
					return {
						ok: true,
						value: {
							available: false,
							...errorCode === void 0 ? {} : { errorCode }
						}
					};
				}
			case "credentials/describe":
				if (parse(z.object({}), payload) === void 0) return badRequest("invalid cloud disk credential request");
				return {
					ok: true,
					value: { apiKey: await ctx.credentials.describe(API_KEY_REF) }
				};
			case "credentials/set": {
				const parsed = parse(credentialSetSchema, payload);
				if (parsed === void 0) return badRequest("invalid cloud disk credential request");
				try {
					await ctx.credentials.set(API_KEY_REF, parsed.value);
					return {
						ok: true,
						value: {}
					};
				} catch {
					return internalFailure("cloud disk credential could not be saved");
				}
			}
			case "credentials/unset":
				if (parse(credentialUnsetSchema, payload) === void 0) return badRequest("invalid cloud disk credential request");
				try {
					await ctx.credentials.unset(API_KEY_REF);
					return {
						ok: true,
						value: {}
					};
				} catch {
					return internalFailure("cloud disk credential could not be removed");
				}
			case "browse/list": {
				const parsed = parse(listSchema, payload);
				if (parsed === void 0) return badRequest("invalid cloud disk list request");
				try {
					const page = await ctx.cloudDisk.list({
						...parsed.parentId === void 0 ? {} : { parentId: parsed.parentId },
						...parsed.cursor === void 0 ? {} : { cursor: parsed.cursor },
						...parsed.limit === void 0 ? {} : { limit: parsed.limit }
					}, signal);
					if (signal.aborted) return cancelled();
					return {
						ok: true,
						value: pageView(page)
					};
				} catch (error) {
					return signal.aborted ? cancelled() : internalFailure(error instanceof CloudDiskError ? error.message : "cloud disk listing failed");
				}
			}
			case "browse/search": {
				const parsed = parse(searchSchema, payload);
				if (parsed === void 0 || parsed.query.trim() === "") return badRequest("invalid cloud disk search request");
				try {
					const page = await ctx.cloudDisk.search({
						query: parsed.query.trim(),
						...parsed.cursor === void 0 ? {} : { cursor: parsed.cursor },
						...parsed.limit === void 0 ? {} : { limit: parsed.limit }
					}, signal);
					if (signal.aborted) return cancelled();
					return {
						ok: true,
						value: pageView(page)
					};
				} catch {
					return signal.aborted ? cancelled() : internalFailure("cloud disk search failed");
				}
			}
			default: return badRequest("unknown cloud disk endpoint");
		}
	}, { authority: "loopback" });
}
//#endregion
//#region lib/types/index.js
/** Direct Host-side adapter for the audited 360 CloudDisk OpenAPI. */
/** Cordis loader name for the direct CloudDisk Provider plugin. */
const name = "cloud-disk-api-provider";
/** Host services required to register and operate the direct Provider. */
const inject = [
	"cloudDisk",
	"credentials",
	"connection"
];
/** Runtime schema for the complete, explicit Provider configuration. */
const Config = z.object({
	endpoint: z.string().required(),
	apiKeyRef: z.string().required(),
	signingSecret: z.string().min(1).required(),
	clientEnv: z.string().required(),
	clientSource: z.string().required(),
	subChannel: z.string().required(),
	timeoutMs: z.number().required(),
	maxRetries: z.number().required()
});
/**
* Create the production fetch transport used by the Host-side Provider.
* @param fetchImpl - Host fetch implementation; injectable only for tests.
* @returns A transport that parses JSON without logging sensitive request data.
*/
function createFetchCloudDiskHttpClient(fetchImpl = fetch) {
	return { async request(input) {
		const response = await fetchImpl(input.url, {
			method: input.method,
			headers: input.headers,
			...input.body === void 0 ? {} : { body: input.body },
			...input.signal === void 0 ? {} : { signal: input.signal }
		});
		let json;
		try {
			json = await response.json();
		} catch {
			json = void 0;
		}
		return {
			status: response.status,
			json
		};
	} };
}
/** Provider that keeps API key, token, and signing material on the Host. */
var DirectCloudDiskProvider = class {
	options;
	id = "360-http";
	parentPaths = /* @__PURE__ */ new Map();
	credentialFingerprint;
	constructor(options) {
		this.options = options;
		if (!Number.isInteger(options.timeoutMs) || options.timeoutMs <= 0) throw new TypeError("timeoutMs must be a positive integer");
		if (!Number.isInteger(options.maxRetries) || options.maxRetries < 0) throw new TypeError("maxRetries must be a non-negative integer");
	}
	/** Report that the Provider is configured; each operation verifies its credentials. */
	available() {
		return true;
	}
	/**
	* Read the authenticated user without exposing credential or token fields.
	* @param signal - Cancels the request.
	* @returns Normalized user information.
	*/
	async getUser(signal) {
		const auth = await this.authenticate(signal);
		await this.signingSecret();
		const result = await this.call(this.getInput({
			method: "User.getUserDetail",
			access_token: auth.accessToken,
			qid: auth.qid,
			sign: "",
			sub_channel: this.options.subChannel
		}, auth.accessToken), signal);
		const data = this.data(result, "user");
		if (!isRecord(data) || typeof data.qid !== "string") throw invalidResponse("user");
		const displayName = [
			data.nickname,
			data.nickName,
			data.nick,
			data.userName,
			data.name
		].find((value) => typeof value === "string" && value.trim().length > 0);
		return {
			id: data.qid,
			...displayName === void 0 ? {} : { displayName: displayName.trim() }
		};
	}
	/**
	* List one directory page.
	* @param request - Stable parent id and opaque cursor.
	* @param signal - Cancels the request.
	* @returns Normalized remote nodes.
	*/
	async list(request, signal) {
		const path = request.parentId === void 0 ? "/" : this.parentPaths.get(request.parentId);
		if (path === void 0) throw new CloudDiskError("CloudDisk directory is no longer available in this Provider generation", "CLOUD_DISK_INVALID_REQUEST");
		const page = pageNumber(request.cursor, 0);
		const limit = request.limit ?? 50;
		const auth = await this.authenticate(signal);
		const params = await this.signed(auth, "File.getList", {
			path,
			page: String(page),
			page_size: String(limit)
		});
		const result = await this.call(this.getInput(params, auth.accessToken), signal);
		return this.page(this.data(result, "directory page"), path, request.parentId, page);
	}
	/** Search remote nodes. @param request - Query and opaque cursor. @param signal - Cancels the request. @returns Normalized matches. */
	async search(request, signal) {
		const page = pageNumber(request.cursor, 1);
		const limit = request.limit ?? 20;
		const auth = await this.authenticate(signal);
		const params = await this.signed(auth, "File.searchList", {
			file_category: "-1",
			key: request.query,
			page: String(page),
			page_size: String(limit)
		});
		const result = await this.call(this.postInput(params, auth.accessToken), signal);
		return this.page(this.data(result, "search page"), void 0, void 0, page);
	}
	async authenticate(signal) {
		const credential = await this.options.credentials.resolve(this.options.credentialRef);
		if (credential === void 0) throw credentialMissing();
		const fingerprint = createHash("sha256").update(credential.value, "utf8").digest("hex");
		if (this.credentialFingerprint !== fingerprint) {
			this.parentPaths.clear();
			this.credentialFingerprint = fingerprint;
		}
		const params = {
			method: "Oauth.getAccessTokenByApiKeyOrQT",
			client_env: this.options.clientEnv,
			client_src: this.options.clientSource,
			grant_type: "authorization_code",
			sub_channel: this.options.subChannel,
			api_key: credential.value
		};
		const result = await this.call({
			method: "GET",
			url: queryUrl(this.options.endpoint, params),
			headers: {
				accept: "application/json",
				api_key: credential.value
			}
		}, signal);
		const data = this.data(result, "authentication");
		if (!isRecord(data) || typeof data.access_token !== "string" || typeof data.qid !== "string") throw invalidResponse("authentication");
		return {
			accessToken: data.access_token,
			qid: data.qid
		};
	}
	async signed(auth, method, extra) {
		const secret = await this.signingSecret();
		const input = {
			access_token: auth.accessToken,
			method,
			qid: auth.qid,
			...extra
		};
		return {
			...input,
			sign: sign(input, secret),
			sub_channel: this.options.subChannel
		};
	}
	signingSecret() {
		return this.options.signingSecret;
	}
	getInput(params, accessToken) {
		return {
			method: "GET",
			url: queryUrl(this.options.endpoint, params),
			headers: { "access-token": accessToken }
		};
	}
	postInput(params, accessToken) {
		return {
			method: "POST",
			url: this.options.endpoint,
			headers: {
				"access-token": accessToken,
				"content-type": "application/x-www-form-urlencoded"
			},
			body: new URLSearchParams(params).toString()
		};
	}
	async call(input, parent) {
		for (let attempt = 0;; attempt += 1) {
			const deadline = deadlineSignal(parent, this.options.timeoutMs);
			try {
				const response = await this.options.http.request({
					...input,
					signal: deadline.signal
				});
				if (response.status < 200 || response.status >= 300) {
					if (retryableStatus(response.status) && attempt < this.options.maxRetries) continue;
					throw response.status === 401 || response.status === 403 ? authenticationFailed() : failed(`CloudDisk API request failed with HTTP ${String(response.status)}`);
				}
				if (!isRecord(response.json)) throw invalidResponse("API envelope");
				return response.json;
			} catch (error) {
				if (parent?.aborted) throw parent.reason;
				if (error instanceof CloudDiskError) throw error;
				if (attempt >= this.options.maxRetries) throw networkFailed();
			} finally {
				deadline.dispose();
			}
		}
	}
	data(result, subject) {
		if (result.errno !== 0) throw apiFailure(subject, result.errno);
		return result.data;
	}
	page(value, path, parentId, page) {
		if (!isRecord(value) || !Array.isArray(value.node_list) || typeof value.has_next_page !== "boolean") throw invalidResponse("page");
		return {
			nodes: value.node_list.map((node, index) => this.node(node, path, parentId, index)),
			...value.has_next_page ? { nextCursor: String(page + 1) } : {}
		};
	}
	node(value, parentPath, parentId, index) {
		if (!isRecord(value) || typeof value.nid !== "string" || typeof value.name !== "string") throw invalidResponse(`page.node_list[${String(index)}]`);
		const directory = value.type === 1 || value.type === "1" || value.type === "dir" || value.is_dir === 1 || value.is_dir === "1";
		const id = value.nid;
		if (directory && parentPath !== void 0) this.parentPaths.set(id, childPath(parentPath, value.name));
		const parent = parentId === void 0 ? {} : { parentId };
		const size = typeof value.count_size === "string" && /^\d+$/.test(value.count_size) ? { size: Number(value.count_size) } : {};
		const updatedAt = typeof value.modify_time === "string" ? { updatedAt: value.modify_time } : {};
		return {
			id,
			kind: directory ? "directory" : "file",
			name: value.name,
			...parent,
			...size,
			...updatedAt
		};
	}
};
/**
* Register a direct Provider and return its disposer.
* @param ctx - CloudDisk service owner.
* @param options - Host-only Provider configuration.
* @returns Registration disposer.
*/
function applyDirectCloudDiskProvider(ctx, options) {
	return ctx.cloudDisk.registerProvider(new DirectCloudDiskProvider(options));
}
/**
* Register the production fetch Provider from a profile's API-key reference and signing material.
* @param ctx - Host context that owns the CloudDisk and credential services.
* @param config - Complete direct-Provider configuration from the profile Bundle.
*/
function apply(ctx, config) {
	applyDirectCloudDiskProvider(ctx, {
		endpoint: config.endpoint,
		credentialRef: credentialRef(config.apiKeyRef),
		signingSecret: config.signingSecret,
		clientEnv: config.clientEnv,
		clientSource: config.clientSource,
		subChannel: config.subChannel,
		credentials: ctx.credentials,
		http: createFetchCloudDiskHttpClient(),
		timeoutMs: config.timeoutMs,
		maxRetries: config.maxRetries
	});
	installCloudDiskRpc(ctx);
}
function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
function credentialMissing() {
	return new CloudDiskError("CloudDisk credential is not configured", "CLOUD_DISK_CREDENTIAL_MISSING");
}
function authenticationFailed() {
	return new CloudDiskError("CloudDisk authentication failed", "CLOUD_DISK_AUTHENTICATION_FAILED");
}
function networkFailed() {
	return new CloudDiskError("CloudDisk network request failed", "CLOUD_DISK_NETWORK_FAILED");
}
function failed(message) {
	return new CloudDiskError(message, "CLOUD_DISK_PROVIDER_FAILED");
}
function apiFailure(subject, errno) {
	return failed(`CloudDisk ${subject} failed with API errno ${typeof errno === "number" && Number.isSafeInteger(errno) ? String(errno) : typeof errno === "string" && /^-?\d{1,10}$/u.test(errno) ? errno : "unknown"}`);
}
function invalidResponse(subject) {
	return failed(`CloudDisk ${subject} response is invalid`);
}
function retryableStatus(status) {
	return status === 408 || status === 425 || status === 429 || status >= 500;
}
function queryUrl(endpoint, params) {
	const url = new URL(endpoint);
	for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
	return url.toString();
}
function pageNumber(cursor, initial) {
	if (cursor === void 0) return initial;
	if (!/^\d+$/.test(cursor)) throw new CloudDiskError("CloudDisk cursor is invalid", "CLOUD_DISK_INVALID_REQUEST");
	return Number(cursor);
}
function childPath(parent, name) {
	const path = name.startsWith("/") ? name : `${parent}${name}`;
	return path.endsWith("/") ? path : `${path}/`;
}
function phpEncode(value) {
	return encodeURIComponent(value).replace(/%20/g, "+").replace(/[!'()*~]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}
function sign(params, secret) {
	return createHash("md5").update(`${Object.keys(params).sort().map((key) => `${key}=${phpEncode(params[key])}`).join("&")}${secret}`, "utf8").digest("hex");
}
function deadlineSignal(parent, timeoutMs) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	const abort = () => controller.abort(parent?.reason);
	parent?.addEventListener("abort", abort, { once: true });
	return {
		signal: controller.signal,
		dispose: () => {
			clearTimeout(timer);
			parent?.removeEventListener("abort", abort);
		}
	};
}
//#endregion
export { CloudDiskRuntime, Config, DirectCloudDiskProvider, apply, applyDirectCloudDiskProvider, createFetchCloudDiskHttpClient, inject, name };
