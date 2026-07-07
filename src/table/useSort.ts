import { useState, useMemo } from 'react';
import type { TableColumn } from './types';

/**
 * Generic click-header sort, replacing what every rbe-cw/rbe-esign table page
 * used to duplicate locally. Comparison uses a column's `sortValue` (falling
 * back to `exportValue`) — numeric values compare numerically, everything else
 * falls back to locale string comparison.
 */
export function useSort<T>(columns: TableColumn<T>[], rows: T[], defaultSort?: { key: string; dir: 'asc' | 'desc' }) {
  const [sortKey, setSortKey] = useState<string | null>(defaultSort?.key ?? null);
  const [dir, setDir] = useState<'asc' | 'desc'>(defaultSort?.dir ?? 'asc');

  function toggleSort(key: string) {
    if (sortKey === key) setDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setDir('asc'); }
  }

  /** Jump directly to a specific key+direction (used by the mobile "Sort by" select). */
  function setSort(key: string, nextDir: 'asc' | 'desc') {
    setSortKey(key);
    setDir(nextDir);
  }

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    const col = columns.find((c) => c.sortKey === sortKey);
    const val = col?.sortValue || col?.exportValue;
    if (!val) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const va = val(a) ?? '';
      const vb = val(b) ?? '';
      const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb));
      return dir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [rows, columns, sortKey, dir]);

  return { sortKey, dir, toggleSort, setSort, sorted };
}
