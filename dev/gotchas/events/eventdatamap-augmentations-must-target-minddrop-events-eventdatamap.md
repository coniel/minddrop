---
title: 'EventDataMap augmentations must target @minddrop/events/EventDataMap'
package: packages/events
summary: "Augment EventDataMap via declare module '@minddrop/events/EventDataMap'; augmenting the barrel silently does nothing"
paths:
  - 'packages/events/src/types/EventDataMap.types.ts'
  - 'packages/events/src/core-events.ts'
  - 'packages/events/package.json'
tags: [events, typescript, module-augmentation]
---

# EventDataMap augmentations must target `@minddrop/events/EventDataMap`

TypeScript module augmentation does not merge through `export *` barrels: `declare module '@minddrop/events'` compiles but silently creates a fresh `EventDataMap` on the index module instead of merging with the real interface, so registrations written that way do nothing. Augmentations must target the module which declares the interface, via the `./EventDataMap` subpath export (`packages/events/package.json`). Within the events package itself, `core-events.ts` augments the file by relative path (`./types/EventDataMap.types`) since a package cannot resolve its own name.

An augmentation only applies in programs which include the augmenting `events.ts` file. Call sites import the event constant from that same file, so this holds in practice; a package which defines events but never imports `@minddrop/events` (e.g. `item-references`) must import the registry module explicitly or the augmentation errors with TS2664.
