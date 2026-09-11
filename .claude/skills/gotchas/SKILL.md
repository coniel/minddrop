---
name: gotchas
description: Search the repo's gotchas (non-obvious behaviours, traps and deferred concerns recorded per package in dev/gotchas). Use before starting work on a package or file, when a behaviour seems surprising, or when asked to record a new gotcha.
---

# Gotchas

Gotchas live in `dev/gotchas/<package>/<slug>.md`, one file per gotcha. Never read the directory wholesale: search it.

## Searching

```
bun dev/scripts/gotchas.ts --package <name>     # everything for a package
bun dev/scripts/gotchas.ts --path <file>        # everything applying to a file
bun dev/scripts/gotchas.ts <words>              # free-text search
bun dev/scripts/gotchas.ts --tag <tag>
bun dev/scripts/gotchas.ts --show <id>          # print one in full
```

Filters combine. Results print an id, the title and a one-line summary. Read the full gotcha with `--show` only when the summary is not enough. When `$ARGUMENTS` is given, treat it as the query: a package name, a path or search terms.

## Recording a gotcha

Record one when you discover a non-obvious behaviour, a trap, or a deliberate decision that later work could undo by accident. Create `dev/gotchas/<package>/<slug>.md`:

```markdown
---
title: 'Short statement of the trap'
package: packages/<name>
summary: 'One-line takeaway a developer can act on without opening the file.'
paths:
  - 'packages/<name>/src/<area>/**'
tags: [keyword, keyword]
---

# Short statement of the trap

Body: what happens, why, and what to do instead.
```

- `package` is the repo path of the package (`packages/x`, `features/x`, `ui/x`, `data-views/x`, `apps/x`, or `repo` for repo-wide). The directory name is the package slug (`feature-x`, `ui-x`, `data-view-x`).
- `paths` are repo-relative globs of the source the gotcha applies to. They drive the pre-edit hook, so be specific: a handful of files or directories, never the whole repo.
- Delete a gotcha when the code change that makes it obsolete lands.
