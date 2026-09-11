---
title: "The implicit metadata properties' names are translated identifiers"
package: packages/databases
summary: 'Implicit title/created/last-modified property names are i18n strings persisted as identifiers; a second locale breaks lookups'
paths:
  - 'packages/databases/src/utils/withImplicitMetadataProperties/**'
  - 'packages/databases/src/utils/resolveDesignPropertyMap/**'
  - 'packages/databases/src/setDatabaseDesignPropertyMap/**'
tags: [i18n, metadata, identifiers, property-map]
---

# The implicit metadata properties' names are translated identifiers

`withImplicitMetadataProperties` names the implicit title, created and last modified properties with `i18n.t(schema.name)`, but those names double as **identifiers** wherever a property name is persisted: `database.designPropertyMap` stores them inside saved mappings, and query filter and sort nodes store them as the property they act on.

In en-GB everything lines up because the translations are "Title", "Created" and "Last modified". Adding a second locale breaks anything persisted under the old name, silently, since the lookups just stop matching. The fix is to treat the untranslated type names as stable identifiers and add a separate translated display `label` to the property schema (updating the property mapping UI to render labels over names).

Data view sort options avoid this: they record whether the sort targets a property or entry metadata, and reference metadata by type ('created') rather than by the name it is surfaced under.
