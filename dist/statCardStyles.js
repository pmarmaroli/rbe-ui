// Self-injecting stylesheet for <StatCards>/<StatCard>, independent from every
// other component's stylesheet (same convention as Combobox).
const CSS = `
.rbe-stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}
.rbe-stat-card {
  background: #fff;
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: var(--radius, 10px);
  padding: 14px 16px;
}
.rbe-stat-card-value {
  font-size: 26px;
  font-weight: 600;
  color: var(--navy, #1a365d);
  white-space: nowrap;
}
.rbe-stat-card-label {
  font-size: 11px;
  color: var(--color-text-secondary, #64748b);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
}
@media (max-width: 600px) {
  .rbe-stat-cards { grid-template-columns: repeat(2, 1fr); }
  .rbe-stat-card { padding: 10px 12px; }
  .rbe-stat-card-value { font-size: 20px; }
}
`;
let injected = false;
export function ensureStatCardStyles() {
    if (injected || typeof document === 'undefined')
        return;
    injected = true;
    const el = document.createElement('style');
    el.setAttribute('data-rbe-ui-stat-card', '');
    el.textContent = CSS;
    document.head.appendChild(el);
}
