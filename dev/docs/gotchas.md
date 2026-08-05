# Gotchas & Notes

Non-obvious behaviors, deferred concerns, and traps worth knowing before
touching the related code. Organised by package/feature. Add entries as
they come up; delete entries when the underlying code changes make them
obsolete.

## packages/data-views

### Some view-era names are deliberately retained after the data-views split

The views / data-views split (2026-08-05) renamed events
(`data-views:data-view:*`), the ID prefix (`data-view_<uuid>`), fixtures,
and i18n keys (`dataViews.*`), but deliberately kept: the on-disk `.view`
file extension and `views/` workspace data directory
(`ViewFileExtension` / `ViewsDirName` in `packages/data-views`), and the
`ViewDataSource` / `ViewDataSourceType` type names ("DataViewDataSource"
would be awkward). Don't "fix" these to data-view naming without a
deliberate decision.

## packages/databases

### The implicit Title property's name is a translated identifier

`withImplicitTitleProperty` names the implicit entry title property with
`i18n.t('properties.title.name')`, but that name doubles as an
**identifier** in two places that don't translate:
`entryDisplayPropertyValues` hardcodes `Title: entry.title` as its
values-map key, and `database.designPropertyMap` persists the name
inside saved mappings.

In en-GB everything lines up because the translation is "Title". If
another locale is ever added, a translated implicit name would stop
matching the hardcoded values key and any previously persisted mappings.
The fix at that point is to treat `Title` as a stable identifier and add
a separate translated display `label` to the property schema (updating
the property mapping UI to render labels over names).

### Pending entry metadata is keyed by database path, not entry

`updateEntryMetadata` debounces writes into a pending map keyed by the
database's **path** (`pendingUpdates: Map<databasePath, …>`). A metadata
write queued in that window and then a **database rename** (which changes
the database path) leaves the pending entry stranded under the old path:
when its debounce timer fires it flushes to the pre-rename location.

Rare in practice — renames are deliberate user actions, not concurrent
with metadata edits — so it is not handled. Entry metadata is explicitly
"safe to lose" supplementary state (`embeddedViewConfigs`,
`viewLayoutOverrides`), so a dropped pending write is not data loss. If it
ever needs solving, move the pending map entry from the old path key to
the new one during the rename (no primitive for this exists yet).

### viewLayoutOverrides must not be keyed by virtual view IDs

`setEntryViewLayoutOverride` persists `viewLayoutOverrides[viewId]` into
the durable database metadata file. The API currently has **no callers**,
but the planned per-view layout override feature must not call it with
virtual view IDs: those embed the entry's UUID
(`entryId:propertyName:layoutId`), which is regenerated on every SQL
index rebuild, so the persisted key would go permanently stale. When
wiring the feature up for embedded views, key overrides by a stable
composite (like `embeddedViewConfigs` does with
`propertyName:layoutId`) instead of the raw view ID.

### Future visible root directories must become reserved database names

Durable item references are natural workspace-relative addresses
(`Books/Book.md`, `Books`), disambiguated by matchers that check the
first path segment against existing database directories. Databases
are currently the only visible directories at the workspace root, so
there is no overlap. If another feature ever claims a visible root
directory as its address space (e.g. `Widgets/`, `Spaces/`), that
directory name must be rejected as a database name (create and
rename validation) or the address spaces become ambiguous.

### Offline entry renames lose their references

Entry identity is path-based on disk: a file renamed while the app
is closed cannot be recognised as the same entry (entry files carry
no ID), so background sync treats the rename as a delete plus a
create. The old entry's collection memberships and view references
are cleaned up as a deletion, and the freshly minted entry starts
unreferenced. This is inherent to the ID-free entry file design.

## packages/designs

### Layout lookups are linear scans by design — do not denormalise

`LayoutsStore` derives layouts from `DesignsStore` on demand
(`getLayout` scans `designs × layouts`). This is deliberate: the Design
is the single source of truth and a separate layouts store would need
write-through sync on every design mutation (including whole-design
saves from the studio) — a standing desync risk for an unmeasurable win.

Perf context (as of the figma-design-studio WG): the entry-rendering hot
path (`DatabaseEntryRenderer`) resolves layouts non-reactively inside a
`useMemo`, so the scan runs once per entry mount. Even hundreds of
entries amount to microseconds; the real cost of large views is
rendering N copies of the layout element tree, not the lookup.

If profiling ever shows lookups matter: add an internal
`Map<layoutId, Layout>` index inside `LayoutsStore`, rebuilt lazily on
`DesignsStore` changes. O(1) lookups, same public API, nothing
authoritative to desync. Do **not** reach for a separate store.

### `useLayout`/`useLayouts` subscribe to ALL designs

The reactive layout hooks subscribe to the entire `DesignsStore`, so any
design mutation re-renders every subscriber. Fine for their current
call sites (browser/studio lists). **Do not** casually switch
`DatabaseEntryRenderer` to `useLayout` to get live-updating entries:
hundreds of mounted entries would re-render on every studio edit
(each element mutation saves the design). If live entry updates are
ever wanted, use a per-ID selector subscription (only re-render when
the specific layout's reference changes), not the all-designs hooks.

## packages/i18n

### Invalid `t()` keys can crash tsc, not just error

Calling `t()` with a key missing from the generated union (especially
with an interpolation options argument) can crash the TypeScript
compiler with `Debug Failure. No error for last overload signature`
instead of reporting a normal error — a known i18next typing bug. The
crash reports no file name. The same crash fires when passing the
overloaded `t` function into a parameter typed `(key: string) => string`
(type such parameters as `(key: TranslationKey) => string` instead).

To locate the offending file, request per-file semantic diagnostics via
the TS API in a try/catch loop over the program's source files (a tsc
run dies on the first crash without naming the file).

## features/desktop-app

### Don't gate window keydown shortcuts on `defaultPrevented`

`initializeSelection` registers a window keydown handler that calls
`event.preventDefault()` for Delete/Backspace whenever focus is
outside an input (even with an empty selection), and Escape can
arrive pre-prevented too. Feature-level shortcut handlers registered
later must therefore NOT skip on `event.defaultPrevented`. Open
popovers are not a concern: base-ui dismissal `stopPropagation()`s
Escape, so it never reaches window handlers while a popup consumes
it.

## features/views

### Breadcrumb trails are snapshots taken at open time

A view's `breadcrumbs` (`ViewDescriptor[]` on `OpenViewEventData`) are
composed by the dispatcher when the view is opened, so an ancestor's
title/icon in a trail can go stale after e.g. a rename. Only
tab-persisted trails are patched on `UpdateViewEvent` (via
`applyViewUpdate`); an open view area keeps rendering its descriptor
snapshot until the view is reopened or its tab state is re-applied.

### View components must size themselves with `height: 100%`

The view area container rendered by `ViewRenderer` is not a flex
container, so a view's root element cannot rely on `flex: 1` to fill
the content area — it sizes to content instead (only noticeable once
inner percentage/flex chains silently collapse). Give view roots
`height: 100%` (see `.design-studio`, `.space-view`,
`.space-edit-mode`).

## ui/primitives

### `ScrollArea` needs a `getAnimations` polyfill in happy-dom tests

The base-ui scroll area polls `Element.getAnimations` on a timer,
which happy-dom does not implement — tests rendering `ScrollArea`
throw unhandled `viewport.getAnimations is not a function` errors
after teardown. Polyfill it in the package's test setup
(`Element.prototype.getAnimations = () => []`, see
`features/spaces/src/test-utils/setup-tests.ts`).

### `useForm` field props don't typecheck against `TextField`

`useForm`'s `fieldProps` carry `error?: string` (validators return
plain message strings), but `TextField`'s `error` prop is typed
`TranslationKey` — spreading `{...fieldProps.x}` onto a `TextField`
fails the typecheck (see `CreateDataViewForm`). Existing forms live
with the error; a real fix means deciding whether form validators
return translation keys or `TextField` accepts plain strings.

### `TranslatableNode` treats strings as i18n keys

Props typed `TranslatableNode` (Tooltip `title`/`description`, `Text`
`text`, menu labels, ...) translate string values internally — passing
pre-translated or dynamic text as a string either fails the type check
or double-translates. Pass the raw `TranslationKey` when there is one;
wrap already-built strings in a fragment (`<>{value}</>`) to render
them as-is.
