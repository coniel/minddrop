# Gotchas & Notes

Non-obvious behaviors, deferred concerns, and traps worth knowing before
touching the related code. Organised by package/feature. Add entries as
they come up; delete entries when the underlying code changes make them
obsolete.

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

## ui/primitives

### `TranslatableNode` treats strings as i18n keys

Props typed `TranslatableNode` (Tooltip `title`/`description`, `Text`
`text`, menu labels, ...) translate string values internally — passing
pre-translated or dynamic text as a string either fails the type check
or double-translates. Pass the raw `TranslationKey` when there is one;
wrap already-built strings in a fragment (`<>{value}</>`) to render
them as-is.
