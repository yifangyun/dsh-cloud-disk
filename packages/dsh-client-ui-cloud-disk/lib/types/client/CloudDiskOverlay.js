import { jsx as _jsx } from "react/jsx-runtime";
import { useDismissOnOutsidePointer } from '@deepseek-ai/dsh-client-ui-primitives';
import { useEffect, useRef } from 'react';
import { CloudDiskPage } from "./CloudDiskPage.js";
import css from './CloudDiskOverlay.module.css';
/** Right-side CloudDisk workspace for runtimes without first-level page slots. */
export function CloudDiskOverlay({ api, t, useStore, actions, useSessions }) {
    const open = useStore(state => state.open);
    const root = useRef(null);
    const currentSession = useSessions(state => state.current);
    const openedFor = useRef(undefined);
    const capturedOpeningSession = useRef(false);
    useEffect(() => {
        if (!open) {
            capturedOpeningSession.current = false;
            return;
        }
        if (!capturedOpeningSession.current) {
            openedFor.current = currentSession;
            capturedOpeningSession.current = true;
            return;
        }
        if (openedFor.current !== currentSession)
            actions.close();
    }, [actions, currentSession, open]);
    useDismissOnOutsidePointer(root, open, actions.close);
    if (!open)
        return null;
    return _jsx("section", { ref: root, className: css.root, "aria-label": t('title'), children: _jsx(CloudDiskPage, { api: api, t: t }) });
}
//# sourceMappingURL=CloudDiskOverlay.js.map