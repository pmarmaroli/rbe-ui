import type { TableColumn } from './types';
/**
 * Per-table column visibility + order + widths, persisted in localStorage so the
 * user's choice survives across sessions. `columns` is the full default-ordered
 * list; the hook returns the effective ordered list and the visible subset.
 *
 * Ported from rbe-cw's `useColumnSettings` (independently re-derived in rbe-esign
 * too) — `storageKey` is now an explicit param so a consuming app can keep an
 * existing key unchanged across a migration and not reset every user's prefs.
 */
export declare function useColumnSettings<T>(tableId: string, columns: TableColumn<T>[], storageKey?: string): {
    orderedColumns: TableColumn<T>[];
    visibleColumns: TableColumn<T>[];
    hidden: Set<string>;
    widths: Record<string, number>;
    toggle: (key: string) => void;
    move: (key: string, dir: -1 | 1) => void;
    reset: () => void;
    setWidth: (key: string, px: number) => void;
    seedWidths: (seed: Record<string, number>) => void;
    isCustomized: boolean;
};
