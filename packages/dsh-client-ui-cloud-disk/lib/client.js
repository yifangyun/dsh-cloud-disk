window.__ModuleLoader__.load({
	id: "@aicloud360/dsh-client-ui-cloud-disk",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let _deepseek_ai_dsh_client_runtime_client = require("@deepseek-ai/dsh-client-runtime/client");
		//#region lib/types/client/cloud-disk-api.js
		/** CloudDisk's stable private RPC client over the generic Connection channel. */
		const CHANNEL = "/cloud-disk";
		const API_KEY_REF$1 = "CLOUD_DISK_API_KEY";
		function response(result) {
			return {
				rpcId: "cloud-disk",
				result
			};
		}
		function badCredentialResponse(message) {
			return {
				rpcId: "cloud-disk",
				result: {
					ok: false,
					error: {
						code: "bad-request",
						message,
						details: { issues: [] }
					}
				}
			};
		}
		/**
		* Create the CloudDisk browser API from the plugin-private generic RPC channel.
		* The returned credentials methods accept only the CloudDisk API-key reference;
		* they cannot be used to inspect or modify unrelated Host credentials.
		* @param connection - active browser-to-Host connection.
		* @returns The API subset consumed by the CloudDisk workspace.
		*/
		function createCloudDiskApi(connection) {
			return {
				cloudDisk: {
					async describe(_payload, signal) {
						return response(await connection.rpc.call(CHANNEL, "status", {}, signal));
					},
					async list(payload, signal) {
						return response(await connection.rpc.call(CHANNEL, "browse/list", payload, signal));
					},
					async search(payload, signal) {
						return response(await connection.rpc.call(CHANNEL, "browse/search", payload, signal));
					}
				},
				credentials: {
					async describe(payload, signal) {
						if (payload.refs.some((ref) => ref !== API_KEY_REF$1)) return badCredentialResponse("unknown cloud disk credential");
						const rpc = await connection.rpc.call(CHANNEL, "credentials/describe", {}, signal);
						if (!rpc.ok) return response(rpc);
						const value = rpc.value;
						return response({
							ok: true,
							value: { credentials: Object.fromEntries(payload.refs.map((ref) => [ref, value.apiKey])) }
						});
					},
					async set(payload, signal) {
						if (payload.ref !== API_KEY_REF$1) return badCredentialResponse("unknown cloud disk credential");
						return response(await connection.rpc.call(CHANNEL, "credentials/set", { value: payload.value }, signal));
					},
					async unset(payload, signal) {
						if (payload.ref !== API_KEY_REF$1) return badCredentialResponse("unknown cloud disk credential");
						return response(await connection.rpc.call(CHANNEL, "credentials/unset", {}, signal));
					}
				}
			};
		}
		//#endregion
		//#region \0dsh-css:/Users/qihoo/per-wspace/deepseek-harness-studio/packages/client/ui-cloud-disk/src/client/CloudDiskPage.module.css.mjs
		const css$2 = ".AhltiW_root{box-sizing:border-box;width:100%;height:100%;min-height:0;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);flex-direction:column;gap:16px;padding:28px 36px;display:flex;overflow:hidden}.AhltiW_connectionRoot{box-sizing:border-box;width:100%;height:100%;min-height:0;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);justify-content:center;align-items:center;padding:40px;display:flex}.AhltiW_header{justify-content:space-between;align-items:flex-start;gap:16px;display:flex}.AhltiW_headerActions{gap:8px;display:flex}.AhltiW_eyebrow{color:var(--dsw-alias-label-tertiary);margin:0 0 4px;font-size:12px}h1{margin:0;font-size:24px}.AhltiW_path{min-height:24px;color:var(--dsw-alias-label-secondary);flex-wrap:wrap;align-items:center;gap:4px;display:flex}.AhltiW_path button{color:inherit;font:inherit;cursor:pointer;background:0 0;border:0;border-radius:4px;padding:2px 4px}.AhltiW_path button:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1)}.AhltiW_path button[aria-current=page]{color:var(--dsw-alias-label-primary);cursor:default}.AhltiW_connectionPanel{flex-direction:column;gap:16px;width:min(100%,480px);display:flex}.AhltiW_connectionPanel h1,.AhltiW_connectionPanel p{margin:0}.AhltiW_connectionFields{flex-direction:column;gap:14px;display:flex}.AhltiW_connectionPanel label{color:var(--dsw-alias-label-secondary);flex-direction:column;gap:6px;display:flex}.AhltiW_connectionProduct{color:var(--dsw-alias-label-tertiary);font-size:14px}.AhltiW_connectionDescription{color:var(--dsw-alias-label-secondary);line-height:1.55}.AhltiW_connectionAlert{border:1px solid var(--dsw-alias-label-error);color:var(--dsw-alias-label-error);border-radius:8px;padding:10px 12px;line-height:1.5}.AhltiW_connectionActions{justify-content:flex-end;padding-top:4px;display:flex}.AhltiW_list{flex-direction:column;flex:1;gap:4px;width:100%;min-height:0;margin:0;padding:0 8px 0 0;list-style:none;display:flex;overflow:auto}.AhltiW_row{width:100%;color:inherit;text-align:left;cursor:pointer;font:inherit;background:0 0;border:1px solid #0000;border-radius:10px;align-items:center;gap:10px;padding:11px 12px;display:flex}.AhltiW_row:hover:not(:disabled){border-color:var(--dsw-alias-border-secondary);background:var(--dsw-alias-bg-layer-1)}.AhltiW_row:disabled{cursor:default}.AhltiW_row span{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.AhltiW_row small{color:var(--dsw-alias-label-tertiary)}";
		const tagId$2 = "@aicloud360/dsh-client-ui-cloud-disk/CloudDiskPage.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@aicloud360/dsh-client-ui-cloud-disk";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		var CloudDiskPage_module_css_default = {
			"connectionActions": "AhltiW_connectionActions",
			"connectionAlert": "AhltiW_connectionAlert",
			"connectionDescription": "AhltiW_connectionDescription",
			"connectionFields": "AhltiW_connectionFields",
			"connectionPanel": "AhltiW_connectionPanel",
			"connectionProduct": "AhltiW_connectionProduct",
			"connectionRoot": "AhltiW_connectionRoot",
			"eyebrow": "AhltiW_eyebrow",
			"header": "AhltiW_header",
			"headerActions": "AhltiW_headerActions",
			"list": "AhltiW_list",
			"path": "AhltiW_path",
			"root": "AhltiW_root",
			"row": "AhltiW_row"
		};
		//#endregion
		//#region lib/types/client/CloudDiskConnectionPanel.js
		/**
		* Renders the standalone local-credential connection view.
		* @param props - Connection state and user actions supplied by the CloudDisk page.
		* @returns Centered connection management controls.
		*/
		function CloudDiskConnectionPanel(props) {
			const { t, apiKey, apiKeyConfigured, connecting, failure, onApiKeyChange, onConnect } = props;
			return (0, react_jsx_runtime.jsxs)("section", {
				className: CloudDiskPage_module_css_default.connectionPanel,
				"aria-labelledby": "cloud-disk-setup-title",
				children: [
					(0, react_jsx_runtime.jsx)("p", {
						className: CloudDiskPage_module_css_default.connectionProduct,
						children: t("title")
					}),
					(0, react_jsx_runtime.jsx)("h1", {
						id: "cloud-disk-setup-title",
						children: t("setupTitle")
					}),
					(0, react_jsx_runtime.jsx)("p", {
						className: CloudDiskPage_module_css_default.connectionDescription,
						children: t("setupDescription")
					}),
					(0, react_jsx_runtime.jsx)("div", {
						className: CloudDiskPage_module_css_default.connectionFields,
						children: (0, react_jsx_runtime.jsxs)("label", { children: [t("apiKey"), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
							type: "password",
							autoComplete: "off",
							value: apiKey,
							onChange: (event) => onApiKeyChange(event.target.value),
							placeholder: apiKeyConfigured ? t("configured") : t("apiKey")
						})] })
					}),
					failure !== void 0 && (0, react_jsx_runtime.jsx)("p", {
						className: CloudDiskPage_module_css_default.connectionAlert,
						role: "alert",
						children: failure
					}),
					(0, react_jsx_runtime.jsx)("div", {
						className: CloudDiskPage_module_css_default.connectionActions,
						children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "primary",
							disabled: connecting,
							onClick: onConnect,
							children: connecting ? t("connecting") : t("connect")
						})
					})
				]
			});
		}
		//#endregion
		//#region lib/types/client/CloudDiskPage.js
		const API_KEY_REF = "CLOUD_DISK_API_KEY";
		function displayNodeName(name) {
			const displayName = name.replace(/^\/+|\/+$/g, "");
			return displayName === "" ? name : displayName;
		}
		function CloudDiskPage({ api, t, inDialog = false }) {
			const [path, setPath] = (0, react.useState)([]);
			const [cursor, setCursor] = (0, react.useState)();
			const [state, setState] = (0, react.useState)({ status: "loading" });
			const [user, setUser] = (0, react.useState)();
			const [apiKey, setApiKey] = (0, react.useState)("");
			const [connecting, setConnecting] = (0, react.useState)(false);
			const [confirmDisconnect, setConfirmDisconnect] = (0, react.useState)(false);
			const parentId = path.at(-1)?.id;
			const load = async (nextCursor = cursor, append = false) => {
				if (append && state.status === "ready") setState({
					...state,
					loadingMore: true
				});
				else setState({ status: "loading" });
				const response = await api.cloudDisk.list({
					...parentId === void 0 ? {} : { parentId },
					...nextCursor === void 0 ? {} : { cursor: nextCursor }
				});
				if (!response.result.ok) {
					setState({
						status: "error",
						message: response.result.error.message
					});
					return;
				}
				setCursor(response.result.value.nextCursor);
				setState({
					status: "ready",
					page: append && state.status === "ready" ? {
						nodes: [...state.page.nodes, ...response.result.value.nodes],
						...response.result.value.nextCursor === void 0 ? {} : { nextCursor: response.result.value.nextCursor }
					} : response.result.value,
					loadingMore: false
				});
			};
			const initialize = async () => {
				setState({ status: "loading" });
				const response = await api.cloudDisk.describe({});
				if (!response.result.ok) {
					setState({
						status: "error",
						message: response.result.error.message
					});
					return;
				}
				if (!response.result.value.available) {
					setUser(void 0);
					if (response.result.value.errorCode === "CLOUD_DISK_CREDENTIAL_MISSING") {
						await openSetup();
						return;
					}
					setState({
						status: "unavailable",
						...response.result.value.errorCode === void 0 ? {} : { errorCode: response.result.value.errorCode }
					});
					return;
				}
				setUser(response.result.value.user?.displayName ?? response.result.value.user?.id);
				await load();
			};
			(0, react.useEffect)(() => {
				initialize();
			}, [parentId]);
			const openSetup = async () => {
				setConfirmDisconnect(false);
				setState({ status: "loading" });
				try {
					const response = await api.credentials.describe({ refs: [API_KEY_REF] });
					if (!response.result.ok) {
						setState({
							status: "error",
							message: response.result.error.message
						});
						return;
					}
					const apiKeyStatus = response.result.value.credentials[API_KEY_REF];
					if (apiKeyStatus === void 0) {
						setState({
							status: "error",
							message: t("credentialsUnavailable")
						});
						return;
					}
					setState({
						status: "setup",
						credentials: { apiKey: apiKeyStatus }
					});
				} catch {
					setState({
						status: "error",
						message: t("credentialsUnavailable")
					});
				}
			};
			const connect = async () => {
				if (state.status !== "setup") return;
				const nextApiKey = apiKey.trim();
				if (!state.credentials.apiKey.configured && nextApiKey.length === 0) {
					setState({
						...state,
						failure: t("apiKeyRequired")
					});
					return;
				}
				setConnecting(true);
				try {
					if (nextApiKey.length > 0) {
						const response = await api.credentials.set({
							ref: API_KEY_REF,
							value: nextApiKey
						});
						if (!response.result.ok) {
							setState({
								...state,
								failure: response.result.error.message
							});
							return;
						}
					}
					setApiKey("");
					await initialize();
				} catch {
					setState({
						...state,
						failure: t("credentialsUnavailable")
					});
				} finally {
					setConnecting(false);
				}
			};
			const disconnect = async () => {
				setConnecting(true);
				try {
					const apiKeyResponse = await api.credentials.unset({ ref: API_KEY_REF });
					if (!apiKeyResponse.result.ok) {
						setState({
							status: "error",
							message: apiKeyResponse.result.error.message
						});
						return;
					}
					setUser(void 0);
					setConfirmDisconnect(false);
					await openSetup();
				} catch {
					setState({
						status: "error",
						message: t("credentialsUnavailable")
					});
				} finally {
					setConnecting(false);
				}
			};
			const resetToRoot = () => {
				setPath([]);
				setCursor(void 0);
			};
			const open = (node) => {
				if (node.kind !== "directory") return;
				setPath((current) => [...current, {
					id: node.id,
					name: displayNodeName(node.name)
				}]);
				setCursor(void 0);
			};
			const goBack = () => {
				setPath((current) => current.slice(0, -1));
				setCursor(void 0);
			};
			const unavailableMessage = state.status !== "unavailable" ? void 0 : state.errorCode === "CLOUD_DISK_PROVIDER_CONFIGURED_MISSING" || state.errorCode === "CLOUD_DISK_PROVIDER_CONFIGURED_UNAVAILABLE" ? t("unavailableConfiguration") : state.errorCode === "CLOUD_DISK_CREDENTIAL_MISSING" ? t("unavailableCredential") : state.errorCode === "CLOUD_DISK_AUTHENTICATION_FAILED" ? t("unavailableAuthentication") : state.errorCode === "CLOUD_DISK_NETWORK_FAILED" ? t("unavailableNetwork") : state.errorCode === "CLOUD_DISK_PROVIDER_AMBIGUOUS" ? t("unavailableProvider") : state.errorCode === "CLOUD_DISK_PROVIDER_FAILED" ? t("unavailableService") : t("unavailable");
			if (state.status === "setup") return (0, react_jsx_runtime.jsx)("main", {
				className: CloudDiskPage_module_css_default.connectionRoot,
				"aria-label": t("title"),
				children: (0, react_jsx_runtime.jsx)(CloudDiskConnectionPanel, {
					t,
					apiKey,
					apiKeyConfigured: state.credentials.apiKey.configured,
					connecting,
					...state.failure === void 0 ? {} : { failure: state.failure },
					onApiKeyChange: setApiKey,
					onConnect: () => void connect()
				})
			});
			return (0, react_jsx_runtime.jsxs)("main", {
				className: CloudDiskPage_module_css_default.root,
				"aria-label": t("title"),
				children: [
					(0, react_jsx_runtime.jsxs)("header", {
						className: CloudDiskPage_module_css_default.header,
						children: [(0, react_jsx_runtime.jsxs)("div", { children: [user !== void 0 && (0, react_jsx_runtime.jsxs)("p", {
							className: CloudDiskPage_module_css_default.eyebrow,
							children: [
								t("user"),
								": ",
								user
							]
						}), !inDialog && (0, react_jsx_runtime.jsx)("h1", { children: t("title") })] }), (0, react_jsx_runtime.jsxs)("div", {
							className: CloudDiskPage_module_css_default.headerActions,
							children: [state.status === "ready" && (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								disabled: connecting,
								onClick: () => setConfirmDisconnect(true),
								children: t("disconnect")
							}), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								disabled: connecting,
								onClick: () => void initialize(),
								children: t("refresh")
							})]
						})]
					}),
					parentId !== void 0 && (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "outline",
						onClick: goBack,
						children: t("back")
					}),
					(0, react_jsx_runtime.jsxs)("nav", {
						className: CloudDiskPage_module_css_default.path,
						"aria-label": t("path"),
						children: [(0, react_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: resetToRoot,
							"aria-current": path.length === 0 ? "page" : void 0,
							children: t("root")
						}), path.map((location, index) => (0, react_jsx_runtime.jsxs)(react.Fragment, { children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronRightOutline14, { "aria-hidden": "true" }), (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setPath(path.slice(0, index + 1));
								setCursor(void 0);
							},
							"aria-current": index === path.length - 1 ? "page" : void 0,
							children: location.name
						})] }, location.id))]
					}),
					state.status === "loading" && (0, react_jsx_runtime.jsx)("p", {
						role: "status",
						children: t("loading")
					}),
					state.status === "unavailable" && (0, react_jsx_runtime.jsxs)("section", {
						role: "status",
						children: [(0, react_jsx_runtime.jsx)("p", { children: unavailableMessage }), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							onClick: () => void initialize(),
							children: t("retry")
						})]
					}),
					state.status === "error" && (0, react_jsx_runtime.jsxs)("section", {
						role: "alert",
						children: [(0, react_jsx_runtime.jsx)("p", { children: state.message || t("unavailable") }), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							onClick: () => void load(cursor),
							children: t("retry")
						})]
					}),
					state.status === "ready" && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
						(0, react_jsx_runtime.jsx)("ul", {
							className: CloudDiskPage_module_css_default.list,
							"aria-label": t("root"),
							children: state.page.nodes.map((node) => (0, react_jsx_runtime.jsx)("li", { children: (0, react_jsx_runtime.jsxs)("button", {
								className: CloudDiskPage_module_css_default.row,
								onClick: () => open(node),
								disabled: node.kind !== "directory",
								children: [
									node.kind === "directory" ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconFolderClose16, {}) : (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconDataOutline16, {}),
									(0, react_jsx_runtime.jsx)("span", { children: displayNodeName(node.name) }),
									(0, react_jsx_runtime.jsx)("small", { children: t(node.kind) })
								]
							}) }, node.id))
						}),
						state.page.nodes.length === 0 && (0, react_jsx_runtime.jsx)("p", { children: t("empty") }),
						state.page.nextCursor !== void 0 && (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							disabled: state.loadingMore,
							onClick: () => void load(state.page.nextCursor, true),
							children: state.loadingMore ? t("loading") : t("next")
						})
					] }),
					(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
						open: state.status === "ready" && confirmDisconnect,
						onClose: () => setConfirmDisconnect(false),
						title: t("disconnectTitle"),
						closeLabel: t("cancel"),
						description: t("disconnectWarning"),
						footer: (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							disabled: connecting,
							onClick: () => setConfirmDisconnect(false),
							children: t("cancel")
						}), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							disabled: connecting,
							onClick: () => void disconnect(),
							children: t("confirmDisconnect")
						})] })
					})
				]
			});
		}
		//#endregion
		//#region \0dsh-css:/Users/qihoo/per-wspace/deepseek-harness-studio/packages/client/ui-cloud-disk/src/client/CloudDiskNavItem.module.css.mjs
		const css$1 = "._5u3GiW_entry{box-sizing:border-box;width:calc(100% + 8px);height:34px;color:var(--dsw-alias-label-primary);font:inherit;text-align:left;cursor:pointer;background:0 0;border:0;border-radius:10px;align-items:center;gap:8px;margin:0 -4px;padding:6px 10px;font-size:14px;line-height:22px;display:flex;overflow:hidden}._5u3GiW_entry:hover,._5u3GiW_entry[data-selected]{background:var(--dsw-specific-sidebar-nav-item-active)}._5u3GiW_entry:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}._5u3GiW_entry span{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}._5u3GiW_entry._5u3GiW_rail{border-radius:50%;justify-content:center;gap:0;width:36px;height:36px;margin:0;padding:0}";
		const tagId$1 = "@aicloud360/dsh-client-ui-cloud-disk/CloudDiskNavItem.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@aicloud360/dsh-client-ui-cloud-disk";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var CloudDiskNavItem_module_css_default = {
			"entry": "_5u3GiW_entry",
			"rail": "_5u3GiW_rail"
		};
		//#endregion
		//#region lib/types/client/CloudDiskFooterItem.js
		/** Opens the legacy CloudDisk workspace from the sidebar foot. */
		function CloudDiskFooterItem({ wide, open, t }) {
			return (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
				label: t("nav"),
				delayMs: 500,
				disabled: wide,
				children: (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: `${CloudDiskNavItem_module_css_default.entry}${wide ? "" : ` ${CloudDiskNavItem_module_css_default.rail}`}`,
					"aria-label": t("nav"),
					onClick: open,
					children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconFolderOpenOutline16, { size: wide ? 16 : 18 }), wide ? (0, react_jsx_runtime.jsx)("span", { children: t("nav") }) : null]
				})
			});
		}
		//#endregion
		//#region lib/types/client/CloudDiskNavItem.js
		/** First-level sidebar entry for the CloudDisk browser and connection flow. */
		function CloudDiskNavItem({ wide, primaryPage, pageId, open, t }) {
			const selected = primaryPage === pageId;
			return (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
				label: t("nav"),
				delayMs: 500,
				disabled: wide,
				children: (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: `${CloudDiskNavItem_module_css_default.entry}${wide ? "" : ` ${CloudDiskNavItem_module_css_default.rail}`}`,
					"aria-current": selected ? "page" : void 0,
					"aria-label": t("nav"),
					"data-selected": selected || void 0,
					onClick: open,
					children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconFolderOpenOutline16, { size: wide ? 16 : 18 }), wide ? (0, react_jsx_runtime.jsx)("span", { children: t("nav") }) : null]
				})
			});
		}
		//#endregion
		//#region \0dsh-css:/Users/qihoo/per-wspace/deepseek-harness-studio/packages/client/ui-cloud-disk/src/client/CloudDiskOverlay.module.css.mjs
		const css = ".QOJ55W_dialog{gap:0;width:min(960px,100vw - 48px);height:min(760px,100vh - 48px);min-height:0;padding:0}.QOJ55W_content{flex:1;min-height:0}.QOJ55W_content>div:last-child{flex:1;min-height:0;margin-top:0;padding:0;display:flex}.QOJ55W_content>div:last-child>main{flex:1;min-height:0}@media (width<=720px){.QOJ55W_dialog{width:calc(100vw - 24px);height:calc(100vh - 24px)}}";
		const tagId = "@aicloud360/dsh-client-ui-cloud-disk/CloudDiskOverlay.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@aicloud360/dsh-client-ui-cloud-disk";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var CloudDiskOverlay_module_css_default = {
			"content": "QOJ55W_content",
			"dialog": "QOJ55W_dialog"
		};
		//#endregion
		//#region lib/types/client/CloudDiskOverlay.js
		/** CloudDisk modal workspace for runtimes without first-level page slots. */
		function CloudDiskOverlay({ api, t, useStore, actions, useSessions }) {
			const open = useStore((state) => state.open);
			const currentSession = useSessions((state) => state.current);
			const openedFor = (0, react.useRef)(void 0);
			const capturedOpeningSession = (0, react.useRef)(false);
			(0, react.useEffect)(() => {
				if (!open) {
					capturedOpeningSession.current = false;
					return;
				}
				if (!capturedOpeningSession.current) {
					openedFor.current = currentSession;
					capturedOpeningSession.current = true;
					return;
				}
				if (openedFor.current !== currentSession) actions.close();
			}, [
				actions,
				currentSession,
				open
			]);
			if (!open) return null;
			return (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
				open: true,
				onClose: actions.close,
				title: t("title"),
				closeLabel: t("cancel"),
				className: CloudDiskOverlay_module_css_default.dialog ?? "",
				contentClassName: CloudDiskOverlay_module_css_default.content ?? "",
				children: (0, react_jsx_runtime.jsx)(CloudDiskPage, {
					api,
					t,
					inDialog: true
				})
			});
		}
		//#endregion
		//#region lib/types/client/locales.js
		/** Chinese strings for the CloudDisk client namespace. */
		const zh = {
			nav: "云盘",
			title: "360 AI 云盘",
			refresh: "刷新",
			next: "加载更多",
			loading: "正在读取云盘…",
			connecting: "正在验证…",
			empty: "此处暂无内容",
			unavailable: "云盘暂不可用",
			unavailableConfiguration: "云盘尚未完成主机配置",
			unavailableCredential: "云盘认证信息缺失",
			unavailableAuthentication: "云盘凭据验证失败",
			unavailableNetwork: "无法连接云盘服务",
			unavailableProvider: "云盘配置了多个可用服务",
			unavailableService: "云盘服务暂时不可用",
			credentialsUnavailable: "无法读取云盘凭据状态",
			setupTitle: "连接 360 云盘",
			setupDescription: "请输入您自己拥有的 API Key。签名材料由本机 Host 配置提供。",
			apiKey: "API Key",
			apiKeyRequired: "请输入 API Key",
			configured: "已配置；留空则保持不变",
			connect: "保存并验证",
			disconnect: "断开连接",
			disconnectTitle: "确认断开连接",
			disconnectWarning: "断开连接会删除本机保存的 API Key，不会删除云盘文件、会话或 Preset。",
			confirmDisconnect: "确认断开",
			cancel: "取消",
			retry: "重试",
			directory: "目录",
			file: "文件",
			root: "根目录",
			path: "当前路径",
			back: "返回上一级",
			user: "当前用户"
		};
		/** English strings for the CloudDisk client namespace. */
		const en = {
			nav: "Cloud Disk",
			title: "360 AI Cloud Disk",
			refresh: "Refresh",
			next: "Load more",
			loading: "Loading cloud disk…",
			connecting: "Verifying…",
			empty: "Nothing here yet",
			unavailable: "Cloud disk unavailable",
			unavailableConfiguration: "Cloud disk Host configuration is incomplete",
			unavailableCredential: "Cloud disk authentication details are missing",
			unavailableAuthentication: "Cloud disk credential verification failed",
			unavailableNetwork: "Unable to reach the cloud disk service",
			unavailableProvider: "Multiple cloud disk providers are configured",
			unavailableService: "Cloud disk service is temporarily unavailable",
			credentialsUnavailable: "Unable to read cloud disk credential status",
			setupTitle: "Connect 360 Cloud Disk",
			setupDescription: "Enter an API key that you own. The local Host configuration provides signing material.",
			apiKey: "API Key",
			apiKeyRequired: "Enter an API key",
			configured: "Configured; leave blank to keep it",
			connect: "Save and verify",
			disconnect: "Disconnect",
			disconnectTitle: "Confirm disconnect",
			disconnectWarning: "Disconnecting removes the locally stored API key. It does not delete cloud files, sessions, or presets.",
			confirmDisconnect: "Confirm disconnect",
			cancel: "Cancel",
			retry: "Retry",
			directory: "Folder",
			file: "File",
			root: "Root",
			path: "Current path",
			back: "Go up",
			user: "Current user"
		};
		//#endregion
		//#region lib/types/client/workspace-store.js
		/**
		* Create the root-scoped legacy workspace store.
		* @returns the shared visibility handle used by the footer action and overlay.
		*/
		function createCloudDiskWorkspaceStore() {
			return (0, _deepseek_ai_dsh_client_runtime_client.defineStore)({
				init: () => ({ open: false }),
				actions: {
					open: (draft) => {
						draft.open = true;
					},
					close: (draft) => {
						draft.open = false;
					}
				}
			});
		}
		//#endregion
		//#region lib/types/client/index.js
		const inject = [
			"slots",
			"layout",
			"connection",
			"locale"
		];
		const NS = "cloudDisk";
		const PAGE_ID = "cloud-disk";
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-cloud-disk: dictionaries");
			const hostConnection = () => {
				const connection = ctx.get("connection");
				if (connection === void 0) throw new Error("Host connection unavailable");
				return connection;
			};
			const injected = () => ({ api: createCloudDiskApi(hostConnection()) });
			const modern = () => ctx.slots.spec("sidebar.primary.action") !== void 0 && ctx.slots.spec("main.page") !== void 0;
			const mountModern = () => {
				const nav = ctx.slots.inject("sidebar.primary.action", () => ctx.slots.register({
					name: "sidebar.primary.action",
					id: PAGE_ID,
					order: 23,
					locale: NS,
					inject: () => ({
						pageId: PAGE_ID,
						open: () => {
							ctx.layout.openPrimaryPage(PAGE_ID);
						}
					})
				}, CloudDiskNavItem));
				const page = ctx.slots.inject("main.page", () => [ctx.slots.register({
					name: "main.page",
					key: PAGE_ID,
					locale: NS,
					inject: injected
				}, CloudDiskPage), () => {
					ctx.layout.closePrimaryPage(PAGE_ID);
				}]);
				return () => {
					page();
					nav();
				};
			};
			const mountLegacy = () => {
				const workspace = createCloudDiskWorkspaceStore();
				const footer = ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
					name: "sidebar.footer.action",
					id: PAGE_ID,
					order: 23,
					locale: NS,
					store: workspace,
					inject: (actions) => ({ open: () => {
						actions.open();
					} })
				}, CloudDiskFooterItem));
				const overlay = ctx.slots.inject("shell.overlay", () => ctx.slots.register({
					name: "shell.overlay",
					id: PAGE_ID,
					order: 23,
					locale: NS,
					store: workspace,
					inject: injected
				}, CloudDiskOverlay));
				return () => {
					overlay();
					footer();
				};
			};
			ctx.effect(() => {
				let mode;
				let dispose = () => {};
				const reconcile = () => {
					const next = modern() ? "modern" : "legacy";
					if (next === mode) return;
					dispose();
					mode = next;
					dispose = next === "modern" ? mountModern() : mountLegacy();
				};
				const offPrimary = ctx.slots.subscribe("sidebar.primary.action", reconcile);
				const offPage = ctx.slots.subscribe("main.page", reconcile);
				reconcile();
				return () => {
					offPage();
					offPrimary();
					dispose();
				};
			}, "ui-cloud-disk: runtime adapter");
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map