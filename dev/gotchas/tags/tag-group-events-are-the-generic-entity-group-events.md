---
title: 'Tag group events are the generic entity group events'
package: packages/tags
summary: "TagGroups.events re-exports EntityGroups.events, so a listener fires for every group type and must filter on the group's type before acting"
paths:
  - 'packages/tags/src/TagGroups.ts'
  - 'packages/tags/src/tag-groups/**'
  - 'packages/databases/src/event-handlers/tag-group-deleted/**'
tags: [events, entity-groups, tags]
---

# Tag group events are the generic entity group events

Tag groups are entity groups registered under the `tag-groups` type, and entity groups have no per-type event names: `entity-groups:group:deleted` fires for a sidebar group and a tag group alike, with the group's `type` in the data. `TagGroups.events` is a re-export of `EntityGroups.events` rather than a narrowing of it, so `TagGroups.events.Deleted` reads as tag-specific but is not.

A listener acting on tag groups therefore returns early unless `data.type === TagGroups.constants.Type`. The databases package's `tag-group-deleted` handler, which clears the group limit off tags properties, is the one doing so today. Subscribing without the check would clear the limit whenever any group of any type was deleted.
