---
title: "Only Base UI's own menu items close a sibling's submenu"
package: ui/primitives
summary: 'Base UI closes an open submenu from itemhover events its own Menu.Item emits; items rendered outside its composite (SearchableMenu) must report hovers through MenuItemHoverContext or the submenu stays open'
paths:
  - 'ui/primitives/src/Menu/**'
  - 'ui/primitives/src/DropdownMenu/DropdownSubmenu/**'
  - 'ui/primitives/src/SearchableMenu/**'
tags: [base-ui, menu, submenu, hover, searchable-menu]
---

# Only Base UI's own menu items close a sibling's submenu

Base UI closes an open submenu from the parent menu's side: every `Menu.Item` emits an `itemhover` tree event on `mousemove`, and `MenuPositioner` closes any submenu whose trigger is not the hovered element. It has to, because hover-closing the submenu is off by then — moving the pointer into a submenu popup sets its `hoverEnabled` to false, which unsubscribes both the trigger's `safePolygon` and the popup's own hover close for as long as it stays open.

A `SearchableMenu`'s items are not Base UI items (navigation runs through `useNavigableList` so focus can stay on the search field), so they emit nothing and a submenu opened from one stays open however far the pointer wanders. `MenuItem` therefore reports its own hovers through `MenuItemHoverContext`, which `Menu` and `SearchableMenu` each provide and `DropdownSubmenu` listens to. Items which open a submenu are skipped, Base UI having covered them already. Any future item rendered outside Base UI's composite needs the same `useNotifyMenuItemHover` call.

While the pointer has yet to enter a hover-opened submenu, its `safePolygon({ blockPointerEvents: true })` holds `pointer-events: none` on the body, so nothing else in the menu can be hovered at all. Entering the popup lifts it along with `hoverEnabled`. A test which hovers a sibling item without going through the submenu first fails on `user-event`'s pointer-events assertion rather than on the behaviour it means to check.
