import { createCloudDiskApi } from "./cloud-disk-api.js";
import { CloudDiskPage } from "./CloudDiskPage.js";
import { CloudDiskFooterItem } from "./CloudDiskFooterItem.js";
import { CloudDiskNavItem } from "./CloudDiskNavItem.js";
import { CloudDiskOverlay } from "./CloudDiskOverlay.js";
import { en, zh } from "./locales.js";
import { createCloudDiskWorkspaceStore } from "./workspace-store.js";
export const inject = ['slots', 'layout', 'connection', 'locale'];
const NS = 'cloudDisk';
const PAGE_ID = 'cloud-disk';
export function apply(ctx) {
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-cloud-disk: dictionaries');
    const hostConnection = () => {
        const connection = ctx.get('connection');
        if (connection === undefined)
            throw new Error('Host connection unavailable');
        return connection;
    };
    const injected = () => ({ api: createCloudDiskApi(hostConnection()) });
    const modern = () => ctx.slots.spec('sidebar.primary.action') !== undefined
        && ctx.slots.spec('main.page') !== undefined;
    const mountModern = () => {
        const nav = ctx.slots.inject('sidebar.primary.action', () => ctx.slots.register({
            name: 'sidebar.primary.action', id: PAGE_ID, order: 23, locale: NS,
            inject: () => ({ pageId: PAGE_ID, open: () => { ctx.layout.openPrimaryPage(PAGE_ID); } }),
        }, CloudDiskNavItem));
        const page = ctx.slots.inject('main.page', () => [
            ctx.slots.register({ name: 'main.page', key: PAGE_ID, locale: NS, inject: injected }, CloudDiskPage),
            () => { ctx.layout.closePrimaryPage(PAGE_ID); },
        ]);
        return () => { page(); nav(); };
    };
    const mountLegacy = () => {
        const workspace = createCloudDiskWorkspaceStore();
        const footer = ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
            name: 'sidebar.footer.action', id: PAGE_ID, order: 23, locale: NS, store: workspace,
            inject: actions => ({ open: () => { actions.open(); } }),
        }, CloudDiskFooterItem));
        const overlay = ctx.slots.inject('shell.overlay', () => ctx.slots.register({
            name: 'shell.overlay', id: PAGE_ID, order: 23, locale: NS, store: workspace, inject: injected,
        }, CloudDiskOverlay));
        return () => { overlay(); footer(); };
    };
    ctx.effect(() => {
        let mode;
        let dispose = () => { };
        const reconcile = () => {
            const next = modern() ? 'modern' : 'legacy';
            if (next === mode)
                return;
            dispose();
            mode = next;
            dispose = next === 'modern' ? mountModern() : mountLegacy();
        };
        const offPrimary = ctx.slots.subscribe('sidebar.primary.action', reconcile);
        const offPage = ctx.slots.subscribe('main.page', reconcile);
        reconcile();
        return () => { offPage(); offPrimary(); dispose(); };
    }, 'ui-cloud-disk: runtime adapter');
}
//# sourceMappingURL=index.js.map