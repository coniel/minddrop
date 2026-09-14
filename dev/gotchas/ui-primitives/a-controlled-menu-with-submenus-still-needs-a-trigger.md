---
title: 'A controlled menu with submenus still needs a trigger'
package: ui/primitives
summary: 'A DropdownMenuRoot opened from outside must still render a hidden DropdownMenuTrigger for its submenus to position within, with finalFocus={false} so closing does not focus the hidden trigger'
paths:
  - 'ui/primitives/src/DropdownMenu/**'
  - 'packages/editor/src/BlockActionsMenu/**'
tags: [base-ui, menu, submenu, focus]
---

# A controlled menu with submenus still needs a trigger

A `DropdownMenuRoot` opened by something other than its own trigger must still render a `DropdownMenuTrigger` to be a node of the menu tree, which is what nested submenus position themselves within. `BlockActionsMenu` (`packages/editor`) renders one and leaves it unreachable: `aria-hidden`, `tabIndex={-1}`, `nativeButton={false}`, rendered as a span sized to nothing. Pass `finalFocus={false}` alongside it, or closing hands the focus to the hidden span where it is lost.

This is separate from the hover close a menu opened without a press suffers (see the gotcha of that name), which the hidden trigger does not affect.
