---
title: 'Restored slot state outlives a view which no longer sets it'
package: packages/views
summary: 'Restored session slot state beats useSlot defaults, so a stale slot can outlive its view after a crash plus code change'
paths:
  - 'packages/views/src/useSlot/useSlot.ts'
  - 'packages/views/src/sessions/restoreActiveViewSession.ts'
  - 'packages/views/src/sessions/setSlot/setSlot.ts'
  - 'ui/views/src/Slot/Slot.tsx'
tags: [slots, sessions, persistence, restore]
---

# Restored slot state outlives a view which no longer sets it

A session's `slots` map persists with the session and is restored with it, and `Views.useSlot` only applies its default when the slot has no state yet, so restored state always wins. That is what makes a hidden sidebar survive a restart, but it also means a session restored after a crash keeps state for a slot its view has since stopped using, and `Slot` keeps rendering it until the session navigates (which resets `slots`). Only a crash plus a code change reaches this; a fix would drop states naming unregistered fills on hydrate.
