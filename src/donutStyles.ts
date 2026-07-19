// Self-injecting stylesheet for <Donut>, independent from every other
// component's stylesheet (same convention as StatCard/Combobox).

const CSS = `
.rbe-donut {
  position: relative;
  width: 100%;
}
.rbe-donut-center {
  position: absolute;
  left: 50%;
  top: var(--rbe-donut-center-top, 50%);
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  text-align: center;
}
.rbe-donut-center-value {
  font-size: 22px;
  font-weight: 700;
  color: #0b1d36;
  line-height: 1.1;
}
.rbe-donut-center-label {
  font-size: 11px;
  font-weight: 500;
  color: #94a3b8;
  margin-top: 2px;
}
`;

let injected = false;

export function ensureDonutStyles(): void {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const el = document.createElement('style');
  el.setAttribute('data-rbe-ui-donut', '');
  el.textContent = CSS;
  document.head.appendChild(el);
}
