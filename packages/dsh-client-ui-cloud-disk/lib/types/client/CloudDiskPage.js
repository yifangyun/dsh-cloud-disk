import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Fragment, useEffect, useState } from 'react';
import { Button, Input, IconChevronRightOutline14, IconFolderClose16, IconDataOutline16 } from '@deepseek-ai/dsh-client-ui-primitives';
import { CloudDiskConnectionPanel } from "./CloudDiskConnectionPanel.js";
import css from './CloudDiskPage.module.css';
const API_KEY_REF = 'CLOUD_DISK_API_KEY';
const SIGNING_SECRET_REF = 'CLOUD_DISK_SIGNING_SECRET';
function displayNodeName(name) {
    const displayName = name.replace(/^\/+|\/+$/g, '');
    return displayName === '' ? name : displayName;
}
export function CloudDiskPage({ api, t }) {
    const [path, setPath] = useState([]);
    const [query, setQuery] = useState('');
    const [submitted, setSubmitted] = useState('');
    const [cursor, setCursor] = useState();
    const [state, setState] = useState({ status: 'loading' });
    const [user, setUser] = useState();
    const [apiKey, setApiKey] = useState('');
    const [signingSecret, setSigningSecret] = useState('');
    const [connecting, setConnecting] = useState(false);
    const [confirmDisconnect, setConfirmDisconnect] = useState(false);
    const [editingCredentials, setEditingCredentials] = useState(false);
    const parentId = path.at(-1)?.id;
    const load = async (nextCursor = cursor, append = false) => {
        if (append && state.status === 'ready')
            setState({ ...state, loadingMore: true });
        else
            setState({ status: 'loading' });
        const response = submitted.trim() === ''
            ? await api.cloudDisk.list({
                ...parentId === undefined ? {} : { parentId },
                ...nextCursor === undefined ? {} : { cursor: nextCursor },
            })
            : await api.cloudDisk.search({ query: submitted.trim(), ...nextCursor === undefined ? {} : { cursor: nextCursor } });
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
            if (response.result.value.errorCode === 'CLOUD_DISK_CREDENTIAL_MISSING' || response.result.value.errorCode === 'CLOUD_DISK_SIGNING_SECRET_MISSING') {
                await openSetup();
                return;
            }
            setState({ status: 'unavailable', ...response.result.value.errorCode === undefined ? {} : { errorCode: response.result.value.errorCode } });
            return;
        }
        setUser(response.result.value.user?.displayName ?? response.result.value.user?.id);
        await load();
    };
    useEffect(() => { void initialize(); }, [parentId, submitted]);
    const openSetup = async (returnToDisk) => {
        setConfirmDisconnect(false);
        setEditingCredentials(false);
        setState({ status: 'loading' });
        try {
            const response = await api.credentials.describe({ refs: [API_KEY_REF, SIGNING_SECRET_REF] });
            if (!response.result.ok) {
                setState({ status: 'error', message: response.result.error.message });
                return;
            }
            const credentials = response.result.value.credentials;
            const apiKeyStatus = credentials[API_KEY_REF];
            const signingSecretStatus = credentials[SIGNING_SECRET_REF];
            if (apiKeyStatus === undefined || signingSecretStatus === undefined) {
                setState({ status: 'error', message: t('credentialsUnavailable') });
                return;
            }
            setState({ status: 'setup', credentials: { apiKey: apiKeyStatus, signingSecret: signingSecretStatus }, ...returnToDisk === undefined ? {} : { returnToDisk } });
        }
        catch {
            setState({ status: 'error', message: t('credentialsUnavailable') });
        }
    };
    const connect = async () => {
        if (state.status !== 'setup')
            return;
        const nextApiKey = apiKey.trim();
        const nextSigningSecret = signingSecret.trim();
        if (!state.credentials.apiKey.configured && nextApiKey.length === 0) {
            setState({ ...state, failure: t('apiKeyRequired') });
            return;
        }
        if (!state.credentials.signingSecret.configured && nextSigningSecret.length === 0) {
            setState({ ...state, failure: t('signingSecretRequired') });
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
            if (nextSigningSecret.length > 0) {
                const response = await api.credentials.set({ ref: SIGNING_SECRET_REF, value: nextSigningSecret });
                if (!response.result.ok) {
                    setState({ ...state, failure: response.result.error.message });
                    return;
                }
            }
            setApiKey('');
            setSigningSecret('');
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
            const signingSecretResponse = await api.credentials.unset({ ref: SIGNING_SECRET_REF });
            if (!signingSecretResponse.result.ok) {
                setState({ status: 'error', message: signingSecretResponse.result.error.message });
                return;
            }
            setUser(undefined);
            setConfirmDisconnect(false);
            setEditingCredentials(false);
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
    const submit = (event) => { event.preventDefault(); resetToRoot(); setSubmitted(query); };
    const open = (node) => {
        if (node.kind !== 'directory')
            return;
        setPath(current => [...current, { id: node.id, name: displayNodeName(node.name) }]);
        setSubmitted('');
        setQuery('');
        setCursor(undefined);
    };
    const goBack = () => {
        setPath(current => current.slice(0, -1));
        setCursor(undefined);
    };
    const returnToDisk = () => {
        if (state.status !== 'setup' || state.returnToDisk === undefined)
            return;
        setConfirmDisconnect(false);
        setEditingCredentials(false);
        setState({ status: 'ready', page: state.returnToDisk.page, loadingMore: state.returnToDisk.loadingMore });
    };
    const unavailableMessage = state.status !== 'unavailable' ? undefined
        : state.errorCode === 'CLOUD_DISK_PROVIDER_CONFIGURED_MISSING' || state.errorCode === 'CLOUD_DISK_PROVIDER_CONFIGURED_UNAVAILABLE' ? t('unavailableConfiguration')
            : state.errorCode === 'CLOUD_DISK_CREDENTIAL_MISSING' || state.errorCode === 'CLOUD_DISK_SIGNING_SECRET_MISSING' ? t('unavailableCredential')
                : state.errorCode === 'CLOUD_DISK_AUTHENTICATION_FAILED' ? t('unavailableAuthentication')
                    : state.errorCode === 'CLOUD_DISK_NETWORK_FAILED' ? t('unavailableNetwork')
                        : state.errorCode === 'CLOUD_DISK_PROVIDER_AMBIGUOUS' ? t('unavailableProvider')
                            : state.errorCode === 'CLOUD_DISK_PROVIDER_FAILED' ? t('unavailableService')
                                : t('unavailable');
    if (state.status === 'setup')
        return _jsx("main", { className: css.connectionRoot, "aria-label": t('title'), children: _jsx(CloudDiskConnectionPanel, { t: t, apiKey: apiKey, signingSecret: signingSecret, apiKeyConfigured: state.credentials.apiKey.configured, signingSecretConfigured: state.credentials.signingSecret.configured, connecting: connecting, ...state.failure === undefined ? {} : { failure: state.failure }, confirmDisconnect: confirmDisconnect, canReturnToDisk: state.returnToDisk !== undefined, ...user === undefined ? {} : { user }, showCredentialFields: state.returnToDisk === undefined || editingCredentials, onApiKeyChange: setApiKey, onSigningSecretChange: setSigningSecret, onConnect: () => void connect(), onStartDisconnect: () => setConfirmDisconnect(true), onDisconnect: () => void disconnect(), onCancelDisconnect: () => setConfirmDisconnect(false), onReturnToDisk: returnToDisk, onShowCredentialFields: () => setEditingCredentials(true) }) });
    return _jsxs("main", { className: css.root, "aria-label": t('title'), children: [_jsxs("header", { className: css.header, children: [_jsxs("div", { children: [user !== undefined && _jsxs("p", { className: css.eyebrow, children: [t('user'), ": ", user] }), _jsx("h1", { children: t('title') })] }), _jsxs("div", { className: css.headerActions, children: [state.status === 'ready' && _jsx(Button, { onClick: () => void openSetup({ page: state.page, loadingMore: state.loadingMore }), children: t('manageConnection') }), _jsx(Button, { onClick: () => void initialize(), children: t('refresh') })] })] }), state.status !== 'unavailable' && _jsxs("form", { className: css.search, onSubmit: submit, children: [_jsx(Input, { "aria-label": t('search'), value: query, onChange: event => setQuery(event.target.value), placeholder: t('search') }), _jsx(Button, { type: "submit", children: t('search') }), parentId !== undefined && submitted === '' && _jsx(Button, { type: "button", onClick: goBack, children: t('back') }), submitted !== '' && _jsx(Button, { type: "button", onClick: () => { setQuery(''); setSubmitted(''); resetToRoot(); }, children: t('clearSearch') })] }), submitted === '' && _jsxs("nav", { className: css.path, "aria-label": t('path'), children: [_jsx("button", { type: "button", onClick: resetToRoot, "aria-current": path.length === 0 ? 'page' : undefined, children: t('root') }), path.map((location, index) => _jsxs(Fragment, { children: [_jsx(IconChevronRightOutline14, { "aria-hidden": "true" }), _jsx("button", { type: "button", onClick: () => { setPath(path.slice(0, index + 1)); setCursor(undefined); }, "aria-current": index === path.length - 1 ? 'page' : undefined, children: location.name })] }, location.id))] }), state.status === 'loading' && _jsx("p", { role: "status", children: t('loading') }), state.status === 'unavailable' && _jsxs("section", { role: "status", children: [_jsx("p", { children: unavailableMessage }), _jsx(Button, { onClick: () => void initialize(), children: t('retry') })] }), state.status === 'error' && _jsxs("section", { role: "alert", children: [_jsx("p", { children: state.message || t('unavailable') }), _jsx(Button, { onClick: () => void load(cursor), children: t('retry') })] }), state.status === 'ready' && _jsxs(_Fragment, { children: [_jsx("ul", { className: css.list, "aria-label": submitted === '' ? t('root') : t('search'), children: state.page.nodes.map(node => _jsx("li", { children: _jsxs("button", { className: css.row, onClick: () => open(node), disabled: node.kind !== 'directory', children: [node.kind === 'directory' ? _jsx(IconFolderClose16, {}) : _jsx(IconDataOutline16, {}), _jsx("span", { children: displayNodeName(node.name) }), _jsx("small", { children: t(node.kind) })] }) }, node.id)) }), state.page.nodes.length === 0 && _jsx("p", { children: submitted === '' ? t('empty') : t('searchEmpty') }), state.page.nextCursor !== undefined && _jsx(Button, { disabled: state.loadingMore, onClick: () => void load(state.page.nextCursor, true), children: state.loadingMore ? t('loading') : t('next') })] })] });
}
//# sourceMappingURL=CloudDiskPage.js.map