import { CloudDiskPage } from "./CloudDiskPage.js";
import { CloudDiskNavItem } from "./CloudDiskNavItem.js";
import { en, zh } from "./locales.js";
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
    const injected = () => ({ api: hostConnection().api });
    const navInjected = () => ({ pageId: PAGE_ID, open: () => { ctx.layout.openPrimaryPage(PAGE_ID); } });
    ctx.slots.inject('sidebar.primary.action', () => ctx.slots.register({
        name: 'sidebar.primary.action', id: PAGE_ID, order: 23, locale: NS,
        inject: navInjected,
    }, CloudDiskNavItem));
    ctx.slots.inject('main.page', () => ctx.slots.register({
        name: 'main.page', key: PAGE_ID, locale: NS,
        inject: injected,
    }, CloudDiskPage));
    ctx.effect(() => () => { ctx.layout.closePrimaryPage(PAGE_ID); }, 'ui-cloud-disk: close page on teardown');
}
//# sourceMappingURL=index.js.map