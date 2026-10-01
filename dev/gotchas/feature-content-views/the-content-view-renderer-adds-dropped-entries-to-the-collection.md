---
title: 'The content view renderer adds dropped entries to the collection'
package: features/content-views
summary: 'ConfiguredView adds entries dropped anywhere within a collection-sourced view to the collection on the drag ended event, after the view type has placed them; view types place dropped entries but never add them'
paths:
  - 'features/content-views/src/ContentViewRenderer/**'
  - 'content-views/*/src/**'
tags: [content-views, drag-and-drop, collections, drops]
---

# The content view renderer adds dropped entries to the collection

A view type's drop handler (a board column, the canvas, a kanban column) only places an entry dropped on it. It never adds the entry to the view's collection. Membership is handled once, for every view type, by `ConfiguredView` in `features/content-views`.

The wrapper cannot do it from its own `onDrop`, since the pointer engine hands a drop to the innermost target only. It listens to `DragAndDrop.events.Ended` instead, which names the element the drag dropped on: when that element is inside the wrapper, the drag carries database entries and the view's source is a collection, the entries not yet in `entries` are added to it. Entries already in the collection are skipped, so a reorder within the view writes nothing.

The ended event fires after the target's `onDrop` returns, so the view type places the entry before it joins the collection. That is the order `addContent` in board and canvas rely on (place, then add) so the entry is not briefly reconciled into the auto-placed grid or first column. A view type's handler which awaits something before placing a dropped entry loses that ordering.

Content from outside the app does not go through the ended event (native drops dispatch none). The wrapper takes those on its own target and creates entries in the view's database, or in the defaults when the source is a collection or a query fed by several databases. Board and canvas take external drops on their own targets to place them at the drop point, and add them to the collection themselves.
