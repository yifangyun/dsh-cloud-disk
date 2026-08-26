//#region lib/types/invariant.js
/**
* Package-owned invariant companion for `@aicloud360/dsh-tool-cloud-disk`.
* @module @aicloud360/dsh-tool-cloud-disk/invariant
*/
const PACKAGE_NAME = "@aicloud360/dsh-tool-cloud-disk";
/** Cordis companion plugin name. */
const name = "tool-cloud-disk-invariant";
/** Service required before the companion can reserve package ownership. */
const inject = ["invariants"];
/** No runtime invariant: tool behavior is enforced at execution time and routed through stable `CloudDiskError` codes. */
const install = () => {};
/**
* Register this package's invariant companion.
* @param ctx - Cordis context carrying the invariant service.
* @returns the installed registration's disposer.
*/
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
