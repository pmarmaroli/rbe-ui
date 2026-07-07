import { useEffect, useRef, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { ensureComboboxStyles } from './comboboxStyles';

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'size'> {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  /** Shown as the input's empty-state text. Also doubles as the "clear selection" option's label when allowClear is true. */
  placeholder?: string;
  /** Whether an "All"/clear option (value '') is offered. Default true — set false for a required field. */
  allowClear?: boolean;
  /** Cap on rendered options after filtering, so a list of thousands stays fast and scrollable-in-practice. Default 200. */
  maxResults?: number;
  className?: string;
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/**
 * A single control that both filters by typed text AND lets you just open and
 * pick, so a list of a handful of items and a list of thousands both stay
 * usable — scrolling a plain <select> with thousands of entries isn't a real
 * option, but forcing everyone to type isn't either.
 */
export function Combobox({
  options, value, onChange, placeholder = 'All', allowClear = true, maxResults = 200, className, ...rest
}: ComboboxProps) {
  ensureComboboxStyles();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setQuery(''); }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const selected = options.find((o) => o.value === value);
  const displayValue = open ? query : (selected?.label ?? '');

  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;
  const shown = filtered.slice(0, maxResults);
  const truncated = filtered.length > shown.length;
  // The clear/"All" option occupies index 0 of the keyboard-navigable list when present.
  const navCount = shown.length + (allowClear ? 1 : 0);

  function selectValue(v: string) {
    onChange(v);
    setOpen(false);
    setQuery('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setHighlighted((h) => Math.min(h + 1, navCount - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (!open) return;
      if (allowClear && highlighted === 0) selectValue('');
      else {
        const opt = shown[highlighted - (allowClear ? 1 : 0)];
        if (opt) selectValue(opt.value);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
  }

  return (
    <div ref={ref} className={cx('rbe-combobox', className)}>
      <input
        {...rest}
        type="text"
        className="rbe-combobox-input"
        value={displayValue}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        onFocus={() => { setOpen(true); setQuery(''); setHighlighted(0); }}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); setHighlighted(0); }}
        onKeyDown={handleKeyDown}
      />
      {open && (
        <ul className="rbe-combobox-list" role="listbox">
          {allowClear && (
            <li
              role="option"
              aria-selected={value === ''}
              className={cx('rbe-combobox-option', highlighted === 0 && 'rbe-combobox-option--active')}
              onMouseDown={(e) => { e.preventDefault(); selectValue(''); }}
            >
              {placeholder}
            </li>
          )}
          {shown.map((o, i) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              className={cx('rbe-combobox-option', i + (allowClear ? 1 : 0) === highlighted && 'rbe-combobox-option--active')}
              onMouseDown={(e) => { e.preventDefault(); selectValue(o.value); }}
            >
              {o.label}
            </li>
          ))}
          {shown.length === 0 && <li className="rbe-combobox-empty">No matches</li>}
          {truncated && <li className="rbe-combobox-empty">+{filtered.length - shown.length} more — keep typing to narrow it down</li>}
        </ul>
      )}
    </div>
  );
}
