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
(`ViewRenderer`, view areas, tabs). The built-in data view type packages
live in the top-level `data-views/` workspace directory (board-view,
gallery-view, notebook-view, table-view).

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

- **Database browse views** are stored on the database config
  (`Database.views`, stripped of `dataSource`/`virtual`, plus
  `Database.viewOrder` for tab ordering). `loadDatabaseViews` rehydrates
  them (re-deriving `dataSource` from the owning database);
  `writeDatabaseViews` persists changes back, driven by the
  `data-views:data-view:created/updated/deleted` event handlers in
  `packages/databases`.
- **Entry collection views** are generated per entry for collection
  properties (`virtualViewId(entryId, propertyName, layoutId)`), with
  per-entry saved state under `entry.metadata.views` keyed
  `propertyName:layoutId`.

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
