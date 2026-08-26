import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Input } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './CloudDiskPage.module.css';
/**
 * Renders the standalone local-credential connection view.
 * @param props - Connection state and user actions supplied by the CloudDisk page.
 * @returns Centered connection management controls.
 */
function CloudDiskConnectionPanel(props) {
    const { t, apiKey, signingSecret, apiKeyConfigured, signingSecretConfigured, connecting, failure, onApiKeyChange, onSigningSecretChange, onConnect, } = props;
    return _jsxs("section", { className: css.connectionPanel, "aria-labelledby": "cloud-disk-setup-title", children: [_jsx("p", { className: css.connectionProduct, children: t('title') }), _jsx("h1", { id: "cloud-disk-setup-title", children: t('setupTitle') }), _jsx("p", { className: css.connectionDescription, children: t('setupDescription') }), _jsxs("label", { children: [t('apiKey'), _jsx(Input, { type: "password", autoComplete: "off", value: apiKey, onChange: event => onApiKeyChange(event.target.value), placeholder: apiKeyConfigured ? t('configured') : t('apiKey') })] }), _jsxs("label", { children: [t('signingSecret'), _jsx(Input, { type: "password", autoComplete: "off", value: signingSecret, onChange: event => onSigningSecretChange(event.target.value), placeholder: signingSecretConfigured ? t('configured') : t('signingSecret') })] }), failure !== undefined && _jsx("p", { role: "alert", children: failure }), _jsx("div", { className: css.connectionActions, children: _jsx(Button, { disabled: connecting, onClick: onConnect, children: connecting ? t('connecting') : t('connect') }) })] });
}
export { CloudDiskConnectionPanel };
//# sourceMappingURL=CloudDiskConnectionPanel.js.map