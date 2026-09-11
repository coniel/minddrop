---
title: 'Grouped Combobox lists are never virtualized'
package: ui/primitives
summary: 'Passing groups to Combobox disables virtualization entirely, so avoid groups on lists that can grow to hundreds'
paths:
  - 'ui/primitives/src/Combobox/Combobox.tsx'
tags: [combobox, virtualization, groups, performance]
---

# Grouped Combobox lists are never virtualized

`Combobox` virtualizes automatically once a flat `items` list passes `VIRTUALIZE_THRESHOLD` (50), but the check is `!groups && items.length > VIRTUALIZE_THRESHOLD`, so passing `groups` opts out entirely no matter how many items the groups hold. Adding a group heading to an existing picker therefore silently drops virtualization. Fine for small lists (collection pickers, data sources), but don't reach for `groups` on a list that can grow to hundreds of entries without checking the render cost first.
