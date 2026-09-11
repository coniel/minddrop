---
title: 'Package typecheck fails on unrelated ui/icons errors'
package: packages/queries
summary: 'tsc on packages/queries reports pre-existing ui/icons jsx errors; ignore them, features/queries typechecks the same files fine'
paths:
  - 'packages/queries/tsconfig.json'
  - 'features/queries/tsconfig.json'
  - 'ui/icons/src/content-icons.min.tsx'
tags: [typecheck, tsconfig, icons, jsx]
---

# Package typecheck fails on unrelated ui/icons errors

`npx tsc --noEmit -p packages/queries/tsconfig.json` reports errors in `ui/icons` (missing `--jsx` for `content-icons.min.tsx`, a symbol-to-string conversion) pulled in through the dependency chain. They pre-date any queries work (verified on 2026-08-10 against earlier commits) and do not indicate a problem in the queries package; the same files typecheck fine through `features/queries`, whose tsconfig sets `jsx`.
