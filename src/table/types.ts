import type { ReactNode } from 'react';

/**
 * Descriptor for one table column. A page declares its columns once; visibility,
 * order, sorting, the filter row and CSV export all derive from this list.
 *
 * This shape converged independently in rbe-cw and rbe-esign before this shared
 * component existed — kept verbatim here, only `minWidth`/`mobilePriority` are new.
 */
export interface TableColumn<T> {
  key: string;
  label: string;
  /** Cannot be hidden or reordered out (e.g. a trailing actions column). */
  alwaysVisible?: boolean;
  /** Sort identifier — when set, the header is clickable to sort. */
  sortKey?: string;
  /** Right-align header + cells (numeric columns). */
  numeric?: boolean;
  /** Extra class on each body cell. */
  cellClassName?: string;
  /** Cell content. */
  render: (row: T) => ReactNode;
  /** Value used for CSV export (defaults to '' when omitted). */
  exportValue?: (row: T) => string | number | null | undefined;
  /** Value used when sorting on this column (defaults to exportValue). */
  sortValue?: (row: T) => string | number;
  /** Filter control rendered in the filter row for this column. Omit and use `filterOptions` instead for a plain "pick one" column — Table renders the Combobox and applies the filter itself. */
  filterCell?: () => ReactNode;
  /**
   * Declarative select-style filter: Table auto-renders a Combobox (desktop +
   * mobile) and filters rows where `exportValue(row)` equals the chosen
   * option's value — no filterCell/pending-state wiring needed. Applies
   * instantly (not gated behind the Search button), same as `isMine`. Use
   * this by default for any column with a fixed/enumerable set of values
   * (status, partner, project, …); reach for `filterCell` only when the
   * predicate isn't a plain equality check (free text, numeric ranges, dates).
   */
  filterOptions?: { value: string; label: string }[];
  /**
   * Marks this column as a person's name/email. When set, Table auto-renders
   * a "Me only" toggle in this column's filter cell — return true when `row`
   * belongs to the current user. Table owns applying this filter (it's the
   * one universal, business-agnostic filter every identity column needs);
   * everything else in `filterCell` stays page-owned as usual.
   */
  isMine?: (row: T) => boolean;
  /** Resize floor in px (default 60). */
  minWidth?: number;
}

export interface TableProps<T> {
  /** Stable id for this table instance — drives the default storage key and a11y ids. */
  tableId: string;
  /** Override the localStorage key for column prefs (order/hidden/widths). Defaults to `rbe-ui.table.v1.<tableId>`. */
  storageKey?: string;
  columns: TableColumn<T>[];
  /** Already filtered by the caller — filtering predicates stay page-side (business-specific). */
  rows: T[];
  /** Distinguishes "no data at all" from "filtered to zero" for the empty-state copy. */
  hasAnyRows?: boolean;
  rowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  selectedRowId?: string | null;
  rowClassName?: (row: T) => string | undefined;
  /**
   * Fires with the exact on-screen row order (post sort, post pagination)
   * whenever it changes. Sorting/pagination are Table-owned, so a caller that
   * needs the true visual order for something else — e.g. keyboard up/down
   * navigation via `data-rowid` — has no other way to get it.
   */
  onVisibleRowsChange?: (rows: T[]) => void;

  /** Initial sort; user interaction takes over from here. */
  defaultSort?: { key: string; dir: 'asc' | 'desc' };

  pageSizeOptions?: number[];
  defaultPageSize?: number;

  /** Default true. */
  stickyHeader?: boolean;
  /** Number of leading columns pinned while scrolling horizontally. Default 0. */
  stickyColumns?: number;

  selectable?: boolean;
  rowAriaLabel?: (row: T) => string;
  /** Rendered in a toolbar that appears above the table once at least one row is selected. */
  bulkActions?: (selectedRows: T[], clearSelection: () => void) => ReactNode;

  /** Extra controls rendered at the end of the filter row (e.g. an "Archived" toggle). */
  filterRowExtra?: ReactNode;
  /**
   * When set, a "Search" button is rendered top-right in the table's toolbar
   * (applying the page's pending filter edits — filter predicates stay
   * page-side, Table only renders the trigger). Pass `filtersDirty` so the
   * button can call out unapplied changes.
   */
  onApplyFilters?: () => void;
  /** True when the page's pending filter edits differ from what's currently applied/shown — makes the Search button pulse. */
  filtersDirty?: boolean;
  /** When set, an "Export CSV" button is rendered, exporting the full filtered+sorted set (all pages) × visible columns. */
  csvFilename?: string;

  loading?: boolean;
  emptyState?: ReactNode;
  noMatchState?: ReactNode;
  /** Trailing per-row actions column (always visible, not part of the column-picker). */
  actionsColumn?: (row: T) => ReactNode;
  className?: string;
}
