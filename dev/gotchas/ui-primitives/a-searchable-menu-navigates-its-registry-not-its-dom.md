---
title: 'A searchable menu navigates its registry, not its DOM'
package: ui/primitives
summary: 'SearchableMenu arrow keys walk the items registered through MenuSearchContext, sorted by DOM order; anything rendered among them without registering is invisible to the keyboard, and an open submenu registers as a scope of its own'
paths:
  - 'ui/primitives/src/SearchableMenu/**'
  - 'ui/primitives/src/Menu/MenuSearchContext.tsx'
  - 'ui/primitives/src/Menu/MenuSearchScope.tsx'
  - 'ui/primitives/src/DropdownMenu/DropdownSubmenuContent.tsx'
  - 'ui/primitives/src/DropdownMenu/DropdownSubmenuTriggerItem.tsx'
tags: [searchable-menu, keyboard-navigation, submenu]
---

# A searchable menu navigates its registry, not its DOM

`SearchableMenu`'s arrow keys walk the items registered through `MenuSearchContext`, in registration order. Anything rendered among them which does not register is invisible to the keyboard however plainly it is on screen — submenu triggers were, until `DropdownSubmenuTriggerItem` started registering with `searchable: false` and an `activate` which opens its submenu.

Registration order is mount order, which is not the order the items are rendered in: an item rendered only some of the time — the submenu a menu replaces with its contents while searching, say — rejoins at the end when it comes back, and the keyboard then jumps about. `sortAsRendered` orders the registry by the DOM instead, matching ids to elements through their `data-menu-item` attribute.

An open submenu's items register as a scope of their own (`MenuSearchScope`, rendered by `DropdownSubmenuContent`), and the menu navigates the innermost open scope in place of its own items. A scope carries the ID of the item it was entered from, so that closing it returns the highlight there instead of leaving the menu with none: `useNavigableList` resets its highlight whenever the item count changes, which closing a scope always does. Without scopes the submenu's items joined the parent's list at the end, and opening a submenu reset the parent's highlight by changing its item count. A submenu with a search field of its own is its own `SearchableMenu` and takes no scope.
