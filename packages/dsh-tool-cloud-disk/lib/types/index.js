/**
 * Model-facing `cloud_disk_list` and `cloud_disk_search` tools over `ctx.cloudDisk`.
 * This package owns schemas, validation, model guidance, and presentation; it never
 * owns credential resolution, HTTP, provider selection, or pagination — those belong
 * to the seam and the Host-side provider. Stable node ids flow back to the model so
 * a later action can target the same remote object.
 * @module @aicloud360/dsh-tool-cloud-disk
 */
import z from '@deepseek-ai/schemastery';
import { defineTool } from '@deepseek-ai/dsh-tools';
/** Cordis plugin name used by loader diagnostics. */
export const name = 'tool-cloud-disk';
/** Services required by the CloudDisk tool suite. */
export const inject = ['tools', 'cloudDisk', 'systemPrompt'];
/** Default cooperative tool-call timeout budget (ms) for the CloudDisk tools. */
export const DEFAULT_CLOUD_DISK_TOOL_TIMEOUT_MS = 30_000;
/** Default upper bound on nodes returned by one CloudDisk page. */
export const DEFAULT_PAGE_LIMIT = 50;
export const Config = z.object({
    list: z.boolean().default(true),
    search: z.boolean().default(true),
    timeoutMs: z.number().default(DEFAULT_CLOUD_DISK_TOOL_TIMEOUT_MS),
    pageLimit: z.number().default(DEFAULT_PAGE_LIMIT),
});
/** Configured timeout and page bound must be positive integers. */
function assertPositiveInteger(name, value) {
    if (!Number.isInteger(value) || value < 1)
        throw new Error(`tool-cloud-disk: ${name} must be a positive integer`);
}
/** Pending-call presentation: a generic card titled by the target or query. */
function presentListCall(args) {
    return { card: 'generic', title: args.parentId ?? 'Cloud disk root', kind: 'read', rawInput: args };
}
function presentSearchCall(args) {
    return { card: 'generic', title: `Search: ${args.query}`, kind: 'search', rawInput: args.query };
}
/** Project one seam page into the canonical model-facing output value. */
function pageValue(page) {
    return {
        nodes: page.nodes.map(node => ({
            id: node.id,
            kind: node.kind,
            name: node.name,
            ...node.parentId !== undefined ? { parentId: node.parentId } : {},
            ...node.size !== undefined ? { size: node.size } : {},
            ...node.updatedAt !== undefined ? { updatedAt: node.updatedAt } : {},
        })),
        ...page.nextCursor !== undefined ? { nextCursor: page.nextCursor } : {},
    };
}
/** Render one page as model-facing text. */
function formatPage(value, header) {
    if (value.nodes.length === 0)
        return 'No CloudDisk items found.';
    const lines = value.nodes.map((node) => {
        const type = node.kind === 'directory' ? 'folder' : 'file';
        const size = node.size !== undefined ? ` (${String(node.size)} bytes)` : '';
        return `- [${type}] ${node.name} — id ${node.id}${size}`;
    });
    const tail = value.nextCursor !== undefined ? `\n\nMore items follow; pass nextCursor "${value.nextCursor}" to page on.` : '';
    return `${header}\n${lines.join('\n')}${tail}`;
}
/**
 * Register the enabled CloudDisk tools and their system-prompt guidance.
 *
 * @param ctx - context whose `tools`, `cloudDisk`, and `systemPrompt` are composed
 *   (tools/systemPrompt registrations are effect-scoped and unregister on dispose).
 * @param config - resolved tool config.
 */
export function apply(ctx, config) {
    const resolved = config;
    assertPositiveInteger('timeoutMs', resolved.timeoutMs);
    assertPositiveInteger('pageLimit', resolved.pageLimit);
    ctx.systemPrompt.section({
        name: 'tool:cloud_disk',
        order: 115,
        text: 'You can browse the user\'s cloud disk with the cloud_disk_list and cloud_disk_search tools. Every returned item carries a stable id; reuse those ids when you need to reference the same file or folder again.',
    });
    if (resolved.list) {
        ctx.tools.register(defineTool({
            name: 'cloud_disk_list',
            description: 'List one directory page from the user\'s cloud disk. Pass a parentId to open a folder, or omit it to start at the root. Returns stable item ids with name and kind.',
            parameters: {
                parentId: { type: 'string', description: 'The folder id to list; omit for the root directory.' },
                cursor: { type: 'string', description: 'The nextCursor from a previous page to page on.' },
                limit: { type: 'number', description: `Maximum items to return (default ${String(resolved.pageLimit)}).` },
            },
            output: {
                schema: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                        nodes: {
                            type: 'array',
                            required: true,
                            items: {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                    id: { type: 'string', required: true },
                                    kind: { type: 'string', required: true },
                                    name: { type: 'string', required: true },
                                    parentId: { type: 'string' },
                                    size: { type: 'number' },
                                    updatedAt: { type: 'string' },
                                },
                            },
                        },
                        nextCursor: { type: 'string' },
                    },
                },
                render: (_args, value) => [{ type: 'text', text: formatPage(value, 'Cloud disk contents:') }],
                presentationMeta: (_args, value) => ({
                    ids: value.nodes.map(node => node.id),
                    hasMore: value.nextCursor !== undefined,
                }),
            },
            timeoutMs: resolved.timeoutMs,
            // Provider reads do not mutate parent-agent state.
            isConcurrencySafe: () => true,
            async execute(args, exec) {
                const request = {
                    ...args.parentId !== undefined ? { parentId: args.parentId } : {},
                    ...args.cursor !== undefined ? { cursor: args.cursor } : {},
                    limit: args.limit ?? resolved.pageLimit,
                };
                const page = await ctx.cloudDisk.list(request, exec.signal);
                return pageValue(page);
            },
            presentCall: presentListCall,
        }));
    }
    if (resolved.search) {
        ctx.tools.register(defineTool({
            name: 'cloud_disk_search',
            description: 'Search the user\'s cloud disk by name or content. Returns stable item ids with name and kind.',
            parameters: {
                query: { type: 'string', required: true, description: 'The search query.' },
                cursor: { type: 'string', description: 'The nextCursor from a previous page to page on.' },
                limit: { type: 'number', description: `Maximum items to return (default ${String(resolved.pageLimit)}).` },
            },
            output: {
                schema: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                        nodes: {
                            type: 'array',
                            required: true,
                            items: {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                    id: { type: 'string', required: true },
                                    kind: { type: 'string', required: true },
                                    name: { type: 'string', required: true },
                                    parentId: { type: 'string' },
                                    size: { type: 'number' },
                                    updatedAt: { type: 'string' },
                                },
                            },
                        },
                        nextCursor: { type: 'string' },
                    },
                },
                render: (_args, value) => [{ type: 'text', text: formatPage(value, 'Cloud disk results:') }],
                presentationMeta: (_args, value) => ({
                    ids: value.nodes.map(node => node.id),
                    hasMore: value.nextCursor !== undefined,
                }),
            },
            timeoutMs: resolved.timeoutMs,
            // Provider reads do not mutate parent-agent state.
            isConcurrencySafe: () => true,
            async execute(args, exec) {
                if (args.query.trim().length === 0)
                    throw new Error('query must be a non-empty string');
                const page = await ctx.cloudDisk.search({ query: args.query, ...args.cursor !== undefined ? { cursor: args.cursor } : {}, limit: args.limit ?? resolved.pageLimit }, exec.signal);
                return pageValue(page);
            },
            presentCall: presentSearchCall,
        }));
    }
}
//# sourceMappingURL=index.js.map