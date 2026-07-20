// Self-injecting stylesheet for <Combobox>, independent from Table's own
// stylesheet (same convention as every other component here).

const CSS = `
.rbe-combobox { position: relative; display: inline-block; width: 100%; }
.rbe-combobox-input {
  width: 100%; box-sizing: border-box; padding: 4px 7px;
  border: 1px solid var(--color-border, #cbd5e1); border-radius: 5px;
  font-size: 11px; background: #fff; color: var(--color-text, #334155); outline: none;
}
.rbe-combobox-input:focus { border-color: var(--blue, #2563eb); }
.rbe-combobox-list {
  position: absolute; top: calc(100% + 4px); left: 0; z-index: 50;
  /* Grow to fit the longest option (so codes like "2205 — Improvement layer"
     aren't truncated to "2205…" inside a narrow field/cell), never narrower
     than the field, capped so it stays on screen. */
  min-width: 100%; width: max-content; max-width: min(480px, 90vw);
  max-height: 260px; overflow-y: auto; margin: 0; padding: 4px; list-style: none;
  background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}
.rbe-combobox-option {
  padding: 6px 10px; font-size: 12px; color: var(--color-text, #334155);
  border-radius: 5px; cursor: pointer;
  /* Wrap instead of single-line ellipsis: a 480px-wide popup still isn't
     enough for long labels ("Framework agreement for supply of materials
     including bitu…"), so let them take a second/third line instead of
     hiding text no hover/tooltip ever revealed. */
  white-space: normal; overflow-wrap: break-word;
}
.rbe-combobox-option:hover, .rbe-combobox-option--active { background: var(--ac-blue-soft, #eff6ff); }
.rbe-combobox-option[aria-selected="true"] { font-weight: 600; }
.rbe-combobox-empty { padding: 8px 10px; font-size: 11px; color: var(--color-text-muted, #94a3b8); font-style: italic; }
`;

let injected = false;

export function ensureComboboxStyles(): void {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const el = document.createElement('style');
  el.setAttribute('data-rbe-ui-combobox', '');
  el.textContent = CSS;
  document.head.appendChild(el);
}
