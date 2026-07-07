import type { TableProps } from './table/types';
export type { TableColumn, TableProps } from './table/types';
export { ColumnPicker } from './table/ColumnPicker';
export { NumberRangeFilter } from './table/NumberRangeFilter';
export { downloadCsv, buildCsvRows } from './table/csv';
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
export declare function Table<T>(props: TableProps<T>): import("react").JSX.Element;
