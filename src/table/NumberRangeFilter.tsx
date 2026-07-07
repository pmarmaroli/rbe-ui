interface Props {
  min: string;
  max: string;
  onChange: (next: { min: string; max: string }) => void;
  onEnter?: () => void;
  className?: string;
}

/**
 * Presentational min/max filter cell for numeric columns. Purely UI — the page
 * still owns predicate application (compare each row's numeric value against
 * `min`/`max`), same division of responsibility as every other `filterCell`.
 */
export function NumberRangeFilter({ min, max, onChange, onEnter, className }: Props) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onEnter) onEnter();
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <input
        className={className}
        type="number"
        inputMode="decimal"
        placeholder="Min"
        value={min}
        onChange={(e) => onChange({ min: e.target.value, max })}
        onKeyDown={handleKeyDown}
        style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
      />
      <input
        className={className}
        type="number"
        inputMode="decimal"
        placeholder="Max"
        value={max}
        onChange={(e) => onChange({ min, max: e.target.value })}
        onKeyDown={handleKeyDown}
        style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
      />
    </div>
  );
}
