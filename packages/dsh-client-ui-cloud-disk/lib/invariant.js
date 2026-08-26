//#region lib/types/invariant.js
/**
* Package-owned invariant companion for `@aicloud360/dsh-client-ui-cloud-disk`.
* @module @aicloud360/dsh-client-ui-cloud-disk/invariant
*/
const PACKAGE_NAME = "@aicloud360/dsh-client-ui-cloud-disk";
/** Cordis companion plugin name. */
const name = "client-ui-cloud-disk-invariant";
/** Service required before the companion can reserve package ownership. */
const inject = ["invariants"];
/**
* No runtime invariant: a pure-consumer plugin registering a sidebar entry and
* primary page plus its locale dictionaries. Its inject face resolves the Host
* connection; it emits no cordis events and owns no cross-plugin mutable state.
*/
const install = () => {};
/**
* Register this package's invariant companion.
* @param ctx - Cordis context carrying the invariant service.
* @returns the installed registration's disposer after setup succeeds.
*/
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
