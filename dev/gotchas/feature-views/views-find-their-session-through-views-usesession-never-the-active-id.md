---
title: 'Views find their session through Views.useSession, never the active id'
package: features/views
summary: 'Session-scoped code reads its session from Views.useSession, never ViewSessions.useActiveId, which flips mid-switch'
paths:
  - 'features/views/src/ViewRenderer/ViewRenderer.tsx'
  - 'features/views/src/ViewRenderer/SessionPane.tsx'
  - 'features/views/src/SessionViewStateProvider.tsx'
  - 'packages/views/src/ViewSessionContext/ViewSessionContext.tsx'
  - 'packages/views/src/useSlot/useSlot.ts'
tags: [sessions, context, views, session-switch]
---

# Views find their session through `Views.useSession`, never the active id

`ViewRenderer` provides each pane's session id through `Views.SessionProvider`, and `SessionViewStateProvider` and `useSlot` read it from there. The active session id still keys the rendered view instances (`viewInstanceKey`) so switching sessions remounts views, but nothing session-scoped should read `ViewSessions.useActiveId` to find "its" session: during a switch the outgoing view flushes writes while the active id already names the incoming session.
