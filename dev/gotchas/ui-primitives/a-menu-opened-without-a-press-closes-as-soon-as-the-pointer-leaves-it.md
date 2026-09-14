---
title: 'A menu opened without a press closes as soon as the pointer leaves it'
package: ui/primitives
summary: 'A controlled DropdownMenuRoot opened by another element has no open event, so Base UI hover-closes it on the first mouseleave; open pickers in a Popover instead'
paths:
  - 'ui/primitives/src/DropdownMenu/**'
  - 'ui/databases/src/DataViewEntryPicker/**'
  - 'features/desktop-app/src/AppSidebar/SidebarGroupItemPicker.tsx'
tags: [base-ui, menu, hover, popover]
---

# A menu opened without a press closes as soon as the pointer leaves it

`Menu.Popup` attaches a hover close (`useHoverFloatingInteraction`) whenever the menu store's `hoverEnabled` is true, which is its default. The close is suppressed only for a "click-like" open: Base UI checks `dataRef.openEvent` for a `click` or `mousedown`, or a pointer down on an interactive element inside the popup. A menu whose `open` is driven from outside — a controlled `DropdownMenuRoot` positioned with `anchor` against some other button — has no open event at all, so the first `mouseleave` of its popup closes it, with nothing naming the cause. A menu opened by a press of its own `DropdownMenuTrigger` never has the problem, which is why the same sidebar group header's options menu behaves and its add menu did not.

For a picker opened by something else, use a `Popover` with `SearchableMenu` or menu content inside it: popovers have no hover interaction. `DataViewEntryPicker` (`ui/databases`) and `SidebarGroupItemPicker` (`features/desktop-app`) both do this.
