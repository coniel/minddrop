---
title: "A popover opened from a menu trigger's open change is dismissed by the same press"
package: ui/primitives
summary: 'A dropdown menu trigger opens on pointer down, so a popover mounted from its onOpenChange is closed by the pointer up of the same press. Open popovers from a completed interaction (an item select, a plain button click) instead.'
paths:
  - 'ui/primitives/src/DropdownMenu/**'
  - 'ui/primitives/src/Popover/**'
  - 'ui/filters/src/FilterMenu/**'
tags: [dropdown-menu, popover, base-ui, pointer-events]
---

# A popover opened from a menu trigger's open change is dismissed by the same press

Base UI's `Menu.Trigger` opens the menu on pointer down, not on click. If a `DropdownMenuRoot`'s `onOpenChange(true)` is used to open a `Popover` in place of the menu (for example to show a picker instead of an empty menu), the popover mounts in the middle of the press. The pointer up and click of that same press then land outside the popover and dismiss it, so it flashes open and closes at once.

Swapping the trigger between a plain button and a menu trigger depending on state is not a fix either: when the swap happens while a popover anchored to the button closes, the freshly mounted menu trigger receives the close and opens the menu.

Open a popover only from an interaction that has completed: a menu item's `onSelect`, or a plain `IconButton`'s `onClick`. When a menu has two modes, keep the button as the menu trigger throughout and swap the menu's content instead, keyed so it remounts when the content changes shape (e.g. turning searchable). The filter menu in `ui/filters` does this: with nothing to list it renders the searchable property list as the menu's own content, and only its "add" item opens a popover.
