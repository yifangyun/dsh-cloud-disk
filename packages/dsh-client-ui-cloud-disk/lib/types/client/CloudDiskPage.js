import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Fragment, useEffect, useState } from 'react';
import { Button, Modal, IconChevronRightOutline14, IconFolderClose16, IconDataOutline16 } from '@deepseek-ai/dsh-client-ui-primitives';
import { CloudDiskConnectionPanel } from "./CloudDiskConnectionPanel.js";
import css from './CloudDiskPage.module.css';
const API_KEY_REF = 'CLOUD_DISK_API_KEY';
function displayNodeName(name) {
    const displayName = name.replace(/^\/+|\/+$/g, '');
    return displayName === '' ? name : displayName;
}
export function CloudDiskPage({ api, t, inDialog = false }) {
    const [path, setPath] = useState([]);
    const [cursor, setCursor] = useState();
    const [state, setState] = useState({ status: 'loading' });
    const [user, setUser] = useState();
    const [apiKey, setApiKey] = useState('');
    const [connecting, setConnecting] = useState(false);
    const [confirmDisconnect, setConfirmDisconnect] = useState(false);
    const parentId = path.at(-1)?.id;
    const load = async (nextCursor = cursor, append = false) => {
        if (append && state.status === 'ready')
            setState({ ...state, loadingMore: true });
        else
            setState({ status: 'loading' });
        const response = await api.cloudDisk.list({
            ...parentId === undefined ? {} : { parentId },
            ...nextCursor === undefined ? {} : { cursor: nextCursor },
        });
        if (!response.result.ok) {
            setState({ status: 'error', message: response.result.error.message });
            return;
        }
        setCursor(response.result.value.nextCursor);
        setState({
            status: 'ready',
            page: append && state.status === 'ready'
                ? {
                    nodes: [...state.page.nodes, ...response.result.value.nodes],
                    ...response.result.value.nextCursor === undefined ? {} : { nextCursor: response.result.value.nextCursor },
                }
                : response.result.value,
            loadingMore: false,
        });
    };
    const initialize = async () => {
        setState({ status: 'loading' });
        const response = await api.cloudDisk.describe({});
        if (!response.result.ok) {
            setState({ status: 'error', message: response.result.error.message });
            return;
        }
        if (!response.result.value.available) {
            setUser(undefined);
            if (response.result.value.errorCode === 'CLOUD_DISK_CREDENTIAL_MISSING') {
                await openSetup();
                return;
            }
            setState({ status: 'unavailable', ...response.result.value.errorCode === undefined ? {} : { errorCode: response.result.value.errorCode } });
            return;
        }
        setUser(response.result.value.user?.displayName ?? response.result.value.user?.id);
        await load();
    };
    useEffect(() => { void initialize(); }, [parentId]);
    const openSetup = async () => {
        setConfirmDisconnect(false);
        setState({ status: 'loading' });
        try {
            const response = await api.credentials.describe({ refs: [API_KEY_REF] });
            if (!response.result.ok) {
                setState({ status: 'error', message: response.result.error.message });
                return;
            }
            const credentials = response.result.value.credentials;
            const apiKeyStatus = credentials[API_KEY_REF];
            if (apiKeyStatus === undefined) {
                setState({ status: 'error', message: t('credentialsUnavailable') });
                return;
            }
            setState({ status: 'setup', credentials: { apiKey: apiKeyStatus } });
        }
        catch {
            setState({ status: 'error', message: t('credentialsUnavailable') });
        }
    };
    const connect = async () => {
        if (state.status !== 'setup')
            return;
        const nextApiKey = apiKey.trim();
        if (!state.credentials.apiKey.configured && nextApiKey.length === 0) {
            setState({ ...state, failure: t('apiKeyRequired') });
            return;
        }
        setConnecting(true);
        try {
            if (nextApiKey.length > 0) {
                const response = await api.credentials.set({ ref: API_KEY_REF, value: nextApiKey });
                if (!response.result.ok) {
                    setState({ ...state, failure: response.result.error.message });
                    return;
                }
            }
            setApiKey('');
            await initialize();
        }
        catch {
            setState({ ...state, failure: t('credentialsUnavailable') });
        }
        finally {
            setConnecting(false);
        }
    };
    const disconnect = async () => {
        setConnecting(true);
        try {
            const apiKeyResponse = await api.credentials.unset({ ref: API_KEY_REF });
            if (!apiKeyResponse.result.ok) {
                setState({ status: 'error', message: apiKeyResponse.result.error.message });
                return;
            }
            setUser(undefined);
            setConfirmDisconnect(false);
            await openSetup();
        }
        catch {
            setState({ status: 'error', message: t('credentialsUnavailable') });
        }
        finally {
            setConnecting(false);
        }
    };
    const resetToRoot = () => { setPath([]); setCursor(undefined); };
    const open = (node) => {
        if (node.kind !== 'directory')
            return;
        setPath(current => [...current, { id: node.id, name: displayNodeName(node.name) }]);
        setCursor(undefined);
    };
    const goBack = () => {
        setPath(current => current.slice(0, -1));
        setCursor(undefined);
    };
    const unavailableMessage = state.status !== 'unavailable' ? undefined
        : state.errorCode === 'CLOUD_DISK_PROVIDER_CONFIGURED_MISSING' || state.errorCode === 'CLOUD_DISK_PROVIDER_CONFIGURED_UNAVAILABLE' ? t('unavailableConfiguration')
            : state.errorCode === 'CLOUD_DISK_CREDENTIAL_MISSING' ? t('unavailableCredential')
                : state.errorCode === 'CLOUD_DISK_AUTHENTICATION_FAILED' ? t('unavailableAuthentication')
                    : state.errorCode === 'CLOUD_DISK_NETWORK_FAILED' ? t('unavailableNetwork')
                        : state.errorCode === 'CLOUD_DISK_PROVIDER_AMBIGUOUS' ? t('unavailableProvider')
                            : state.errorCode === 'CLOUD_DISK_PROVIDER_FAILED' ? t('unavailableService')
                                : t('unavailable');
    if (state.status === 'setup')
        return _jsx("main", { className: css.connectionRoot, "aria-label": t('title'), children: _jsx(CloudDiskConnectionPanel, { t: t, apiKey: apiKey, apiKeyConfigured: state.credentials.apiKey.configured, connecting: connecting, ...state.failure === undefined ? {} : { failure: state.failure }, onApiKeyChange: setApiKey, onConnect: () => void connect() }) });
    return _jsxs("main", { className: css.root, "aria-label": t('title'), children: [_jsxs("header", { className: css.header, children: [_jsxs("div", { children: [user !== undefined && _jsxs("p", { className: css.eyebrow, children: [t('user'), ": ", user] }), !inDialog && _jsx("h1", { children: t('title') })] }), _jsxs("div", { className: css.headerActions, children: [state.status === 'ready' && _jsx(Button, { disabled: connecting, onClick: () => setConfirmDisconnect(true), children: t('disconnect') }), _jsx(Button, { disabled: connecting, onClick: () => void initialize(), children: t('refresh') })] })] }), parentId !== undefined && _jsx(Button, { variant: "outline", onClick: goBack, children: t('back') }), _jsxs("nav", { className: css.path, "aria-label": t('path'), children: [_jsx("button", { type: "button", onClick: resetToRoot, "aria-current": path.length === 0 ? 'page' : undefined, children: t('root') }), path.map((location, index) => _jsxs(Fragment, { children: [_jsx(IconChevronRightOutline14, { "aria-hidden": "true" }), _jsx("button", { type: "button", onClick: () => { setPath(path.slice(0, index + 1)); setCursor(undefined); }, "aria-current": index === path.length - 1 ? 'page' : undefined, children: location.name })] }, location.id))] }), state.status === 'loading' && _jsx("p", { role: "status", children: t('loading') }), state.status === 'unavailable' && _jsxs("section", { role: "status", children: [_jsx("p", { children: unavailableMessage }), _jsx(Button, { onClick: () => void initialize(), children: t('retry') })] }), state.status === 'error' && _jsxs("section", { role: "alert", children: [_jsx("p", { children: state.message || t('unavailable') }), _jsx(Button, { onClick: () => void load(cursor), children: t('retry') })] }), state.status === 'ready' && _jsxs(_Fragment, { children: [_jsx("ul", { className: css.list, "aria-label": t('root'), children: state.page.nodes.map(node => _jsx("li", { children: _jsxs("button", { className: css.row, onClick: () => open(node), disabled: node.kind !== 'directory', children: [node.kind === 'directory' ? _jsx(IconFolderClose16, {}) : _jsx(IconDataOutline16, {}), _jsx("span", { children: displayNodeName(node.name) }), _jsx("small", { children: t(node.kind) })] }) }, node.id)) }), state.page.nodes.length === 0 && _jsx("p", { children: t('empty') }), state.page.nextCursor !== undefined && _jsx(Button, { disabled: state.loadingMore, onClick: () => void load(state.page.nextCursor, true), children: state.loadingMore ? t('loading') : t('next') })] }), _jsx(Modal, { open: state.status === 'ready' && confirmDisconnect, onClose: () => setConfirmDisconnect(false), title: t('disconnectTitle'), closeLabel: t('cancel'), description: t('disconnectWarning'), footer: _jsxs(_Fragment, { children: [_jsx(Button, { disabled: connecting, onClick: () => setConfirmDisconnect(false), children: t('cancel') }), _jsx(Button, { disabled: connecting, onClick: () => void disconnect(), children: t('confirmDisconnect') })] }) })] });
}
//# sourceMappingURL=CloudDiskPage.js.map