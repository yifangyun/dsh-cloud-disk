/** Package-owned invariant companion for the optional CloudDisk Bundle. */
const PACKAGE_NAME = '@aicloud360/dsh-cloud-disk-bundle';
/** Cordis companion plugin name. */
export const name = 'cloud-disk-bundle-invariant';
/** Service required before the companion can register. */
export const inject = ['invariants'];
/** Bundle rows own no mutable relation beyond their component packages. */
const install = () => {
    // No runtime invariant: component packages own every mutable relationship.
};
/**
 * Register the Bundle invariant companion.
 * @param ctx - context carrying the invariant registry.
 * @returns registration disposer.
 */
export const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//# sourceMappingURL=invariant.js.map