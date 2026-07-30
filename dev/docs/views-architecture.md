# Views Architecture

How views relate to databases, entries, and designs, and why they are
modelled the way they are.

## Core principle: views are independent entities

Views are first-class entities in `@minddrop/views`, not children of a
database. Each view has:

- a **type** (table, gallery, notebook, board, ...) registered via
  `ViewTypes`; the type contributes the rendering component and an
  options menu.
- a **`dataSource`** reference (e.g. `{ type: 'database', id }`) naming
  where its entries come from.
- type-specific **`options`** (the view owns its own rendering
  configuration).

They are kept separate because a view is used in three distinct contexts,
only one of which is database-owned:

1. **Database browse views** — the tabs shown when browsing a database
   directly (`DatabaseView` in `features/databases`).
2. **Embedded views** — a layout can contain a `view` design element,
   rendering a view inside an entry (e.g. a collection property's entries
   shown as a table on the entry's page). Rendered via `ViewRenderer`.
3. **Independent / entry-virtual views** — views not tied to a database's
   browse UI, such as the per-entry virtual views generated for
   collection properties.

If views were structurally nested inside databases, contexts 2 and 3
could not exist.

## Ownership and persistence

The views package persists nothing itself. Whatever entity _owns_ a view
is responsible for persisting it, and loads it into the `ViewsStore` at
startup as a **virtual** view ("virtual" = persisted by its owner, not by
the views package):

- **Database browse views** are stored on the database config
  (`Database.views`, stripped of `dataSource`/`virtual`, plus
  `Database.viewOrder` for tab ordering). `loadDatabaseViews` rehydrates
  them (re-deriving `dataSource` from the owning database);
  `writeDatabaseViews` persists changes back, driven by the
  `database-view-created/updated/deleted` event handlers in
  `packages/databases`.
- **Entry collection views** are generated per entry for collection
  properties (`virtualViewId(entryId, propertyName, layoutId)`), with
  per-entry saved state under `entry.metadata.views` keyed
  `propertyName:layoutId`.

## Per-view layout configuration

"Which layout should entries use in this view" is view-rendering
configuration, so it lives in **view options**, owned by the view:

- Gallery: `options.cardLayoutId`.
- Notebook: `options.layoutOverrides[databaseId]` with
  `listLayoutId`/`pageLayoutId` (keyed by database because a notebook can
  aggregate entries from multiple databases).

Set via the view type's options menu (`DatabaseLayoutSelectionMenu`) and
passed as the `layoutId` prop to `DatabaseEntryRenderer`, whose
resolution cascade is: explicit `layoutId` → database default
(`Databases.getDefaultLayout`: pinned `defaultLayouts[type]` → first
layout of the type in the database's design → null).

## Known issues / cleanup (as of the figma-design-studio WG)

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
- A **full views audit** is planned later — covering the redundant
  override mechanisms above, the broken load/write path, and the
  "virtual" naming. Do not build new features on `viewLayouts` in the
  meantime.
- Changing a database's design does not touch per-view layout overrides;
  overridden views keep rendering the old design's layouts (layout
  resolution is global across designs). Handled by the future remap
  dialog WG via an event mechanism: the migration UI produces an
  `oldLayoutId → newLayoutId` map, dispatched as an event on save. View
  packages listen and remap their own layout configs for views sourcing
  that database (the databases package only remaps what it owns, i.e.
  entry `metadata.viewLayoutOverrides`).
- The database view load/write path is currently broken by the views
  object-store conversion (`Views.Store.add` removal) — pre-existing,
  unrelated to the figma-design-studio WG.
- "Virtual" does double duty for database browse views and entry
  collection views, which have quite different lifecycles; a clearer term
  for "owner-persisted" may be worth adopting.
