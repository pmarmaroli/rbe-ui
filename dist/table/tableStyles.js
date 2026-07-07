// Self-injecting stylesheet for <Table>: injected once into document.head on
// first use, so consuming apps need no CSS import or build config. CSS custom
// properties are read with safe neutral fallbacks so it looks reasonable even
// in an app that hasn't defined rbe-cw's --ac-blue-*/--blue tokens.
const CSS = `
.rbe-table-wrap { overflow-x: auto; border-radius: var(--radius-lg, 10px); border: 1px solid var(--color-border, #e2e8f0); background: var(--color-white, #fff); }

.rbe-table { width: 100%; border-collapse: collapse; }
.rbe-table.rbe-table--fixed { table-layout: fixed; }
.rbe-table.rbe-table--fixed tbody td { overflow: hidden; text-overflow: ellipsis; }

.rbe-table thead th {
  background: var(--ac-blue-soft, #eff6ff);
  font-size: 9px; font-weight: 700; text-transform: uppercase;
  color: var(--ac-blue-ink, #1e3a8a); letter-spacing: 0.5px;
  padding: 10px 14px; text-align: left;
  border-bottom: 2px solid var(--ac-blue-line, #bfdbfe);
  white-space: nowrap; position: relative;
}
.rbe-table th.rbe-table-num, .rbe-table td.rbe-table-num { text-align: right; }

.rbe-table-sort-btn {
  all: unset; box-sizing: border-box; display: inline-flex; align-items: center; gap: 4px;
  cursor: pointer; font: inherit; color: inherit; text-transform: inherit;
  letter-spacing: inherit; padding: 0; width: 100%; min-height: 20px;
}
.rbe-table-sort-btn:hover { color: var(--color-text, #475569); }
.rbe-table-sort-btn:focus-visible { outline: 2px solid var(--blue, #2563eb); outline-offset: 2px; }
.rbe-table-sort-arrow { color: var(--blue, #2563eb); }

.rbe-table-resizer {
  position: absolute; top: 0; right: 0; width: 8px; height: 100%;
  cursor: col-resize; touch-action: none; user-select: none;
}
.rbe-table-resizer:hover { box-shadow: inset -2px 0 0 var(--blue, #2563eb); }

.rbe-table tbody td {
  font-size: 12px; padding: 10px 14px; color: var(--color-text, #334155);
  border-bottom: 1px solid var(--color-border-light, #f1f5f9);
  font-variant-numeric: tabular-nums;
}
.rbe-table tbody tr:last-child td { border-bottom: none; }
.rbe-table tbody tr:hover td { background: var(--color-row-hover, #f8fafc); }
.rbe-table-row--clickable { cursor: pointer; }
.rbe-table-row--selected td { background: var(--color-row-selected, #eff6ff) !important; }
.rbe-table-row--selected:hover td { background: var(--color-row-selected-hover, #dbeafe) !important; }

.rbe-table-sticky-th { position: sticky; z-index: 3; border-right: 1px solid var(--color-border-light, #e2e8f0); }
.rbe-table-sticky-td { position: sticky; z-index: 2; background: var(--color-white, #fff); border-right: 1px solid var(--color-border-light, #e2e8f0); }
.rbe-table tbody tr:hover td.rbe-table-sticky-td { background: var(--color-row-hover, #f8fafc); }
.rbe-table-row--selected td.rbe-table-sticky-td { background: var(--color-row-selected, #eff6ff) !important; }
.rbe-table--sticky-header thead th { position: sticky; top: 0; z-index: 4; }
.rbe-table--sticky-header thead th.rbe-table-sticky-th { z-index: 5; }

.rbe-table-filter-row th { background: var(--color-filter-row-bg, #f1f5f9); padding: 5px 8px; border-bottom: 1px solid var(--color-border, #e2e8f0); }
.rbe-table-filter-input, .rbe-table-filter-select {
  width: 100%; padding: 4px 7px; border: 1px solid var(--color-border, #cbd5e1);
  border-radius: 5px; font-size: 11px; background: #fff; color: var(--color-text, #334155);
  outline: none; box-sizing: border-box;
}
.rbe-table-filter-input:focus, .rbe-table-filter-select:focus { border-color: var(--blue, #2563eb); }

.rbe-table-checkbox-cell { width: 36px; text-align: center; }
.rbe-table-checkbox { width: 18px; height: 18px; cursor: pointer; }

.rbe-table-me-only {
  display: flex; align-items: center; gap: 4px; margin-top: 4px;
  font-size: 10px; font-weight: 600; color: var(--color-text-muted, #64748b);
  cursor: pointer; white-space: nowrap;
}
.rbe-table-me-only input { width: 13px; height: 13px; cursor: pointer; }

.rbe-table-toolbar { display: flex; align-items: center; justify-content: flex-start; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
.rbe-table-bulk-toolbar {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  padding: 8px 14px; background: var(--color-bulk-bg, #eff6ff);
  border: 1px solid var(--color-bulk-border, #bfdbfe); border-radius: var(--radius, 8px);
  margin-bottom: 10px; font-size: 12px;
}
.rbe-table-btn {
  display: inline-flex; align-items: center; gap: 6px; min-height: 32px; padding: 6px 14px;
  background: #fff; color: var(--color-text, #334155); border: 1px solid var(--color-border, #cbd5e1);
  border-radius: var(--radius, 8px); font-size: 12px; font-weight: 600; font-family: inherit; cursor: pointer;
}
.rbe-table-btn:hover:not(:disabled) { border-color: var(--blue, #2563eb); color: var(--blue, #2563eb); }
.rbe-table-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.rbe-table-empty { text-align: center; padding: 50px 14px; color: var(--color-text-muted, #94a3b8); font-size: 13px; }

.rbe-table-skeleton-cell {
  height: 14px; border-radius: 4px;
  background: linear-gradient(90deg, var(--color-border-light, #f1f5f9) 25%, var(--color-border, #e2e8f0) 37%, var(--color-border-light, #f1f5f9) 63%);
  background-size: 400% 100%; animation: rbe-table-shimmer 1.4s ease infinite;
}
@keyframes rbe-table-shimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }

.rbe-table-footer {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;
  gap: 10px; padding: 10px 14px; font-size: 12px; color: var(--color-text-muted, #64748b);
}
.rbe-table-footer-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.rbe-table-page-btn {
  min-width: 44px; min-height: 32px; padding: 4px 10px;
  border: 1px solid var(--color-border, #cbd5e1); border-radius: 6px; background: #fff;
  font-size: 12px; cursor: pointer; font-family: inherit;
}
.rbe-table-page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.rbe-table-page-size-select { min-height: 32px; padding: 4px 8px; border: 1px solid var(--color-border, #cbd5e1); border-radius: 6px; font-size: 12px; }

.rbe-table-mobile-sort, .rbe-table-mobile-filters-toggle, .rbe-table-mobile-filters { display: none; }

@media (max-width: 640px) {
  .rbe-table-mobile-sort {
    display: block; margin-bottom: 8px; width: 100%; min-height: 44px; padding: 8px 10px;
    border-radius: 8px; border: 1px solid var(--color-border, #cbd5e1); font-size: 13px; box-sizing: border-box;
  }
  .rbe-table-mobile-filters-toggle { display: inline-flex; margin-bottom: 8px; min-height: 44px; }
  .rbe-table-mobile-filters {
    display: flex; flex-direction: column; gap: 8px; padding: 10px; margin-bottom: 10px;
    background: var(--color-filter-row-bg, #f1f5f9); border-radius: 8px;
  }
  .rbe-table-mobile-filter-item label { display: block; font-size: 11px; font-weight: 600; color: var(--color-text-muted, #64748b); margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.3px; }

  /* thead (including the sort buttons + filter-row inputs) is fully removed on
     mobile rather than just visually hidden — its interactive controls are
     replaced by the mobile "Sort by" select and Filters drawer above, so
     display:none avoids leaving duplicate, invisible-but-tabbable controls. */
  .rbe-table thead { display: none; }
  .rbe-table, .rbe-table tbody, .rbe-table tr { display: block; width: 100%; }
  .rbe-table.rbe-table--fixed { table-layout: auto; }
  .rbe-table-sticky-th, .rbe-table-sticky-td { position: static !important; }
  .rbe-table--sticky-header thead th { position: static !important; }
  .rbe-table tr { border: 1px solid var(--color-border-light, #f1f5f9); border-radius: 8px; margin-bottom: 10px; padding: 4px 0; }
  .rbe-table td {
    display: flex; justify-content: space-between; align-items: center; gap: 10px;
    padding: 8px 12px; border-bottom: 1px solid var(--color-border-light, #f8fafc);
    text-align: left !important; min-height: 32px; box-sizing: border-box;
  }
  .rbe-table tr td:last-child { border-bottom: none; }
  .rbe-table td[data-label]::before {
    content: attr(data-label); font-weight: 600; color: var(--color-text-muted, #64748b);
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; flex-shrink: 0; margin-right: 10px;
  }
  .rbe-table-checkbox-cell { justify-content: flex-start; }
}
`;
let injected = false;
export function ensureTableStyles() {
    if (injected || typeof document === 'undefined')
        return;
    injected = true;
    const el = document.createElement('style');
    el.setAttribute('data-rbe-ui-table', '');
    el.textContent = CSS;
    document.head.appendChild(el);
}
