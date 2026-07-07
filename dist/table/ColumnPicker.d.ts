import type { TableColumn } from './types';
interface Props<T> {
    columns: TableColumn<T>[];
    hidden: Set<string>;
    onToggle: (key: string) => void;
    onMove: (key: string, dir: -1 | 1) => void;
    onReset: () => void;
    isCustomized?: boolean;
    compact?: boolean;
}
/** "⚙ Columns" popover — show/hide + reorder. Ported from rbe-cw/rbe-esign (identical in both). */
export declare function ColumnPicker<T>({ columns, hidden, onToggle, onMove, onReset, isCustomized, compact }: Props<T>): import("react").JSX.Element;
export {};
