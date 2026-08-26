import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@deepseek-ai/dsh-client-ui-primitives';
import { CloudDiskPage } from "./CloudDiskPage.js";
import css from './CloudDiskOverlay.module.css';
/** Full-screen CloudDisk workspace for runtimes without first-level page slots. */
export function CloudDiskOverlay({ api, t, useStore, actions }) {
    const open = useStore(state => state.open);
    if (!open)
        return null;
    return _jsxs("section", { className: css.root, role: "dialog", "aria-modal": "true", "aria-label": t('title'), children: [_jsx("div", { className: css.toolbar, children: _jsx(Button, { onClick: () => { actions.close(); }, children: t('closeWorkspace') }) }), _jsx("div", { className: css.workspace, children: _jsx(CloudDiskPage, { api: api, t: t }) })] });
}
//# sourceMappingURL=CloudDiskOverlay.js.map