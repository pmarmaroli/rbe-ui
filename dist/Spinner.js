import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ensureStyles } from './styles';
/**
 * Rail Baltica branded loading animation: navy→gold arc with a Material-style
 * indeterminate sweep and a gently breathing label. Styles self-inject, so no
 * CSS import is required in the consuming app.
 */
export function Spinner({ label = 'Loading' }) {
    ensureStyles();
    return (_jsxs("div", { className: "rbe-loader-wrap", role: "status", "aria-live": "polite", "aria-label": label, children: [_jsxs("svg", { className: "rbe-loader-svg", viewBox: "0 0 50 50", "aria-hidden": "true", children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "rbeLoaderGrad", x1: "0", y1: "0", x2: "1", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: "#0d47a1" }), _jsx("stop", { offset: "80%", stopColor: "#0d47a1" }), _jsx("stop", { offset: "100%", stopColor: "#fbc02d" })] }) }), _jsx("circle", { className: "rbe-track", cx: "25", cy: "25", r: "20", fill: "none", strokeWidth: "4" }), _jsx("circle", { className: "rbe-arc", cx: "25", cy: "25", r: "20", fill: "none", strokeWidth: "4" })] }), _jsxs("div", { className: "rbe-loader-label", children: [label, _jsx("span", { className: "rbe-dot", children: "." }), _jsx("span", { className: "rbe-dot", children: "." }), _jsx("span", { className: "rbe-dot", children: "." })] })] }));
}
