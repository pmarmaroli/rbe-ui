import type { TableColumn } from './types';
/**
 * Generic click-header sort, replacing what every rbe-cw/rbe-esign table page
 * used to duplicate locally. Comparison uses a column's `sortValue` (falling
 * back to `exportValue`) — numeric values compare numerically, everything else
 * falls back to locale string comparison.
 */
export declare function useSort<T>(columns: TableColumn<T>[], rows: T[], defaultSort?: {
    key: string;
    dir: 'asc' | 'desc';
}): {
    sortKey: string | null;
    dir: "asc" | "desc";
    toggleSort: (key: string) => void;
    setSort: (key: string, nextDir: "asc" | "desc") => void;
    sorted: T[];
};
