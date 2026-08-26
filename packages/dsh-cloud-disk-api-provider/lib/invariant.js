//#region lib/types/invariant.js
/**
* Package-owned invariant companion for `@aicloud360/dsh-cloud-disk-api-provider`.
* @module @aicloud360/dsh-cloud-disk-api-provider/invariant
*/
const PACKAGE_NAME = "@aicloud360/dsh-cloud-disk-api-provider";
/** Cordis companion plugin name. */
const name = "cloud-disk-api-provider-invariant";
/** Service required before the companion can reserve package ownership. */
const inject = ["invariants"];
/** No runtime invariant: provider behavior is enforced at operation time and routed through stable `CloudDiskError` codes. */
const install = () => {};
/**
* Register this package's invariant companion.
* @param ctx - Cordis context carrying the invariant service.
* @returns the installed registration's disposer.
*/
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
