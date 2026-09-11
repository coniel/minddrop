---
title: 'Block IDs are session scoped and never reach the markdown'
package: packages/editor
summary: 'Block IDs are regenerated on every parse and never serialized; never build reload-surviving features on them'
paths:
  - 'packages/editor/src/withBlockIds/**'
tags: [editor, block-ids, markdown, serialization]
---

# Block IDs are session scoped and never reach the markdown

`withBlockIds` gives every top level block an `id`, but the content is stored as markdown, which has nowhere to put it. The IDs are minted when the markdown is parsed and are regenerated from scratch on every load, so they are only good for in-session concerns (hover tracking, selection sets, drag payloads, React keys). Anything that has to survive a reload — block links, anchors, per-block comments — cannot be built on them.

IDs stay out of the markdown because each element type's `toMarkdown` reads only the properties it needs, so nothing enforces it: a serializer which stringifies whole elements would leak them.
