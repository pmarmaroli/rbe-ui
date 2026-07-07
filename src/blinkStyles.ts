// Self-injecting stylesheet for <BlinkButton>, independent from Table's own
// stylesheet (same convention: injected once, own guard, no CSS import needed).

const CSS = `
@keyframes rbe-blink {
  0%, 100% { background: var(--blue, #2563eb); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.5); }
  50% { background: #f59e0b; box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.25); }
}
.rbe-blink { animation: rbe-blink 1s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .rbe-blink { animation: none; background: #f59e0b; }
}
`;

let injected = false;

export function ensureBlinkStyles(): void {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const el = document.createElement('style');
  el.setAttribute('data-rbe-ui-blink', '');
  el.textContent = CSS;
  document.head.appendChild(el);
}
