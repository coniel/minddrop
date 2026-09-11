---
title: 'printKeyboardShortcut has no key separator on non-Mac platforms'
package: ui/primitives
summary: 'printKeyboardShortcut joins keys with no separator off Mac (ShiftEnter); avoid multi-key shortcuts in visible text'
paths:
  - 'ui/primitives/src/KeyboardShortcut/KeyboardShortcut.tsx'
  - 'ui/primitives/src/Tooltip/Tooltip.tsx'
tags: [keyboard-shortcut, cross-platform, tooltip]
---

# `printKeyboardShortcut` has no key separator on non-Mac platforms

`printKeyboardShortcut` (used by `KeyboardShortcut` and Tooltip shortcuts) substitutes symbols and joins without a separator on Mac (`⇧⏎`), but on other platforms it joins the raw key names as-is, so `['Shift', 'Enter']` renders as "ShiftEnter". Multi-key shortcuts therefore look broken outside Mac. A real fix means joining with `+` (or similar) in the non-Mac branch; until then, avoid multi-key shortcuts in always-visible UI text where the mangling is prominent.
