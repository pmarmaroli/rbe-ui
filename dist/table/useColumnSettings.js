import { useState, useEffect, useMemo } from 'react';
const VERSION = 'v1';
/**
 * Per-table column visibility + order + widths, persisted in localStorage so the
 * user's choice survives across sessions. `columns` is the full default-ordered
 * list; the hook returns the effective ordered list and the visible subset.
 *
 * Ported from rbe-cw's `useColumnSettings` (independently re-derived in rbe-esign
 * too) — `storageKey` is now an explicit param so a consuming app can keep an
 * existing key unchanged across a migration and not reset every user's prefs.
 */
export function useColumnSettings(tableId, columns, storageKey) {
    const key = storageKey ?? `rbe-ui.table.${VERSION}.${tableId}`;
    const [pref, setPref] = useState(() => {
        try {
            const raw = localStorage.getItem(key);
            if (raw) {
                const p = JSON.parse(raw);
                if (Array.isArray(p.order) && Array.isArray(p.hidden))
                    return p;
            }
        }
        catch { /* ignore corrupt storage */ }
        return { order: [], hidden: [] };
    });
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(pref));
        }
        catch { /* quota / private mode */ }
    }, [key, pref]);
    const { orderedColumns, visibleColumns } = useMemo(() => {
        const byKey = new Map(columns.map((c) => [c.key, c]));
        // Stored order first (valid keys only), then any new columns in their default order.
        const orderedKeys = [];
        for (const k of pref.order)
            if (byKey.has(k) && !orderedKeys.includes(k))
                orderedKeys.push(k);
        for (const c of columns)
            if (!orderedKeys.includes(c.key))
                orderedKeys.push(c.key);
        const hidden = new Set(pref.hidden);
        const ordered = orderedKeys.map((k) => byKey.get(k));
        const visible = ordered.filter((c) => c.alwaysVisible || !hidden.has(c.key));
        return { orderedColumns: ordered, visibleColumns: visible };
    }, [columns, pref]);
    const hiddenSet = useMemo(() => new Set(pref.hidden), [pref.hidden]);
    function toggle(key) {
        setPref((p) => {
            const hidden = new Set(p.hidden);
            if (hidden.has(key))
                hidden.delete(key);
            else
                hidden.add(key);
            return { order: orderedColumns.map((c) => c.key), hidden: [...hidden], widths: p.widths };
        });
    }
    function move(key, dir) {
        setPref((p) => {
            const arr = orderedColumns.map((c) => c.key);
            const i = arr.indexOf(key);
            const j = i + dir;
            if (i < 0 || j < 0 || j >= arr.length)
                return p;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            return { order: arr, hidden: p.hidden, widths: p.widths };
        });
    }
    function reset() {
        setPref({ order: [], hidden: [], widths: {} });
    }
    /** Set one column's pixel width (resize). */
    function setWidth(key, px) {
        setPref((p) => ({ order: p.order, hidden: p.hidden, widths: { ...(p.widths || {}), [key]: Math.round(px) } }));
    }
    /** Seed widths for all columns at once (used on the first resize so switching
     *  to fixed table layout doesn't make untouched columns jump). */
    function seedWidths(seed) {
        setPref((p) => ({ ...p, widths: { ...seed, ...(p.widths || {}) } }));
    }
    const widths = useMemo(() => pref.widths || {}, [pref.widths]);
    const isCustomized = pref.order.length > 0 || pref.hidden.length > 0 || Object.keys(widths).length > 0;
    return { orderedColumns, visibleColumns, hidden: hiddenSet, widths, toggle, move, reset, setWidth, seedWidths, isCustomized };
}
