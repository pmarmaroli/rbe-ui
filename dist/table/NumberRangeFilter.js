import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Presentational min/max filter cell for numeric columns. Purely UI — the page
 * still owns predicate application (compare each row's numeric value against
 * `min`/`max`), same division of responsibility as every other `filterCell`.
 */
export function NumberRangeFilter({ min, max, onChange, onEnter, className }) {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && onEnter)
            onEnter();
    };
    return (_jsxs("div", { style: { display: 'flex', gap: 4 }, children: [_jsx("input", { className: className, type: "number", inputMode: "decimal", placeholder: "Min", value: min, onChange: (e) => onChange({ min: e.target.value, max }), onKeyDown: handleKeyDown, style: { width: '50%', minWidth: 0 } }), _jsx("input", { className: className, type: "number", inputMode: "decimal", placeholder: "Max", value: max, onChange: (e) => onChange({ min, max: e.target.value }), onKeyDown: handleKeyDown, style: { width: '50%', minWidth: 0 } })] }));
}
