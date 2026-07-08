import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ensureComboboxStyles } from './comboboxStyles';
function cx(...parts) {
    return parts.filter(Boolean).join(' ');
}
/**
 * A single control that both filters by typed text AND lets you just open and
 * pick, so a list of a handful of items and a list of thousands both stay
 * usable — scrolling a plain <select> with thousands of entries isn't a real
 * option, but forcing everyone to type isn't either.
 */
export function Combobox({ options, value, onChange, placeholder = 'All', allowClear = true, maxResults = 200, className, ...rest }) {
    ensureComboboxStyles();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [highlighted, setHighlighted] = useState(0);
    const [menuStyle, setMenuStyle] = useState({});
    const ref = useRef(null);
    const listRef = useRef(null);
    // The list is portaled to <body> so it escapes any overflow/clip ancestor
    // (scrolling tables, cards). Position it (fixed) under the input and keep it
    // anchored as ancestors scroll or the window resizes.
    useEffect(() => {
        if (!open)
            return;
        function reposition() {
            const el = ref.current;
            if (!el)
                return;
            const r = el.getBoundingClientRect();
            setMenuStyle({
                position: 'fixed', top: r.bottom + 4, left: r.left, right: 'auto',
                minWidth: r.width, width: 'max-content', maxWidth: 'min(480px, 90vw)', zIndex: 9999,
            });
        }
        reposition();
        function onDoc(e) {
            const t = e.target;
            if (ref.current?.contains(t) || listRef.current?.contains(t))
                return;
            setOpen(false);
            setQuery('');
        }
        document.addEventListener('mousedown', onDoc);
        window.addEventListener('scroll', reposition, true);
        window.addEventListener('resize', reposition);
        return () => {
            document.removeEventListener('mousedown', onDoc);
            window.removeEventListener('scroll', reposition, true);
            window.removeEventListener('resize', reposition);
        };
    }, [open]);
    const selected = options.find((o) => o.value === value);
    const displayValue = open ? query : (selected?.label ?? '');
    const filtered = query
        ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
        : options;
    const shown = filtered.slice(0, maxResults);
    const truncated = filtered.length > shown.length;
    // The clear/"All" option occupies index 0 of the keyboard-navigable list when present.
    const navCount = shown.length + (allowClear ? 1 : 0);
    function selectValue(v) {
        onChange(v);
        setOpen(false);
        setQuery('');
    }
    function handleKeyDown(e) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
            setHighlighted((h) => Math.min(h + 1, navCount - 1));
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlighted((h) => Math.max(h - 1, 0));
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
            if (!open)
                return;
            if (allowClear && highlighted === 0)
                selectValue('');
            else {
                const opt = shown[highlighted - (allowClear ? 1 : 0)];
                if (opt)
                    selectValue(opt.value);
            }
        }
        else if (e.key === 'Escape') {
            setOpen(false);
            setQuery('');
        }
    }
    return (_jsxs("div", { ref: ref, className: "rbe-combobox", children: [_jsx("input", { ...rest, type: "text", className: cx('rbe-combobox-input', className), value: displayValue, placeholder: placeholder, role: "combobox", "aria-expanded": open, "aria-autocomplete": "list", onFocus: () => { setOpen(true); setQuery(''); setHighlighted(0); }, onChange: (e) => { setQuery(e.target.value); setOpen(true); setHighlighted(0); }, onKeyDown: handleKeyDown }), open && createPortal(_jsxs("ul", { ref: listRef, className: "rbe-combobox-list", role: "listbox", style: menuStyle, children: [allowClear && (_jsx("li", { role: "option", "aria-selected": value === '', className: cx('rbe-combobox-option', highlighted === 0 && 'rbe-combobox-option--active'), onMouseDown: (e) => { e.preventDefault(); selectValue(''); }, children: placeholder })), shown.map((o, i) => (_jsx("li", { role: "option", "aria-selected": o.value === value, className: cx('rbe-combobox-option', i + (allowClear ? 1 : 0) === highlighted && 'rbe-combobox-option--active'), onMouseDown: (e) => { e.preventDefault(); selectValue(o.value); }, children: o.label }, o.value))), shown.length === 0 && _jsx("li", { className: "rbe-combobox-empty", children: "No matches" }), truncated && _jsxs("li", { className: "rbe-combobox-empty", children: ["+", filtered.length - shown.length, " more \u2014 keep typing to narrow it down"] })] }), document.body)] }));
}
