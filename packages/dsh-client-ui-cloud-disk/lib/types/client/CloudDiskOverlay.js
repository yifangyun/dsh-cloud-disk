import { jsx as _jsx } from "react/jsx-runtime";
import { Modal } from '@deepseek-ai/dsh-client-ui-primitives';
import { useEffect, useRef } from 'react';
import { CloudDiskPage } from "./CloudDiskPage.js";
import css from './CloudDiskOverlay.module.css';
/** CloudDisk modal workspace for runtimes without first-level page slots. */
export function CloudDiskOverlay({ api, t, useStore, actions, useSessions }) {
    const open = useStore(state => state.open);
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
    if (!open)
        return null;
    return _jsx(Modal, { open: true, onClose: actions.close, title: t('title'), closeLabel: t('cancel'), className: css.dialog ?? '', contentClassName: css.content ?? '', children: _jsx(CloudDiskPage, { api: api, t: t, inDialog: true }) });
}
//# sourceMappingURL=CloudDiskOverlay.js.map