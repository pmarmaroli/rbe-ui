# @rbe/ui

Shared UI components for the Rail Baltica Alliance suite (`rbe-esign`, `rbe-erp`,
`rbe-timesheet`, `rbe-identity`, `rbe-users-admin`, `rbe-dev-costs`).

Consumed as a **git dependency** — no npm registry, no tokens. The built output
(`dist/`) is committed so consuming apps install the repo as-is (no build runs on
their side).

## Use it in an app

```bash
npm install github:pmarmaroli/rbe-ui#v1
```

```tsx
import { Spinner } from '@rbe/ui';

<Spinner label="Loading" />
```

Styles self-inject on first render — no CSS import or Vite config needed. The
spinner reads `--color-border-light` / `--color-text-secondary` if the app
defines them, otherwise falls back to neutral greys.

## Components

- `Spinner` — Rail Baltica branded loading animation (navy→gold arc, reduced-motion aware).

## Develop / release

```bash
npm install        # one-time, installs typescript + react types
npm run build      # compiles src/ -> dist/ (JS + .d.ts)
git commit -am "..." && git push
git tag v2 && git push --tag    # bump the tag consumers pin to
```

Then in each app: `npm install github:pmarmaroli/rbe-ui#v2`.

> The version pin (`#v1`, `#v2`, …) is how apps opt into an update — nothing
> changes in an app until it re-installs against a newer tag.

## Add a component

1. Add `src/MyThing.tsx` (self-inject any CSS via `ensureStyles`-style pattern, see `styles.ts`).
2. Re-export it from `src/index.ts`.
3. `npm run build`, commit, push, tag.
