---
title: 'TranslatableNode treats strings as i18n keys'
package: ui/primitives
summary: 'TranslatableNode props translate strings as i18n keys; wrap pre-built text in a fragment to render it as-is'
paths:
  - 'ui/primitives/src/types/i18n.types.ts'
  - 'ui/primitives/src/Tooltip/Tooltip.tsx'
  - 'ui/primitives/src/Text/**'
tags: [i18n, translatable-node, tooltip, types]
---

# `TranslatableNode` treats strings as i18n keys

Props typed `TranslatableNode` (Tooltip `title`/`description`, `Text` `text`, menu labels, ...) translate string values internally — passing pre-translated or dynamic text as a string either fails the type check or double-translates. Pass the raw `TranslationKey` when there is one; wrap already-built strings in a fragment (`<>{value}</>`) to render them as-is.
