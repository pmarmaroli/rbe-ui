import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ensureStatCardStyles } from './statCardStyles';
function cx(...parts) {
    return parts.filter(Boolean).join(' ');
}
/** Responsive grid of <StatCard>s. */
export function StatCards({ children, className }) {
    ensureStatCardStyles();
    return _jsx("div", { className: cx('rbe-stat-cards', className), children: children });
}
/** Flat KPI card: a big number/value on top, a small uppercase label below, an optional sub-caption, and an optional icon at the bottom. */
export function StatCard({ value, label, valueColor, icon, sub, className }) {
    ensureStatCardStyles();
    return (_jsxs("div", { className: cx('rbe-stat-card', className), children: [_jsx("div", { className: "rbe-stat-card-value", style: valueColor ? { color: valueColor } : undefined, children: value }), _jsx("div", { className: "rbe-stat-card-label", children: label }), sub != null && _jsx("div", { className: "rbe-stat-card-sub", children: sub }), icon != null && _jsx("div", { className: "rbe-stat-card-icon", children: icon })] }));
}
