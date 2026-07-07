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
  position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 50;
  max-height: 260px; overflow-y: auto; margin: 0; padding: 4px; list-style: none;
  background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}
.rbe-combobox-option {
  padding: 6px 10px; font-size: 12px; color: var(--color-text, #334155);
  border-radius: 5px; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.rbe-combobox-option:hover, .rbe-combobox-option--active { background: var(--ac-blue-soft, #eff6ff); }
.rbe-combobox-option[aria-selected="true"] { font-weight: 600; }
.rbe-combobox-empty { padding: 8px 10px; font-size: 11px; color: var(--color-text-muted, #94a3b8); font-style: italic; }
`;
let injected = false;
export function ensureComboboxStyles() {
    if (injected || typeof document === 'undefined')
        return;
    injected = true;
    const el = document.createElement('style');
    el.setAttribute('data-rbe-ui-combobox', '');
    el.textContent = CSS;
    document.head.appendChild(el);
}
