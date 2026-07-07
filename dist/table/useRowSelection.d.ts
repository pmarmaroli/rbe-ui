/**
 * Row selection over the full filtered+sorted set (not just the current page),
 * so "select all" + a bulk action behaves correctly across pagination — the
 * intended use case (e.g. bulk-approve) generally wants "all matching rows",
 * not "all rows currently rendered on screen".
 */
export declare function useRowSelection<T>(rows: T[], rowId: (row: T) => string): {
    selected: Set<string>;
    toggle: (id: string) => void;
    toggleAll: () => void;
    clear: () => void;
    isAllSelected: boolean;
    isIndeterminate: boolean;
    selectedRows: T[];
};
