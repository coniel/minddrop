# Gotchas & Notes

Non-obvious behaviors, deferred concerns, and traps worth knowing before
touching the related code. Organised by package/feature. Add entries as
they come up; delete entries when the underlying code changes make them
obsolete.

## packages/designs

### Layout lookups are linear scans by design — do not denormalise

`LayoutsStore` derives layouts from `DesignsStore` on demand
(`getLayout` scans `designs × layouts`). This is deliberate: the Design
is the single source of truth and a separate layouts store would need
write-through sync on every design mutation (including whole-design
saves from the studio) — a standing desync risk for an unmeasurable win.

Perf context (as of the design-layout-model WG): the entry-rendering hot
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
