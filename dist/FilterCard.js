import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ensureFilterCardStyles } from './filterCardStyles';
function cx(...parts) {
    return parts.filter(Boolean).join(' ');
}
/** Bordered card wrapper for a row of filter controls, sitting above a list/table. */
export function FilterCard({ children, className }) {
    ensureFilterCardStyles();
    return _jsx("div", { className: cx('rbe-filter-card', className), children: children });
}
/** Flex-wrap row aligning several <FilterGroup>s, meant to live inside a <FilterCard>. */
export function FilterGroups({ children, className }) {
    ensureFilterCardStyles();
    return _jsx("div", { className: cx('rbe-filter-groups', className), children: children });
}
/** A single labeled filter control: small uppercase label above, the control below. */
export function FilterGroup({ label, children, className }) {
    ensureFilterCardStyles();
    return (_jsxs("div", { className: cx('rbe-filter-group', className), children: [_jsx("div", { className: "rbe-filter-group-label", children: label }), children] }));
}
/** Pill-group toggle (e.g. "Project / Zone / All projects", "Month / Year"). */
export function SegmentedToggle({ options, value, onChange, className }) {
    ensureFilterCardStyles();
    return (_jsx("div", { className: cx('rbe-segmented-toggle', className), children: options.map((o) => (_jsx("button", { type: "button", className: cx('rbe-segmented-toggle-btn', value === o.value && 'rbe-segmented-toggle-btn--active'), onClick: () => onChange(o.value), children: o.label }, o.value))) }));
}
