import { useState, useRef, useEffect } from 'react';
import type { CSSProperties } from 'react';
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
export function ColumnPicker<T>({ columns, hidden, onToggle, onMove, onReset, isCustomized, compact }: Props<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const items = columns.filter((c) => !c.alwaysVisible);
  const hiddenCount = items.filter((c) => hidden.has(c.key)).length;

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      {compact ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          title="Choose which columns to show and their order"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, padding: 0, lineHeight: 1, flexShrink: 0,
            background: isCustomized ? '#eff6ff' : '#fff', color: isCustomized ? '#2563eb' : '#64748b',
            border: `1px solid ${isCustomized ? '#bfdbfe' : '#cbd5e1'}`, borderRadius: 8,
            fontSize: 14, cursor: 'pointer',
          }}
        >
          ⚙
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          title="Choose which columns to show and their order"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px',
            background: isCustomized ? '#eff6ff' : '#fff', color: '#334155',
            border: `1px solid ${isCustomized ? '#bfdbfe' : '#cbd5e1'}`, borderRadius: 8,
            fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap',
          }}
        >
          ⚙ Columns{hiddenCount > 0 ? ` (${items.length - hiddenCount}/${items.length})` : ''}
        </button>
      )}

      {open && (
        <div
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 50,
            width: 260, maxWidth: '90vw', background: '#fff', border: '1px solid #e2e8f0',
            borderRadius: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.15)', padding: 8,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: '#64748b', padding: '4px 8px 8px' }}>
            Columns
          </div>
          <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map((c, idx) => (
              <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 6, fontSize: 13 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, cursor: 'pointer', minWidth: 0 }}>
                  <input type="checkbox" checked={!hidden.has(c.key)} onChange={() => onToggle(c.key)} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.label}</span>
                </label>
                <button type="button" title="Move up" disabled={idx === 0} onClick={() => onMove(c.key, -1)} style={arrowStyle(idx === 0)}>▲</button>
                <button type="button" title="Move down" disabled={idx === items.length - 1} onClick={() => onMove(c.key, 1)} style={arrowStyle(idx === items.length - 1)}>▼</button>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 6, paddingTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button type="button" onClick={onReset} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Reset to default
            </button>
            <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function arrowStyle(disabled: boolean): CSSProperties {
  return {
    width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    border: '1px solid #e2e8f0', borderRadius: 5, background: '#fff', fontSize: 9,
    color: disabled ? '#cbd5e1' : '#475569', cursor: disabled ? 'not-allowed' : 'pointer', padding: 0,
  };
}
