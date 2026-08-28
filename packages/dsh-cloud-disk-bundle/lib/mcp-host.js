import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import s from "@deepseek-ai/schemastery";
import { credentialRef } from "@deepseek-ai/dsh-credentials";
import { scrubbedParentEnv } from "@deepseek-ai/dsh-subprocess";
import { MAX_TIMER_DELAY_MS } from "@deepseek-ai/dsh-timeout";
import { assertSupportedJsonSchema } from "@deepseek-ai/dsh-tools";
import { z } from "zod";
//#region lib/types/mcp-host.js
/** CloudDisk-owned stdio MCP bridge with fixed tool and approval policy. */
/** Cordis plugin name used by loader diagnostics. */
const name = "cloud-disk-mcp-host";
/** The bridge registers host-global model tools. */
const inject = ["tools"];
/** Validate the tool-call timeout supplied by the Bundle patch. */
const Config = s.object({ toolCallTimeoutMs: s.number().step(1).min(1).max(MAX_TIMER_DELAY_MS).required() });
const SERVER_NAME = "cloud-disk";
const API_KEY_REF = credentialRef("CLOUD_DISK_API_KEY");
const RAW_TOOL_RESULT_SCHEMA = z.record(z.string(), z.unknown());
const TOOL_NAMES = new Set([
	"file-list",
	"file-search",
	"make-dir",
	"file-move",
	"file-rename",
	"file-save",
	"file-share",
	"file-upload-stdio",
	"get-download-url",
	"user-info"
]);
const APPROVAL_NAMES = new Set([
	"make-dir",
	"file-move",
	"file-rename",
	"file-save",
	"file-share",
	"file-upload-stdio"
]);
/** Translate a fixed CloudDisk MCP identity into its model-facing tool name. */
function publicName(rawName) {
	return `mcp__${SERVER_NAME}__${rawName}`;
}
/** Drop the MCP server's descriptive JSON Schema dialect marker before validation. */
function toolParameters(inputSchema) {
	const candidate = typeof inputSchema === "object" && inputSchema !== null && "$schema" in inputSchema ? (({ $schema: _schema, ...schema }) => schema)(inputSchema) : inputSchema;
	assertSupportedJsonSchema(candidate);
	return candidate;
}
/** Register the CloudDisk MCP tools after a credential-backed stdio connection succeeds. */
async function connect(ctx, config) {
	const credentials = ctx.get("credentials");
	if (credentials === void 0) return void 0;
	const credential = await credentials.resolve(API_KEY_REF);
	if (credential === void 0) return void 0;
	const entry = fileURLToPath(import.meta.resolve("@aicloud360/360-ai-cloud-disk-mcp/build/index.js"));
	const client = new Client({
		name: "dsh-cloud-disk-bundle",
		version: "0.1.1-rc.2"
	}, { capabilities: {} });
	const transport = new StdioClientTransport({
		command: process.execPath,
		args: [entry, "--stdio"],
		env: {
			...scrubbedParentEnv(),
			API_KEY: credential.value,
			ECS_ENV: "prod",
			SUB_CHANNEL: "open"
		}
	});
	const disposers = [];
	try {
		await client.connect(transport);
		const listed = await client.listTools();
		for (const tool of listed.tools) {
			if (!TOOL_NAMES.has(tool.name)) continue;
			const definition = {
				name: publicName(tool.name),
				description: tool.description ?? "",
				parameters: toolParameters(tool.inputSchema),
				output: {
					schema: { type: "object" },
					render: (_args, value) => [{
						type: "text",
						text: JSON.stringify(value)
					}]
				},
				async execute(args, exec) {
					return await client.request({
						method: "tools/call",
						params: {
							name: tool.name,
							arguments: args
						}
					}, RAW_TOOL_RESULT_SCHEMA, {
						signal: exec.signal,
						timeout: config.toolCallTimeoutMs
					});
				}
			};
			disposers.push(ctx.tools.register(definition));
		}
	} catch (error) {
		for (const dispose of disposers) dispose();
		await client.close().catch(() => {});
		throw error;
	}
	return async () => {
		for (const dispose of disposers) dispose();
		await client.close().catch(() => {});
	};
}
/** Start, stop, and restart the CloudDisk child around credential changes. */
async function apply(ctx, config) {
	let stop;
	let disposed = false;
	let updates = Promise.resolve();
	const refresh = () => {
		updates = updates.then(async () => {
			await stop?.();
			stop = void 0;
			if (!disposed) stop = await connect(ctx, config);
		}).catch((error) => ctx.logger.error(`cloud-disk-mcp-host: ${String(error)}`));
		return updates;
	};
	await refresh();
	ctx.on("credentials/reference-updated", (ref) => {
		if (ref === API_KEY_REF) refresh();
	}, { global: true });
	ctx.on("internal/service", (service, value) => {
		if (service === "credentials" && value !== void 0) refresh();
	}, { global: true });
	ctx.on("tools/pre-execute", (exec, next) => {
		if (APPROVAL_NAMES.has(exec.name.slice(`mcp__${SERVER_NAME}__`.length))) return Promise.resolve({
			kind: "ask",
			reason: `Approve ${exec.name}`
		});
		return next();
	});
	ctx.effect(() => () => {
		disposed = true;
		return updates.then(async () => {
			await stop?.();
		});
	}, "cloud-disk-mcp-host.connection");
}
//#endregion
export { Config, apply, inject, name };
