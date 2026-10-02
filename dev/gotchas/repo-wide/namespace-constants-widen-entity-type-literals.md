---
title: 'Namespace constants widen entity type literals'
package: repo
summary: 'Foo.constants.EntityType is typed string unless the constants object is as const; entityId() through it mints EntityId<string>, not the typed ID'
paths:
  - 'packages/*/src/constants.ts'
  - 'packages/automations/src/Automations.ts'
  - 'packages/databases/src/createDatabase/**'
tags: [entity-id, constants, namespaces, typescript]
---

# Namespace constants widen entity type literals

An entity type constant is declared as a literal (`export const AutomationEntityType = 'automation'`). A namespace's `constants` object is a plain object literal, so TypeScript widens each property to `string`. `entityId(Foo.constants.EntityType)` then returns `EntityId<string>`. This is not assignable to the entity's typed ID (`EntityId<'automation'>`).

Inside the owning package this never shows, because call sites import the constant itself from `constants.ts`. It shows when another package mints an ID through the namespace's constant, as `createDatabase` does with `Automations.constants.EntityType`.

The fix is to const-assert the namespace's `constants` object, as `Automations.ts` does. Most other namespaces' `constants` objects are not const-asserted yet, so check before minting IDs through another package's constants.
