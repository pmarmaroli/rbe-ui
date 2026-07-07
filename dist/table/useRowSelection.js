import { useState, useMemo } from 'react';
/**
 * Row selection over the full filtered+sorted set (not just the current page),
 * so "select all" + a bulk action behaves correctly across pagination — the
 * intended use case (e.g. bulk-approve) generally wants "all matching rows",
 * not "all rows currently rendered on screen".
 */
export function useRowSelection(rows, rowId) {
    const [selected, setSelected] = useState(new Set());
    function toggle(id) {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id))
                next.delete(id);
            else
                next.add(id);
            return next;
        });
    }
    function toggleAll() {
        setSelected((prev) => {
            const allIds = rows.map(rowId);
            const allSelected = allIds.length > 0 && allIds.every((id) => prev.has(id));
            return allSelected ? new Set() : new Set(allIds);
        });
    }
    function clear() {
        setSelected(new Set());
    }
    const isAllSelected = rows.length > 0 && rows.every((r) => selected.has(rowId(r)));
    const isIndeterminate = !isAllSelected && rows.some((r) => selected.has(rowId(r)));
    const selectedRows = useMemo(() => rows.filter((r) => selected.has(rowId(r))), [rows, selected, rowId]);
    return { selected, toggle, toggleAll, clear, isAllSelected, isIndeterminate, selectedRows };
}
