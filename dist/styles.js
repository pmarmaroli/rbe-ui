// Self-injecting styles for the shared components. Injected once into
// document.head on first use, so consuming apps need NO CSS import or build
// config. App theme variables are respected when present, with safe fallbacks.
const CSS = `
@keyframes rbe-rotate { 100% { transform: rotate(360deg); } }
@keyframes rbe-dash {
  0%   { stroke-dasharray: 1, 200;   stroke-dashoffset: 0; }
  50%  { stroke-dasharray: 110, 200; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 110, 200; stroke-dashoffset: -124; }
}
@keyframes rbe-dots { 0%, 20% { opacity: 0.2; } 50% { opacity: 1; } 100% { opacity: 0.2; } }
@keyframes rbe-fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

.rbe-loader-wrap {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 18px; padding: 64px 16px; min-height: 220px;
  animation: rbe-fade-in 0.4s ease both;
}
.rbe-loader-svg {
  width: 56px; height: 56px;
  animation: rbe-rotate 1.4s linear infinite;
  filter: drop-shadow(0 6px 14px rgba(13, 71, 161, 0.28));
}
.rbe-loader-svg .rbe-track { stroke: var(--color-border-light, #e5e7eb); }
.rbe-loader-svg .rbe-arc { stroke: url(#rbeLoaderGrad); stroke-linecap: round; animation: rbe-dash 1.4s ease-in-out infinite; }
.rbe-loader-label {
  font-size: 13px; font-weight: 500; letter-spacing: 0.02em;
  color: var(--color-text-secondary, #6b7280);
}
.rbe-loader-label .rbe-dot { animation: rbe-dots 1.4s infinite both; }
.rbe-loader-label .rbe-dot:nth-child(2) { animation-delay: 0.2s; }
.rbe-loader-label .rbe-dot:nth-child(3) { animation-delay: 0.4s; }
@media (prefers-reduced-motion: reduce) {
  .rbe-loader-svg { animation-duration: 3s; }
  .rbe-loader-svg .rbe-arc { animation: none; stroke-dasharray: 90, 200; }
  .rbe-loader-label .rbe-dot { animation: none; opacity: 0.6; }
}
`;
let injected = false;
export function ensureStyles() {
    if (injected || typeof document === 'undefined')
        return;
    injected = true;
    const el = document.createElement('style');
    el.setAttribute('data-rbe-ui', '');
    el.textContent = CSS;
    document.head.appendChild(el);
}
