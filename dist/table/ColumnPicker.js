import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
/** "⚙ Columns" popover — show/hide + reorder. Ported from rbe-cw/rbe-esign (identical in both). */
export function ColumnPicker({ columns, hidden, onToggle, onMove, onReset, isCustomized, compact }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        if (!open)
            return;
        function onDoc(e) {
            if (ref.current && !ref.current.contains(e.target))
                setOpen(false);
        }
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, [open]);
    const items = columns.filter((c) => !c.alwaysVisible);
    const hiddenCount = items.filter((c) => hidden.has(c.key)).length;
    return (_jsxs("div", { ref: ref, style: { position: 'relative', display: 'inline-block' }, children: [compact ? (_jsx("button", { type: "button", onClick: () => setOpen((o) => !o), title: "Choose which columns to show and their order", style: {
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 32, height: 32, padding: 0, lineHeight: 1, flexShrink: 0,
                    background: isCustomized ? '#eff6ff' : '#fff', color: isCustomized ? '#2563eb' : '#64748b',
                    border: `1px solid ${isCustomized ? '#bfdbfe' : '#cbd5e1'}`, borderRadius: 8,
                    fontSize: 14, cursor: 'pointer',
                }, children: "\u2699" })) : (_jsxs("button", { type: "button", onClick: () => setOpen((o) => !o), title: "Choose which columns to show and their order", style: {
                    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                    background: isCustomized ? '#eff6ff' : '#fff', color: '#334155',
                    border: `1px solid ${isCustomized ? '#bfdbfe' : '#cbd5e1'}`, borderRadius: 8,
                    fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap',
                }, children: ["\u2699 Columns", hiddenCount > 0 ? ` (${items.length - hiddenCount}/${items.length})` : ''] })), open && (_jsxs("div", { style: {
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 50,
                    width: 260, maxWidth: '90vw', background: '#fff', border: '1px solid #e2e8f0',
                    borderRadius: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.15)', padding: 8,
                }, children: [_jsx("div", { style: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: '#64748b', padding: '4px 8px 8px' }, children: "Columns" }), _jsx("div", { style: { maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }, children: items.map((c, idx) => (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 6, fontSize: 13 }, children: [_jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: 8, flex: 1, cursor: 'pointer', minWidth: 0 }, children: [_jsx("input", { type: "checkbox", checked: !hidden.has(c.key), onChange: () => onToggle(c.key) }), _jsx("span", { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, children: c.label })] }), _jsx("button", { type: "button", title: "Move up", disabled: idx === 0, onClick: () => onMove(c.key, -1), style: arrowStyle(idx === 0), children: "\u25B2" }), _jsx("button", { type: "button", title: "Move down", disabled: idx === items.length - 1, onClick: () => onMove(c.key, 1), style: arrowStyle(idx === items.length - 1), children: "\u25BC" })] }, c.key))) }), _jsxs("div", { style: { borderTop: '1px solid #f1f5f9', marginTop: 6, paddingTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("button", { type: "button", onClick: onReset, style: { background: 'none', border: 'none', color: '#2563eb', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }, children: "Reset to default" }), _jsx("button", { type: "button", onClick: () => setOpen(false), style: { background: 'none', border: 'none', color: '#64748b', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }, children: "Done" })] })] }))] }));
}
function arrowStyle(disabled) {
    return {
        width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid #e2e8f0', borderRadius: 5, background: '#fff', fontSize: 9,
        color: disabled ? '#cbd5e1' : '#475569', cursor: disabled ? 'not-allowed' : 'pointer', padding: 0,
    };
}
