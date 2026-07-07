import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useColumnSettings } from './table/useColumnSettings';
import { useSort } from './table/useSort';
import { usePagination } from './table/usePagination';
import { useRowSelection } from './table/useRowSelection';
import { ColumnPicker } from './table/ColumnPicker';
import { downloadCsv, buildCsvRows } from './table/csv';
import { ensureTableStyles } from './table/tableStyles';
import { BlinkButton } from './BlinkButton';
export { ColumnPicker } from './table/ColumnPicker';
export { NumberRangeFilter } from './table/NumberRangeFilter';
export { downloadCsv, buildCsvRows } from './table/csv';
function cx(...parts) {
    return parts.filter(Boolean).join(' ');
}
/**
 * Shared data table: sorting, per-column filter row (predicate stays page-side),
 * client-side pagination, column show/hide/reorder/resize (persisted), sticky
 * header + leading columns, row selection + bulk actions, CSV export, a
 * CSS-only stacked mobile layout, and baseline accessibility (aria-sort,
 * keyboard-activatable sort headers, aria-label on selection checkboxes).
 *
 * Column contract (`TableColumn<T>`) and the column-prefs hook independently
 * converged in rbe-cw and rbe-esign before this component existed — this is
 * that shape, consolidated.
 */
export function Table(props) {
    const { tableId, storageKey, columns, rows, hasAnyRows, rowId, onRowClick, selectedRowId, rowClassName, onVisibleRowsChange, defaultSort, pageSizeOptions = [25, 50, 100], defaultPageSize = 25, stickyHeader = true, stickyColumns = 0, selectable, rowAriaLabel, bulkActions, filterRowExtra, onApplyFilters, filtersDirty, csvFilename, loading, emptyState, noMatchState, actionsColumn, className, } = props;
    ensureTableStyles();
    const colset = useColumnSettings(tableId, columns, storageKey);
    const { sortKey, dir, toggleSort, setSort, sorted } = useSort(columns, rows, defaultSort);
    const selection = useRowSelection(sorted, rowId);
    const pagination = usePagination(sorted, pageSizeOptions, defaultPageSize);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    // Fire only when the actual row order/identity changes, not on every render —
    // callers commonly rebuild their `rows` array inline every render (unmemoized
    // filter/map chains), which would otherwise make pagination.pageRows a new
    // reference every time and turn this into an infinite render loop the moment
    // a consumer's onVisibleRowsChange touches its own state.
    const lastVisibleSignature = useRef(null);
    useEffect(() => {
        const signature = pagination.pageRows.map(rowId).join(',');
        if (signature === lastVisibleSignature.current)
            return;
        lastVisibleSignature.current = signature;
        onVisibleRowsChange?.(pagination.pageRows);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.pageRows]);
    // --- Column resize: Pointer Events (mouse + touch/pen) with pointer capture,
    // so the drag keeps tracking even if the pointer leaves the 8px handle. ---
    const headRowRef = useRef(null);
    function startResize(e, colKey, minWidth) {
        e.preventDefault();
        e.stopPropagation();
        const handle = e.currentTarget;
        const th = handle.closest('th');
        const headRow = headRowRef.current;
        if (!th || !headRow)
            return;
        if (Object.keys(colset.widths).length === 0) {
            const seed = {};
            const offset = selectable ? 1 : 0;
            colset.visibleColumns.forEach((c, i) => {
                const cell = headRow.children[i + offset];
                if (cell)
                    seed[c.key] = cell.offsetWidth;
            });
            colset.seedWidths(seed);
        }
        const startX = e.clientX;
        const startW = th.offsetWidth;
        handle.setPointerCapture(e.pointerId);
        function onMove(ev) {
            colset.setWidth(colKey, Math.max(minWidth, startW + (ev.clientX - startX)));
        }
        function onUp(ev) {
            handle.releasePointerCapture(ev.pointerId);
            handle.removeEventListener('pointermove', onMove);
            handle.removeEventListener('pointerup', onUp);
        }
        handle.addEventListener('pointermove', onMove);
        handle.addEventListener('pointerup', onUp);
    }
    const hasWidths = Object.keys(colset.widths).length > 0;
    // --- Sticky leading columns: measure rendered widths so N>1 sticky columns
    // (or a selection checkbox column) get correct cumulative left offsets. ---
    const stickyCount = (selectable ? 1 : 0) + Math.max(0, Math.min(stickyColumns, colset.visibleColumns.length));
    const stickyRefs = useRef([]);
    const [stickyLefts, setStickyLefts] = useState([]);
    useLayoutEffect(() => {
        const lefts = [];
        if (stickyCount > 0) {
            let acc = 0;
            for (let i = 0; i < stickyCount; i++) {
                lefts.push(acc);
                acc += stickyRefs.current[i]?.offsetWidth ?? 0;
            }
        }
        // Compare by value, not by the effect having re-run — `colset.visibleColumns`
        // gets a new array reference on every render whenever the caller's `columns`
        // prop is (as is typical) an unmemoized inline array, which would otherwise
        // make this effect call setStickyLefts every render and loop forever.
        setStickyLefts((prev) => (prev.length === lefts.length && prev.every((v, i) => v === lefts[i]) ? prev : lefts));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stickyCount, colset.visibleColumns, colset.widths]);
    function isSticky(dataColIndex) {
        return dataColIndex < stickyColumns && dataColIndex < colset.visibleColumns.length;
    }
    function stickyIndex(dataColIndex) {
        return (selectable ? 1 : 0) + dataColIndex;
    }
    function stickyStyle(overallIndex) {
        return { left: stickyLefts[overallIndex] ?? 0 };
    }
    const trailingColSpan = 1;
    const totalColSpan = (selectable ? 1 : 0) + colset.visibleColumns.length + trailingColSpan;
    function handleExport() {
        if (!csvFilename)
            return;
        downloadCsv(csvFilename, colset.visibleColumns.map((c) => c.label), buildCsvRows(colset.visibleColumns, sorted));
    }
    const sortableColumns = columns.filter((c) => c.sortKey);
    const filterableColumns = colset.visibleColumns.filter((c) => c.filterCell);
    const isEmpty = sorted.length === 0;
    const showEmptyState = isEmpty && hasAnyRows === false;
    const showNoMatch = isEmpty && !showEmptyState;
    const showSkeleton = !!loading && sorted.length === 0;
    return (_jsxs("div", { className: cx('rbe-table-wrap', className), children: [_jsxs("div", { className: "rbe-table-toolbar", children: [_jsx(ColumnPicker, { compact: true, columns: colset.orderedColumns, hidden: colset.hidden, onToggle: colset.toggle, onMove: colset.move, onReset: colset.reset, isCustomized: colset.isCustomized }), onApplyFilters && (_jsx(BlinkButton, { type: "button", className: cx('rbe-table-btn', 'rbe-table-btn--primary'), blinking: filtersDirty, onClick: onApplyFilters, children: "Search" })), csvFilename && (_jsx("button", { type: "button", className: "rbe-table-btn", onClick: handleExport, children: "\u2913 Export CSV" }))] }), selectable && selection.selectedRows.length > 0 && bulkActions && (_jsxs("div", { className: "rbe-table-bulk-toolbar", children: [_jsxs("span", { children: [selection.selectedRows.length, " selected"] }), bulkActions(selection.selectedRows, selection.clear), _jsx("button", { type: "button", className: "rbe-table-btn", onClick: selection.clear, children: "Clear selection" })] })), sortableColumns.length > 0 && (_jsxs("select", { className: "rbe-table-mobile-sort", "aria-label": "Sort by", value: sortKey ? `${sortKey}:${dir}` : '', onChange: (e) => {
                    const [k, d] = e.target.value.split(':');
                    if (k)
                        setSort(k, d);
                }, children: [_jsx("option", { value: "", children: "Sort by\u2026" }), sortableColumns.map((c) => (_jsxs("optgroup", { label: c.label, children: [_jsxs("option", { value: `${c.sortKey}:asc`, children: [c.label, " (A\u2013Z / low\u2013high)"] }), _jsxs("option", { value: `${c.sortKey}:desc`, children: [c.label, " (Z\u2013A / high\u2013low)"] })] }, c.key)))] })), filterableColumns.length > 0 && (_jsx("button", { type: "button", className: "rbe-table-btn rbe-table-mobile-filters-toggle", onClick: () => setMobileFiltersOpen((o) => !o), children: mobileFiltersOpen ? 'Hide filters' : 'Filters' })), mobileFiltersOpen && (_jsxs("div", { className: "rbe-table-mobile-filters", children: [filterableColumns.map((c) => (_jsxs("div", { className: "rbe-table-mobile-filter-item", children: [_jsx("label", { children: c.label }), c.filterCell()] }, c.key))), filterRowExtra] })), _jsxs("table", { className: cx('rbe-table', hasWidths && 'rbe-table--fixed', stickyHeader && 'rbe-table--sticky-header'), children: [_jsxs("colgroup", { children: [selectable && _jsx("col", { style: { width: 36 } }), colset.visibleColumns.map((col) => (_jsx("col", { style: { width: colset.widths[col.key] ? colset.widths[col.key] + 'px' : undefined } }, col.key))), _jsx("col", {})] }), _jsxs("thead", { children: [_jsxs("tr", { ref: headRowRef, children: [selectable && (_jsx("th", { ref: (el) => { stickyRefs.current[0] = el; }, className: cx('rbe-table-checkbox-cell', stickyColumns > 0 && 'rbe-table-sticky-th'), style: stickyColumns > 0 ? stickyStyle(0) : undefined, children: _jsx("input", { type: "checkbox", className: "rbe-table-checkbox", checked: selection.isAllSelected, ref: (el) => { if (el)
                                                el.indeterminate = selection.isIndeterminate; }, onChange: selection.toggleAll, "aria-label": `Select all ${sorted.length} rows` }) })), colset.visibleColumns.map((col, i) => {
                                        const sticky = isSticky(i);
                                        const sIdx = stickyIndex(i);
                                        const active = !!col.sortKey && sortKey === col.sortKey;
                                        return (_jsxs("th", { scope: "col", ref: sticky ? (el) => { stickyRefs.current[sIdx] = el; } : undefined, className: cx(col.numeric && 'rbe-table-num', sticky && 'rbe-table-sticky-th'), style: sticky ? stickyStyle(sIdx) : undefined, "aria-sort": active ? (dir === 'asc' ? 'ascending' : 'descending') : undefined, children: [col.sortKey ? (_jsxs("button", { type: "button", className: "rbe-table-sort-btn", onClick: () => toggleSort(col.sortKey), children: [col.label, active && _jsx("span", { className: "rbe-table-sort-arrow", children: dir === 'asc' ? '▲' : '▼' })] })) : col.label, _jsx("span", { className: "rbe-table-resizer", onPointerDown: (e) => startResize(e, col.key, col.minWidth ?? 60), onClick: (e) => e.stopPropagation() })] }, col.key));
                                    }), _jsx("th", {})] }), _jsxs("tr", { className: "rbe-table-filter-row", children: [selectable && _jsx("th", {}), colset.visibleColumns.map((col, i) => {
                                        const sticky = isSticky(i);
                                        return (_jsx("th", { className: sticky ? 'rbe-table-sticky-th' : undefined, style: sticky ? stickyStyle(stickyIndex(i)) : undefined, children: col.filterCell ? col.filterCell() : null }, col.key));
                                    }), _jsx("th", { children: filterRowExtra })] })] }), _jsx("tbody", { children: showSkeleton ? (Array.from({ length: 5 }).map((_, r) => (_jsx("tr", { children: Array.from({ length: totalColSpan }).map((_, c) => (_jsx("td", { children: _jsx("div", { className: "rbe-table-skeleton-cell" }) }, c))) }, r)))) : showEmptyState ? (_jsx("tr", { children: _jsx("td", { colSpan: totalColSpan, className: "rbe-table-empty", children: emptyState ?? 'No data yet.' }) })) : showNoMatch ? (_jsx("tr", { children: _jsx("td", { colSpan: totalColSpan, className: "rbe-table-empty", children: noMatchState ?? 'No rows match the current filters.' }) })) : (pagination.pageRows.map((row) => {
                            const id = rowId(row);
                            const isSelected = selectedRowId === id;
                            return (_jsxs("tr", { "data-rowid": id, className: cx(rowClassName?.(row), onRowClick && 'rbe-table-row--clickable', isSelected && 'rbe-table-row--selected'), onClick: onRowClick ? () => onRowClick(row) : undefined, children: [selectable && (_jsx("td", { className: "rbe-table-checkbox-cell", onClick: (e) => e.stopPropagation(), children: _jsx("input", { type: "checkbox", className: "rbe-table-checkbox", checked: selection.selected.has(id), onChange: () => selection.toggle(id), "aria-label": rowAriaLabel ? rowAriaLabel(row) : `Select row ${id}` }) })), colset.visibleColumns.map((col, i) => {
                                        const sticky = isSticky(i);
                                        return (_jsx("td", { "data-label": col.label, className: cx(col.numeric && 'rbe-table-num', col.cellClassName, sticky && 'rbe-table-sticky-td'), style: sticky ? stickyStyle(stickyIndex(i)) : undefined, children: col.render(row) }, col.key));
                                    }), _jsx("td", { onClick: (e) => e.stopPropagation(), children: actionsColumn ? actionsColumn(row) : null })] }, id));
                        })) })] }), !isEmpty && (_jsxs("div", { className: "rbe-table-footer", children: [_jsxs("span", { children: [(pagination.page - 1) * pagination.pageSize + 1, '–', Math.min(pagination.page * pagination.pageSize, sorted.length), " of ", sorted.length] }), _jsxs("div", { className: "rbe-table-footer-right", children: [_jsx("select", { className: "rbe-table-page-size-select", value: pagination.pageSize, onChange: (e) => pagination.setPageSize(Number(e.target.value)), "aria-label": "Rows per page", children: pagination.pageSizeOptions.map((n) => _jsxs("option", { value: n, children: [n, " / page"] }, n)) }), _jsx("button", { type: "button", className: "rbe-table-page-btn", disabled: pagination.page <= 1, onClick: () => pagination.setPage(pagination.page - 1), children: "\u2039 Prev" }), _jsxs("span", { children: ["Page ", pagination.page, " / ", pagination.pageCount] }), _jsx("button", { type: "button", className: "rbe-table-page-btn", disabled: pagination.page >= pagination.pageCount, onClick: () => pagination.setPage(pagination.page + 1), children: "Next \u203A" })] })] }))] }));
}
