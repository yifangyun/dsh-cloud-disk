import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Input } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './CloudDiskPage.module.css';
/**
 * Renders the standalone local-credential connection view.
 * @param props - Connection state and user actions supplied by the CloudDisk page.
 * @returns Centered connection management controls.
 */
function CloudDiskConnectionPanel(props) {
    const { t, apiKey, apiKeyConfigured, connecting, failure, onApiKeyChange, onConnect, } = props;
    return _jsxs("section", { className: css.connectionPanel, "aria-labelledby": "cloud-disk-setup-title", children: [_jsx("p", { className: css.connectionProduct, children: t('title') }), _jsx("h1", { id: "cloud-disk-setup-title", children: t('setupTitle') }), _jsx("p", { className: css.connectionDescription, children: t('setupDescription') }), _jsx("div", { className: css.connectionFields, children: _jsxs("label", { children: [t('apiKey'), _jsx(Input, { type: "password", autoComplete: "off", value: apiKey, onChange: event => onApiKeyChange(event.target.value), placeholder: apiKeyConfigured ? t('configured') : t('apiKey') })] }) }), failure !== undefined && _jsx("p", { className: css.connectionAlert, role: "alert", children: failure }), _jsx("div", { className: css.connectionActions, children: _jsx(Button, { variant: "primary", disabled: connecting, onClick: onConnect, children: connecting ? t('connecting') : t('connect') }) })] });
}
export { CloudDiskConnectionPanel };
//# sourceMappingURL=CloudDiskConnectionPanel.js.map