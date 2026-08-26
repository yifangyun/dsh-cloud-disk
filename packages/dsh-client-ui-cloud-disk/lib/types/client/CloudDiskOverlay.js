import { jsx as _jsx } from "react/jsx-runtime";
import { CloudDiskPage } from "./CloudDiskPage.js";
import css from './CloudDiskOverlay.module.css';
/** Right-side CloudDisk workspace for runtimes without first-level page slots. */
export function CloudDiskOverlay({ api, t, useStore }) {
    const open = useStore(state => state.open);
    if (!open)
        return null;
    return _jsx("section", { className: css.root, "aria-label": t('title'), children: _jsx(CloudDiskPage, { api: api, t: t }) });
}
//# sourceMappingURL=CloudDiskOverlay.js.map