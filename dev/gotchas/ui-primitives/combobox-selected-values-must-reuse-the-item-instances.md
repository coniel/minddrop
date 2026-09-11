---
title: 'Combobox selected values must reuse the item instances'
package: ui/primitives
summary: 'Combobox matches selected values by object identity: derive selected from the same options array passed as items'
paths:
  - 'ui/primitives/src/Combobox/**'
tags: [combobox, base-ui, multi-select, object-identity]
---

# Combobox selected values must reuse the item instances

Base UI's combobox matches selected values against list items by object identity, so a multi-select `value` array built from freshly mapped option objects never marks any item as selected, and picking an "already selected" item appends a duplicate instead of toggling it off. Derive `selected` by filtering or looking up the same `options` array passed as items (the pattern used by `QueryNodeEntryValueInput` and `TagsCombobox`); fresh objects are only safe for values that have no corresponding list item.
