---
title: "A drop target can only read a drag's data types until it drops"
package: ui/entity-groups
summary: 'Drags out of a group carry their source twice: a JSON payload readable on drop, and a per-type marker key whose presence a target can check during dragover'
paths:
  - 'ui/entity-groups/src/constants.ts'
  - 'ui/entity-groups/src/EntityGroupItem/**'
  - 'ui/entity-groups/src/utils/resolveEntityGroupDragSource/**'
  - 'ui/entity-groups/src/utils/resolveEntityGroupDropTypes/**'
  - 'ui/entity-groups/src/utils/resolveEntityGroupSourceTypeKey.ts'
  - 'packages/selection/src/useDroppable/**'
tags: [drag-and-drop, data-transfer, entity-groups]
---

# A drop target can only read a drag's data types until it drops

The browser hides a drag's data from every event but `drop`: during `dragenter` and `dragover` only `dataTransfer.types` is readable. A drop target deciding whether to react to a drag, which is what shows or withholds the indicator, therefore cannot read a JSON payload to find out where the drag came from.

Drags out of a group carry their source twice for that reason. `entity-group-source` holds `{ type, groupId }` as JSON, read on drop by `resolveEntityGroupDragSource` to tell a reorder from a move and this type's groups from another's. A second key, `entity-group-source-type:<type>`, holds nothing worth reading: its presence among the types is the point. `resolveEntityGroupDropTypes` hands it to `useDroppable`'s `accepts` for a type which takes no external items, so drags out of any other source are ignored before the indicator ever shows.

`accepts` claims an accepted drag by default, stopping `dragover` from reaching the targets around it. A group's items pass `claim: false`, because the group learns it is dragged over from exactly those events, and its header highlight depends on them.
