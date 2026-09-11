---
title: 'A truncated label inside a tight control clips its descenders'
package: repo
summary: 'Truncated labels inside line-height-none controls (button, menu-item, chip, tabs, inputs) need their own line-height'
paths:
  - 'ui/primitives/src/Button/Button.css'
  - 'ui/primitives/src/Menu/Menu.css'
  - 'ui/primitives/src/Chip/Chip.css'
  - 'ui/primitives/src/Tabs/Tabs.css'
  - 'ui/primitives/src/fields/TextInput/TextInput.css'
tags: [css, typography, line-height, truncation]
---

# A truncated label inside a tight control clips its descenders

A line height of 1 makes a line box exactly `font-size` tall, with no room below the baseline, so any element that also clips its overflow — a label truncated with `overflow: hidden; text-overflow: ellipsis` — crops the tails of g, y, p, q and j. The reset gives `body` `--line-height-snug`, so this only bites inside a control that pins the tighter line for its own vertical centring: `.menu-item`, `.button`, `.select`, `.text-input`, `.chip`, `.tabs-tab`, `.toggle`, `.combobox-chip` and friends. A truncated label inside one of those needs its own `line-height`. The clip happens at the padding box edge, so an element with vertical padding is safe, and anything rendered through `Text` is already snug.
