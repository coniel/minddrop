---
title: 'Base UI render-prop spreads silently overwrite own handlers'
package: ui/primitives
summary: 'In Base UI render-prop components, spread {...other} first and define handlers after it, chaining the incoming one'
paths:
  - 'ui/primitives/src/Combobox/ComboboxChipRemove.tsx'
  - 'ui/primitives/src/Combobox/**'
tags: [base-ui, render-prop, event-handlers, props-spread]
---

# Base UI render-prop spreads silently overwrite own handlers

Components passed to a Base UI `render` prop receive Base UI's merged props (its internal handlers plus `useButton` wrappers, which always include `onClick`/`onMouseDown`/`onPointerDown`). Writing `onMouseDown={...} {...other}` therefore drops the component's own handler whenever Base UI supplies one of the same name — there is no error, the handler just never runs. Spread `{...other}` first and define handlers after it, chaining the incoming handler before custom behaviour (see `ComboboxChipRemove`, whose propagation stops were overwritten this way, letting chip-remove mousedowns reach the trigger and toggle the popup).
