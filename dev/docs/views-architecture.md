# Views & Data Views Architecture

How views and data views relate to databases, entries, and designs, and
why they are modelled the way they are.

## Two separate concepts, two packages

**Views** (`@minddrop/views`) are pure code: a runtime registry mapping a
view type string to a React component. `Views.register` is called at
startup (e.g. `registerSpaceViews`, `registerDatabaseViews`,
`registerDesignViews`); `ViewRenderer` in `features/views` resolves the
type named by an `OpenViewEvent` and renders the component. Nothing is
persisted; the registry has no lifecycle beyond registration.

**Data views** (`@minddrop/data-views`) are user-curated content: a
`DataView` renders entries from a data source using a registered
`DataViewType` (table, gallery, notebook, board, ...). Each data view

- has a **type** registered via `DataViewTypes`; the type contributes the
  rendering component and an options menu.
- has a **`dataSource`** reference (e.g. `{ type: 'database', id }`)
  naming where its entries come from.
- owns type-specific **`options`** (its own rendering configuration).
- is persisted (unless virtual), dispatches `data-views:*` events, and
  uses `data-view_<uuid>` IDs.

The `features/data-views` package renders them (`DataViewRenderer`,
`CreateDataViewForm`); `features/views` keeps the code-view side
(`ViewRenderer`, view areas, the tab strip). The built-in data view type
packages live in the top-level `data-views/` workspace directory (board,
gallery, notebook, table).

## View sessions

A **view session** (`ViewSession` in `@minddrop/views`) is one navigable
surface with a history: the views shown in its main and split panes, the
split ratio, the back and forward stacks and the panes' transient UI
state (scroll positions, selections). A view area holds a
`ViewSessionSet` (its sessions plus the active session id), persisted
whole to the workspace config under the `sessions` namespace by
`ViewSessionsStore` (`Views:Sessions`). Sessions are data, not UI: the
tab strip in `features/views` is one UI listing a view area's sessions
and switching between them, and a standalone window will be a view area
holding a single session with no strip.

The `ViewSessions` namespace exposes the session lifecycle (`create`,
`close`, `setActive`, `setOrder`, `update`, `split`, `unsplit`,
`duplicate`), the history (`goBack`, `goForward`), the view area sync
(`recordViewArea`, `restoreActive`, `updateForView`, `closeForView`),
the transient view state getters and setters, the slot state (below),
the cross-area `getOpenViews` and the hooks (`useAll`, `useActive`,
`useActiveId`, `useCanGoBack`, `useCanGoForward`, `useBreadcrumbTrail`).
`Tabs` in `features/views` keeps only the strip's interactions
(close-others / left / right, split with another tab, shortcuts,
activate-by-index, `useIsViewActive`), all built on `ViewSessions`.

`ViewRenderer` wraps each rendered view in `Views.SessionProvider`
alongside `Views.PaneProvider`, and `Views.useSession()` returns the
session id. Session-scoped state (transient view state through
`SessionViewStateProvider`, slot state through `Views.useSlot`) reads
the id from the provider rather than assuming the view is the active
session, so a view's writes land on its own session even while it
unmounts during a session switch.

## UI slots and fills

A **slot** is a named position in the app shell (`sidebar`, later a right
panel) and a **fill** is a registered component for it. Fills register
through `Views.registerFill(kind, fill)` into one store keyed by
`kind:id`; the kinds and their fill shapes are declared on the
augmentable `SlotFillMap` interface (the `EventDataMap` pattern), so
`Views.getFill`, `Views.useFill` and `Views.useFills` stay typed while
the store knows nothing about kinds. `packages/views` declares the
`sidebar` kind itself, since the app shell defines that slot. The
registry holds no policy: defaults, fallbacks and the shared sidebar
width stay in the shell.

Slot state is session state: `ViewSession.slots` maps slot ids to
`SessionSlot` values (`{ fill?, props?, hidden? }`, plain data only,
since sessions persist as JSON). A state with no `fill` shows the
shell's fallback, and `hidden` hides the slot entirely, fallback
included, while keeping the chosen fill for when it is shown again.
`ViewSessions.setSlot` (merging), `toggleSlot`, `clearSlot` and
`initializeSlot` (set only when the slot has no state yet) maintain the
map. The state is snapshotted into history entries alongside the views
it belongs to, restored by `goBack` and `goForward`, and reset by
`recordViewArea` when the main pane navigates to a different view, so a
view's slots do not follow the next one.

Three events change slot state after mount, handled by the view area
sync listeners in `features/views`: `Views.events.SetSlot` (merge a
fill, props or visibility onto the slot), `ToggleSlot` (flip `hidden`)
and `ClearSlot` (return the slot to its fallback). Each takes an
optional `viewAreaId` (defaulting to the main area) and `sessionId`
(defaulting to that area's active session), so shell chrome targets the
active session while a view targets its own through `Views.useSession()`.

`packages/views` owns the hooks: `Views.useSlot(slotId, state)` sets
the calling view's default for a slot, applied on mount and only when
the session has no state for it yet (it never overrides restored state
and never releases on unmount), and `Views.useSlotState(slotId,
fallback?)` returns a slot's state on the active session along with
what it resolves to (`{ fill, props, hidden, resolved }`), for frames
which must collapse rather than render an empty container.

The `@minddrop/ui-views` package (`ui/views`, depending on
`@minddrop/views` only) renders them: `<Slot id="sidebar"
fallback={...} />` shows the fill the active session of the
surrounding view area names (the main area outside of a pane), falls
back to the given state or fill id when the session names none or an
unregistered one, and renders nothing while the slot is hidden.

The desktop app owns the sidebar frame (`Sidebar` at the persisted
`AppUiState.sidebarWidth`, the resize handlers and the nav toolbar width
dispatch), renders the slot inside it and renders no frame at all while
the sidebar is hidden, with `AppSidebar` reduced to content and
registered as the default `sidebar` fill by `registerSidebars`. Fills
are content only, so every sidebar shares the one width.

## Data views are independent entities

Data views are first-class entities, not children of a database, because
a data view is used in three distinct contexts, only one of which is
database-owned:

1. **Database browse views** — the tabs shown when browsing a database
   directly (`DatabaseView` in `features/databases`).
2. **Embedded views** — a layout can contain a `view` design element,
   rendering a data view inside an entry (e.g. a collection property's
   entries shown as a table on the entry's page). Rendered via
   `DataViewRenderer`.
3. **Independent / entry-virtual views** — data views not tied to a
   database's browse UI, such as the per-entry virtual views generated
   for collection properties.

If data views were structurally nested inside databases, contexts 2 and
3 could not exist.

## Ownership and persistence

The data-views package persists standalone data views as `.view` files in
the workspace `views/` directory, loaded at startup by
`DataViews.initialize` (which also resolves durable item references and
indexes each view's `references`). Whatever entity _owns_ a data view
beyond that is responsible for persisting it, and loads it into the
`DataViewsStore` at startup as a **virtual** data view ("virtual" =
persisted by its owner, not by the data-views package):

- **Database browse views** are stored as individual files in the
  database's `.minddrop/views/` directory (stripped of
  `dataSource`/`virtual`/`owner`). The config's `Database.views` lists
  their IDs in display order, normalized against the view files at load
  time. `loadDatabaseViews` rehydrates them (re-deriving `dataSource`
  from the owning database); `writeDatabaseView` and
  `removeDatabaseViewFile` persist changes back, driven by the
  `data-views:data-view:created/updated/deleted` event handlers in
  `packages/databases`, which also maintain the config's ID list.
- **Entry collection views** are generated per entry for collection
  properties (`virtualViewId(entryId, propertyName, layoutId)`), with
  per-entry saved state under `entry.metadata.views` keyed
  `propertyName:layoutId`.

The same owner-persisted shape applies to **database designs** in
`designs-next`: they are stored as individual files in the database's
`.minddrop/designs/` directory (stripped of `owner`), with their IDs
listed in the config's `Database.designs`. `loadDatabaseDesigns`
hydrates them into the designs store with the database as `owner`, and
`writeDatabaseDesign`/`removeDatabaseDesignFile` persist changes back,
driven by the `designs-next:design:created/updated/deleted` handlers in
`packages/databases`, which also maintain the config's ID list. Designs without an owner are persisted to their
own design files instead. `Database.defaultDesigns` pins the design per
layout context (`Databases.getDefaultDesign` resolves pinned → first
owned design of the context's base type → null).

## Per-view layout configuration

"Which layout should entries use in this view" is view-rendering
configuration, so it lives in **view options**, owned by the data view:

- Gallery: `options.cardLayoutId`.
- Notebook: `options.layoutOverrides[databaseId]` with
  `listLayoutId`/`pageLayoutId` (keyed by database because a notebook can
  aggregate entries from multiple databases).

Set via the data view type's options menu (`DatabaseLayoutSelectionMenu`)
and passed as the `layoutId` prop to `DatabaseEntryRenderer`, whose
resolution cascade is: explicit `layoutId` → database default
(`Databases.getDefaultLayout`: pinned `defaultLayouts[type]` → first
layout of the type in the database's design → null).

## Known issues / cleanup

- Two additional override mechanisms exist as write-only plumbing that
  nothing renders from: `Database.viewLayouts[viewId]` and
  `entry.metadata.viewLayoutOverrides[viewId]`. `viewLayouts` (with
  `set/clearDatabaseViewLayout`) is **redundant**: it duplicates per-view
  layout choice on the database side, against the ownership rule — view
  options are the consumed mechanism and already persist inside
  `Database.views`. It predates the figma-design-studio WG (carried over
  from `viewDesigns` by the rename) and is deliberately left in place for
  now. The entry-level override needs a decision: real feature (then
  something must consume it) or delete. See the figma-design-studio plan,
  open question 8.
- A **full data views audit** is planned later — covering the redundant
  override mechanisms above and the broken load/write path. Do not build
  new features on `viewLayouts` in the meantime.
- Changing a database's design does not touch per-view layout overrides;
  overridden views keep rendering the old design's layouts (layout
  resolution is global across designs). Handled by the future remap
  dialog WG via an event mechanism: the migration UI produces an
  `oldLayoutId → newLayoutId` map, dispatched as an event on save. View
  packages listen and remap their own layout configs for views sourcing
  that database (the databases package only remaps what it owns, i.e.
  entry `metadata.viewLayoutOverrides`).
- The database view load/write path is currently broken by the data views
  object-store conversion (`getAll` returning a map) — pre-existing, see
  `dev/docs/bugs.md`.
- "Virtual" does double duty for database browse views and entry
  collection views, which have quite different lifecycles; a clearer term
  for "owner-persisted" may be worth adopting.
- Deliberately retained view-era names (`.view` extension, `views/` data
  dir, `ViewDataSource` types) are listed in `dev/docs/gotchas.md`.
