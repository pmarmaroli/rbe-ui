function esc(v) {
    const str = v == null ? '' : String(v);
    return '"' + str.replace(/"/g, '""') + '"';
}
/**
 * Download `rows` as a CSV file.
 * @param filename base name (a `-YYYY-MM-DD.csv` suffix is appended)
 * @param headers  column titles
 * @param rows     one array of cells per row (same order as headers)
 */
export function downloadCsv(filename, headers, rows) {
    const lines = [headers.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))];
    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}
/** Maps `rows` through each column's `exportValue` (empty string when omitted). */
export function buildCsvRows(columns, rows) {
    return rows.map((row) => columns.map((c) => (c.exportValue ? c.exportValue(row) ?? '' : '')));
}
