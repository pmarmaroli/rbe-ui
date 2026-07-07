# @rbe/ui

Shared UI components for the Rail Baltica Alliance suite (`rbe-esign`, `rbe-erp`,
`rbe-timesheet`, `rbe-identity`, `rbe-users-admin`, `rbe-dev-costs`).

Consumed as a **git dependency** — no npm registry, no tokens. The built output
(`dist/`) is committed so consuming apps install the repo as-is (no build runs on
their side).

## Use it in an app

```bash
npm install github:pmarmaroli/rbe-ui#v3
```

```tsx
import { Table } from '@rbe/ui';

<Table tableId="purchase-orders" columns={columns} rows={rows} rowId={(r) => r.id} />
```

Styles self-inject on first render — no CSS import or Vite config needed. Colors
read the app's own CSS custom properties (e.g. `--ac-blue-soft`, `--blue`,
`--color-border`) when present, otherwise fall back to neutral defaults.

## Components

- `Table` — data table with sorting, per-column filter row, client-side pagination, column show/hide/reorder/resize (persisted, touch-friendly), sticky header + leading columns, row selection + bulk actions, CSV export, a CSS-only stacked mobile layout, and baseline accessibility. See `src/table/types.ts` for the `TableColumn<T>`/`TableProps<T>` contract.

## Develop / release

```bash
npm install        # one-time, installs typescript + react types
npm run build      # compiles src/ -> dist/ (JS + .d.ts)
git commit -am "..." && git push
git tag v4 && git push --tag    # bump the tag consumers pin to
```

Then in each app: `npm install github:pmarmaroli/rbe-ui#v4`.

> The version pin (`#v1`, `#v2`, …) is how apps opt into an update — nothing
> changes in an app until it re-installs against a newer tag.

## Add a component

1. Add `src/MyThing.tsx` (self-inject any CSS via an `ensureStyles`-style pattern — see `src/table/tableStyles.ts` for the convention: its own CSS string + its own injected-once guard, kept independent per component so an app importing only one component never evaluates another's CSS).
2. Re-export it from `src/index.ts`.
3. `npm run build`, commit, push, tag.
