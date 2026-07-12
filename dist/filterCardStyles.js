// Self-injecting stylesheet for <FilterCard>/<FilterGroups>/<FilterGroup>/<SegmentedToggle>,
// independent from every other component's stylesheet (same convention as Combobox).
const CSS = `
.rbe-filter-card {
  background: #fff;
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: var(--radius, 10px);
  padding: 16px 18px;
}
.rbe-filter-groups {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 18px;
  align-items: flex-end;
}
.rbe-filter-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.rbe-filter-group-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: var(--color-text-muted, #94a3b8);
}
.rbe-segmented-toggle {
  display: flex;
  border: 1px solid var(--color-border, #cbd5e1);
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}
.rbe-segmented-toggle-btn {
  border: none;
  border-right: 1px solid var(--color-border, #cbd5e1);
  background: #fff;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 400;
  font-family: inherit;
  color: var(--color-text-secondary, #64748b);
  cursor: pointer;
  height: 34px;
}
.rbe-segmented-toggle-btn:last-child { border-right: none; }
.rbe-segmented-toggle-btn--active {
  background: var(--blue, #2563eb);
  color: #fff;
  font-weight: 600;
}
`;
let injected = false;
export function ensureFilterCardStyles() {
    if (injected || typeof document === 'undefined')
        return;
    injected = true;
    const el = document.createElement('style');
    el.setAttribute('data-rbe-ui-filter-card', '');
    el.textContent = CSS;
    document.head.appendChild(el);
}
