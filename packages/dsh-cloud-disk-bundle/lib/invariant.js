//#region lib/types/invariant.js
/** Package-owned invariant companion for the optional CloudDisk Bundle. */
const PACKAGE_NAME = "@aicloud360/dsh-cloud-disk-bundle";
/** Cordis companion plugin name. */
const name = "cloud-disk-bundle-invariant";
/** Service required before the companion can register. */
const inject = ["invariants"];
/** Bundle rows own no mutable relation beyond their component packages. */
const install = () => {};
/**
* Register the Bundle invariant companion.
* @param ctx - context carrying the invariant registry.
* @returns registration disposer.
*/
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
