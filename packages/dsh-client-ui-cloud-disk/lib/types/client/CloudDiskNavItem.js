import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IconFolderOpenOutline16, Tooltip } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './CloudDiskNavItem.module.css';
/** First-level sidebar entry for the CloudDisk browser and connection flow. */
export function CloudDiskNavItem({ wide, primaryPage, pageId, open, t }) {
    const selected = primaryPage === pageId;
    return _jsx(Tooltip, { label: t('nav'), delayMs: 500, disabled: wide, children: _jsxs("button", { type: "button", className: `${css.entry}${wide ? '' : ` ${css.rail}`}`, "aria-current": selected ? 'page' : undefined, "aria-label": t('nav'), "data-selected": selected || undefined, onClick: open, children: [_jsx(IconFolderOpenOutline16, { size: wide ? 16 : 18 }), wide ? _jsx("span", { children: t('nav') }) : null] }) });
}
//# sourceMappingURL=CloudDiskNavItem.js.map