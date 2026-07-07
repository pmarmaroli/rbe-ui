import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import type { PointerEvent as ReactPointerEvent, CSSProperties } from 'react';
import type { TableProps } from './table/types';
import { useColumnSettings } from './table/useColumnSettings';
import { useSort } from './table/useSort';
import { usePagination } from './table/usePagination';
import { useRowSelection } from './table/useRowSelection';
import { ColumnPicker } from './table/ColumnPicker';
import { downloadCsv, buildCsvRows } from './table/csv';
import { ensureTableStyles } from './table/tableStyles';
import { BlinkButton } from './BlinkButton';

export type { TableColumn, TableProps } from './table/types';
export { ColumnPicker } from './table/ColumnPicker';
export { NumberRangeFilter } from './table/NumberRangeFilter';
export { downloadCsv, buildCsvRows } from './table/csv';

function cx(...parts: Array<string | false | undefined>): string {
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
export function Table<T>(props: TableProps<T>) {
  const {
    tableId, storageKey, columns, rows, hasAnyRows, rowId, onRowClick, selectedRowId, rowClassName, onVisibleRowsChange,
    defaultSort, pageSizeOptions = [25, 50, 100], defaultPageSize = 25,
    stickyHeader = true, stickyColumns = 0,
    selectable, rowAriaLabel, bulkActions,
    filterRowExtra, onApplyFilters, filtersDirty, csvFilename,
    loading, emptyState, noMatchState, actionsColumn, className,
  } = props;

  ensureTableStyles();

  const colset = useColumnSettings(tableId, columns, storageKey);

  // "Me only" — the one universal, business-agnostic filter every identity
  // column needs, so Table owns applying it (unlike other filterCell
  // predicates, which stay page-side).
  const [meOnlyColumns, setMeOnlyColumns] = useState<Set<string>>(new Set());
  function toggleMeOnly(key: string) {
    setMeOnlyColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }
  const meFiltered = meOnlyColumns.size === 0 ? rows : rows.filter((row) => {
    for (const col of columns) {
      if (col.isMine && meOnlyColumns.has(col.key) && !col.isMine(row)) return false;
    }
    return true;
  });

  const { sortKey, dir, toggleSort, setSort, sorted } = useSort(columns, meFiltered, defaultSort);
  const selection = useRowSelection(sorted, rowId);
  const pagination = usePagination(sorted, pageSizeOptions, defaultPageSize);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fire only when the actual row order/identity changes, not on every render —
  // callers commonly rebuild their `rows` array inline every render (unmemoized
  // filter/map chains), which would otherwise make pagination.pageRows a new
  // reference every time and turn this into an infinite render loop the moment
  // a consumer's onVisibleRowsChange touches its own state.
  const lastVisibleSignature = useRef<string | null>(null);
  useEffect(() => {
    const signature = pagination.pageRows.map(rowId).join(',');
    if (signature === lastVisibleSignature.current) return;
    lastVisibleSignature.current = signature;
    onVisibleRowsChange?.(pagination.pageRows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageRows]);

  // --- Column resize: Pointer Events (mouse + touch/pen) with pointer capture,
  // so the drag keeps tracking even if the pointer leaves the 8px handle. ---
  const headRowRef = useRef<HTMLTableRowElement>(null);
  function startResize(e: ReactPointerEvent<HTMLSpanElement>, colKey: string, minWidth: number) {
    e.preventDefault();
    e.stopPropagation();
    const handle = e.currentTarget;
    const th = handle.closest('th') as HTMLElement | null;
    const headRow = headRowRef.current;
    if (!th || !headRow) return;
    if (Object.keys(colset.widths).length === 0) {
      const seed: Record<string, number> = {};
      const offset = selectable ? 1 : 0;
      colset.visibleColumns.forEach((c, i) => {
        const cell = headRow.children[i + offset] as HTMLElement | undefined;
        if (cell) seed[c.key] = cell.offsetWidth;
      });
      colset.seedWidths(seed);
    }
    const startX = e.clientX;
    const startW = th.offsetWidth;
    handle.setPointerCapture(e.pointerId);
    function onMove(ev: PointerEvent) {
      colset.setWidth(colKey, Math.max(minWidth, startW + (ev.clientX - startX)));
    }
    function onUp(ev: PointerEvent) {
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
  const stickyRefs = useRef<Array<HTMLElement | null>>([]);
  const [stickyLefts, setStickyLefts] = useState<number[]>([]);

  useLayoutEffect(() => {
    const lefts: number[] = [];
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

  function isSticky(dataColIndex: number): boolean {
    return dataColIndex < stickyColumns && dataColIndex < colset.visibleColumns.length;
  }
  function stickyIndex(dataColIndex: number): number {
    return (selectable ? 1 : 0) + dataColIndex;
  }
  function stickyStyle(overallIndex: number): CSSProperties {
    return { left: stickyLefts[overallIndex] ?? 0 };
  }

  const trailingColSpan = 1;
  const totalColSpan = (selectable ? 1 : 0) + colset.visibleColumns.length + trailingColSpan;

  function handleExport() {
    if (!csvFilename) return;
    downloadCsv(csvFilename, colset.visibleColumns.map((c) => c.label), buildCsvRows(colset.visibleColumns, sorted));
  }

  const sortableColumns = columns.filter((c) => c.sortKey);
  const filterableColumns = colset.visibleColumns.filter((c) => c.filterCell || c.isMine);

  const isEmpty = sorted.length === 0;
  const showEmptyState = isEmpty && hasAnyRows === false;
  const showNoMatch = isEmpty && !showEmptyState;

  const showSkeleton = !!loading && sorted.length === 0;

  return (
    <div className={cx('rbe-table-wrap', className)}>
      <div className="rbe-table-toolbar">
        <div className="rbe-table-toolbar-left">
          <ColumnPicker
            compact
            columns={colset.orderedColumns}
            hidden={colset.hidden}
            onToggle={colset.toggle}
            onMove={colset.move}
            onReset={colset.reset}
            isCustomized={colset.isCustomized}
          />
          {csvFilename && (
            <button type="button" className="rbe-table-btn" onClick={handleExport}>⤓ Export CSV</button>
          )}
        </div>
        {onApplyFilters && (
          <BlinkButton
            type="button"
            className="rbe-table-btn rbe-table-toolbar-center"
            blinking={filtersDirty}
            onClick={onApplyFilters}
          >
            Search
          </BlinkButton>
        )}
        <div />
      </div>

      {selectable && selection.selectedRows.length > 0 && bulkActions && (
        <div className="rbe-table-bulk-toolbar">
          <span>{selection.selectedRows.length} selected</span>
          {bulkActions(selection.selectedRows, selection.clear)}
          <button type="button" className="rbe-table-btn" onClick={selection.clear}>Clear selection</button>
        </div>
      )}

      {sortableColumns.length > 0 && (
        <select
          className="rbe-table-mobile-sort"
          aria-label="Sort by"
          value={sortKey ? `${sortKey}:${dir}` : ''}
          onChange={(e) => {
            const [k, d] = e.target.value.split(':');
            if (k) setSort(k, d as 'asc' | 'desc');
          }}
        >
          <option value="">Sort by…</option>
          {sortableColumns.map((c) => (
            <optgroup key={c.key} label={c.label}>
              <option value={`${c.sortKey}:asc`}>{c.label} (A–Z / low–high)</option>
              <option value={`${c.sortKey}:desc`}>{c.label} (Z–A / high–low)</option>
            </optgroup>
          ))}
        </select>
      )}

      {filterableColumns.length > 0 && (
        <button
          type="button"
          className="rbe-table-btn rbe-table-mobile-filters-toggle"
          onClick={() => setMobileFiltersOpen((o) => !o)}
        >
          {mobileFiltersOpen ? 'Hide filters' : 'Filters'}
        </button>
      )}
      {mobileFiltersOpen && (
        <div className="rbe-table-mobile-filters">
          {filterableColumns.map((c) => (
            <div key={c.key} className="rbe-table-mobile-filter-item">
              <label>{c.label}</label>
              {c.filterCell?.()}
              {c.isMine && (
                <label className="rbe-table-me-only">
                  <input type="checkbox" checked={meOnlyColumns.has(c.key)} onChange={() => toggleMeOnly(c.key)} />
                  Me only
                </label>
              )}
            </div>
          ))}
          {filterRowExtra}
        </div>
      )}

      <table className={cx('rbe-table', hasWidths && 'rbe-table--fixed', stickyHeader && 'rbe-table--sticky-header')}>
        <colgroup>
          {selectable && <col style={{ width: 36 }} />}
          {colset.visibleColumns.map((col) => (
            <col key={col.key} style={{ width: colset.widths[col.key] ? colset.widths[col.key] + 'px' : undefined }} />
          ))}
          <col />
        </colgroup>
        <thead>
          <tr ref={headRowRef}>
            {selectable && (
              <th
                ref={(el) => { stickyRefs.current[0] = el; }}
                className={cx('rbe-table-checkbox-cell', stickyColumns > 0 && 'rbe-table-sticky-th')}
                style={stickyColumns > 0 ? stickyStyle(0) : undefined}
              >
                <input
                  type="checkbox"
                  className="rbe-table-checkbox"
                  checked={selection.isAllSelected}
                  ref={(el) => { if (el) el.indeterminate = selection.isIndeterminate; }}
                  onChange={selection.toggleAll}
                  aria-label={`Select all ${sorted.length} rows`}
                />
              </th>
            )}
            {colset.visibleColumns.map((col, i) => {
              const sticky = isSticky(i);
              const sIdx = stickyIndex(i);
              const active = !!col.sortKey && sortKey === col.sortKey;
              return (
                <th
                  key={col.key}
                  scope="col"
                  ref={sticky ? (el) => { stickyRefs.current[sIdx] = el; } : undefined}
                  className={cx(col.numeric && 'rbe-table-num', sticky && 'rbe-table-sticky-th')}
                  style={sticky ? stickyStyle(sIdx) : undefined}
                  aria-sort={active ? (dir === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  {col.sortKey ? (
                    <button type="button" className="rbe-table-sort-btn" onClick={() => toggleSort(col.sortKey!)}>
                      {col.label}
                      {active && <span className="rbe-table-sort-arrow">{dir === 'asc' ? '▲' : '▼'}</span>}
                    </button>
                  ) : col.label}
                  <span
                    className="rbe-table-resizer"
                    onPointerDown={(e) => startResize(e, col.key, col.minWidth ?? 60)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </th>
              );
            })}
            <th />
          </tr>
          <tr className="rbe-table-filter-row">
            {selectable && <th />}
            {colset.visibleColumns.map((col, i) => {
              const sticky = isSticky(i);
              return (
                <th key={col.key} className={sticky ? 'rbe-table-sticky-th' : undefined} style={sticky ? stickyStyle(stickyIndex(i)) : undefined}>
                  {col.filterCell ? col.filterCell() : null}
                  {col.isMine && (
                    <label className="rbe-table-me-only">
                      <input type="checkbox" checked={meOnlyColumns.has(col.key)} onChange={() => toggleMeOnly(col.key)} />
                      Me only
                    </label>
                  )}
                </th>
              );
            })}
            <th>{filterRowExtra}</th>
          </tr>
        </thead>
        <tbody>
          {showSkeleton ? (
            Array.from({ length: 5 }).map((_, r) => (
              <tr key={r}>
                {Array.from({ length: totalColSpan }).map((_, c) => (
                  <td key={c}><div className="rbe-table-skeleton-cell" /></td>
                ))}
              </tr>
            ))
          ) : showEmptyState ? (
            <tr><td colSpan={totalColSpan} className="rbe-table-empty">{emptyState ?? 'No data yet.'}</td></tr>
          ) : showNoMatch ? (
            <tr><td colSpan={totalColSpan} className="rbe-table-empty">{noMatchState ?? 'No rows match the current filters.'}</td></tr>
          ) : (
            pagination.pageRows.map((row) => {
              const id = rowId(row);
              const isSelected = selectedRowId === id;
              return (
                <tr
                  key={id}
                  data-rowid={id}
                  className={cx(rowClassName?.(row), onRowClick && 'rbe-table-row--clickable', isSelected && 'rbe-table-row--selected')}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {selectable && (
                    <td className="rbe-table-checkbox-cell" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="rbe-table-checkbox"
                        checked={selection.selected.has(id)}
                        onChange={() => selection.toggle(id)}
                        aria-label={rowAriaLabel ? rowAriaLabel(row) : `Select row ${id}`}
                      />
                    </td>
                  )}
                  {colset.visibleColumns.map((col, i) => {
                    const sticky = isSticky(i);
                    return (
                      <td
                        key={col.key}
                        data-label={col.label}
                        className={cx(col.numeric && 'rbe-table-num', col.cellClassName, sticky && 'rbe-table-sticky-td')}
                        style={sticky ? stickyStyle(stickyIndex(i)) : undefined}
                      >
                        {col.render(row)}
                      </td>
                    );
                  })}
                  <td onClick={(e) => e.stopPropagation()}>
                    {actionsColumn ? actionsColumn(row) : null}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {!isEmpty && (
        <div className="rbe-table-footer">
          <span>
            {(pagination.page - 1) * pagination.pageSize + 1}
            {'–'}
            {Math.min(pagination.page * pagination.pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="rbe-table-footer-right">
            <select
              className="rbe-table-page-size-select"
              value={pagination.pageSize}
              onChange={(e) => pagination.setPageSize(Number(e.target.value))}
              aria-label="Rows per page"
            >
              {pagination.pageSizeOptions.map((n) => <option key={n} value={n}>{n} / page</option>)}
            </select>
            <button type="button" className="rbe-table-page-btn" disabled={pagination.page <= 1} onClick={() => pagination.setPage(pagination.page - 1)}>‹ Prev</button>
            <span>Page {pagination.page} / {pagination.pageCount}</span>
            <button type="button" className="rbe-table-page-btn" disabled={pagination.page >= pagination.pageCount} onClick={() => pagination.setPage(pagination.page + 1)}>Next ›</button>
          </div>
        </div>
      )}
    </div>
  );
}
