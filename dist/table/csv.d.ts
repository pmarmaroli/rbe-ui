import type { TableColumn } from './types';
type Cell = string | number | null | undefined;
/**
 * Download `rows` as a CSV file.
 * @param filename base name (a `-YYYY-MM-DD.csv` suffix is appended)
 * @param headers  column titles
 * @param rows     one array of cells per row (same order as headers)
 */
export declare function downloadCsv(filename: string, headers: string[], rows: Cell[][]): void;
/** Maps `rows` through each column's `exportValue` (empty string when omitted). */
export declare function buildCsvRows<T>(columns: TableColumn<T>[], rows: T[]): Cell[][];
export {};
