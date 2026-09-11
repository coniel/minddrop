---
title: 'Toggle cannot be a Base UI popup trigger'
package: ui/primitives
summary: 'Toggle drops injected props so popups never open; use IconButton, ToolbarIconButton or Button as Base UI triggers'
paths:
  - 'ui/primitives/src/Toggle/**'
  - 'ui/primitives/src/IconButton/**'
  - 'ui/primitives/src/Toolbar/Toolbar.tsx'
tags: [toggle, base-ui, popups, props-spread]
---

# `Toggle` cannot be a Base UI popup trigger

`Toggle` destructures a fixed set of props and never spreads the rest onto the element it renders, so the props Base UI injects through `Menu.Trigger` / `Popover.Trigger` — the click handler included — are silently dropped and the popup never opens. There is no error and the button still renders, which makes it a long debug. Use `IconButton` / `ToolbarIconButton` / `Button` as popup triggers: they spread `...other`. `ToolbarIconButton` additionally needs a `Toolbar` root above it (`FloatingToolbar` is one), so a test rendering one in isolation throws `ToolbarRootContext is missing`.
