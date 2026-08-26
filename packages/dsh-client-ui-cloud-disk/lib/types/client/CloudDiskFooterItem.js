import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IconFolderOpenOutline16, Tooltip } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './CloudDiskNavItem.module.css';
/** Opens the legacy CloudDisk workspace from the sidebar foot. */
export function CloudDiskFooterItem({ wide, open, t }) {
    return _jsx(Tooltip, { label: t('nav'), delayMs: 500, disabled: wide, children: _jsxs("button", { type: "button", className: `${css.entry}${wide ? '' : ` ${css.rail}`}`, "aria-label": t('nav'), onClick: open, children: [_jsx(IconFolderOpenOutline16, { size: wide ? 16 : 18 }), wide ? _jsx("span", { children: t('nav') }) : null] }) });
}
//# sourceMappingURL=CloudDiskFooterItem.js.map