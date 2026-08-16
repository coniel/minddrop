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

### Last Modified means last modified by MindDrop

`setTimestampProperties` is only reached from `createDatabaseEntry`,
`updateDatabaseEntry` and `updateDatabaseEntryProperty`, so an entry edited
in another editor keeps whatever the app last wrote. The value lags until
the entry is next edited in the app.

This is deliberate. The obvious fix, writing the file's mtime into the
property when a change is detected, would be wrong often enough to matter:
mtime says when the bytes landed on this disk, not when someone edited the
entry. Dropbox and iCloud generally preserve the original, `git checkout`
and `rsync` without `-t` stamp the file on arrival, and nothing in the
filesystem says which case you are in. Persisting a guess into a
user-visible value that later syncs to other devices makes the error
permanent and indistinguishable from an authoritative value, where lagging
is at least a known, bounded limitation.

Users wanting external edits reflected are responsible for having their
editor maintain the property.

Note this concerns the displayed value only. External edits **are**
detected, by content hash (see below).

### Entry change detection compares content, never timestamps

`backgroundSyncDatabases` diffs entries on `content_hash`. An earlier
version compared `lastModified`, which silently missed every external edit
in a database defining a `last-modified` property, since that property is
only updated by the app. Renames and deletes were unaffected, being
detected by path, which made the gap easy to miss.

Do not reintroduce a timestamp comparison here. mtime is also unsuitable, on
top of the reasons above, because a restore or checkout moves it without the
content changing, which would re-index the whole workspace.
### Multiple formatted-text properties cannot round-trip byte-exact

`writeDatabaseEntry` merges into the entry's existing frontmatter, so
unmodelled keys, comments and YAML formatting survive a write. The
**body** has no such guarantee when a database declares more than one
`formatted-text` property.

In that case `getFormattedTextPropertiesFromMarkdown` splits the body on
`##` headings, using the property name as the heading, and
`markdownEntrySerializer.serialize` writes the sections back in
property-map order. So content before the first heading and headings not
matching a schema property are folded into the preceding section, and
section order follows the property map rather than the original file.

Databases with a single `formatted-text` property (the common case) are
unaffected, since the whole body is that property's value.

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

## packages/editor

### A container's markers are drawn by the editor, not by the block

List items and quotes are ancestry frames on a block rather than element
types of their own, so a list item is a `paragraph` carrying a `list-item`
frame. Bullets, numbers, checkboxes and quote bars are drawn by
`BlockFrames` from data resolved across the whole document, since a block
cannot tell on its own whether it opens its container or which number an
ordered item takes. That resolution is provided as context and memoised
against a signature of the document's frames, so a frame change has to
show up in `resolveBlockFramesSignature` or the markers will not redraw.

### Block IDs are session scoped and never reach the markdown

`withBlockIds` gives every top level block an `id`, but the content is
stored as markdown, which has nowhere to put it. The IDs are minted when
the markdown is parsed and are regenerated from scratch on every load, so
they are only good for in-session concerns (hover tracking, selection
sets, drag payloads, React keys). Anything that has to survive a reload —
block links, anchors, per-block comments — cannot be built on them.

IDs stay out of the markdown because each element type's `toMarkdown`
reads only the properties it needs, so nothing enforces it: a
serializer which stringifies whole elements would leak them.

### The block gutter is portalled and positioned against the viewport

`BlockGutter` renders into `document.body` and positions itself with
`position: fixed` from the hovered block's viewport rect, because the
editor is routinely rendered inside a container which clips its overflow
(cards, panels, views). Positioning it within the editor meant those
ancestors clipped it away entirely.

Two consequences. Viewport coordinates go stale on scroll, so
`useHoveredBlock` drops the hovered block on any scroll and re-measures
on the next pointer move — the controls briefly disappear when scrolling
with the pointer held still. And where the editor has no margin of its
own, the controls are drawn over whatever sits beside it, which is why
they carry their own surface and shadow.

Note that React portals still propagate events up the React tree, not
the DOM tree, so the gutter's clicks reach the editor's ancestors
despite living in the body. It stops propagation itself for that reason.

### A block selection is Slate's own selection, snapped to whole blocks

There is no separate list of selected blocks. A block selection is a
Slate selection which covers whole top level blocks, and `withBlockSelection`
expands any selection crossing a block boundary out to the blocks' edges.
Delete, cut, copy and paste therefore keep working through Slate's own
handling, and the editor never gives up DOM focus.

The consequences worth knowing:

- Non-contiguous selection is impossible, which markdown could not
  express anyway.
- The snap runs in `onChange`, not in `apply`. Slate's own transforms set
  exact expanded selections which have to be left alone, and `onChange`
  only runs once the selection has settled.

### Which blocks are selected is held in the app's selection, not the editor

The Slate selection above says which blocks a selection _covers_; whether
those blocks are selected at all is held in `@minddrop/selection` as items
of type `editor-block`, keyed by the block's session ID and carrying a
reference to the editor they came from.

This is what makes selections exclusive across the app: selecting blocks
in one editor, or a card anywhere else, deselects the first editor's
blocks with no cross editor wiring. It is also what lets blocks be dragged
out of an editor, through the serializer registered for the type.

It also settles an ambiguity which would otherwise need a flag: a
selection covering exactly one block is what both Escape and a triple
click produce. Escape registers items, a triple click does not, so the
two are told apart without inspecting the range.

The pairing is kept by `selectBlocks`, which sets both, and by
`withBlockSelection`'s `onChange`, which drops the items as soon as the
Slate selection stops covering whole blocks.

### Blocks learn they are selected through context, not the Slate selection

`createRenderElement` marks a block with `data-block-selected` from the
`BlockSelectionContext`, which carries the IDs of the editor's selected
blocks.

It cannot read the app's selection directly in each block: slate-react
memoises an element against its _own_ intersection with the editor's
selection, which does not change when a block is selected or deselected in
the app, so the block would never repaint. Context updates cross memo
boundaries, which is exactly what is needed here.

### Block dragging hangs off `Editable`'s own drag props

`Editable` handles `dragover` and `drop` itself, inserting the dropped data as
content at the drop point. slate-react checks the handler it was passed first and
skips its own handling when that handler returns true or prevents default
(`isEventHandled`), so block dragging is wired through `Editable`'s `onDragOver`
and `onDrop` props rather than a listener on an ancestor — an ancestor's handler
runs _after_ Slate's, by which point the content has already been inserted.

The handlers return `false` for any drag which did not start from a block handle,
which is what leaves dragging selected text alone.

A trap in the gutter: preventing the default mousedown action stops a native
drag ever starting, so the `preventDefault` which keeps the cursor in the editor
is on the insert button rather than on the gutter as a whole.

### WebKit will not drag an unselectable element

The app runs in WKWebView, where `draggable` on its own is not enough. A drag
handle also needs, in CSS:

- `user-select: auto` — WebKit refuses to start a drag on an element which
  cannot be selected, and drag handles commonly sit inside chrome which sets
  `user-select: none`. This alone made the block drag handle completely inert.
- `-webkit-user-drag: element` — WebKit starts drags on elements which are
  neither links nor images only once they are marked draggable in CSS too.

Both are no-ops in Chromium, so a handle which works in a browser can still be
dead in the app. Neither is testable in jsdom, which has no drag machinery at
all, so the tests around a drag source prove the handlers are wired up and
nothing more.

Also worth knowing: an exception thrown inside a `dragstart` handler cancels the
drag silently, which looks identical to the CSS problem above.

The drag itself goes through `useDraggable`, which serializes the app's
selection onto the dataTransfer, so blocks can be dropped on anything in the app
which accepts them rather than only back into their own editor.

### Hiding a drag's source without cancelling the drag

Hiding the gutter while its handle is being dragged takes more care than it
looks:

- It must not be unmounted. Removing a drag's source element part way through
  aborts the drag.
- It must keep its hit testing. `pointer-events: none` on the source cancels the
  drag in WebKit, so `opacity` alone does the hiding.
- Nothing may disturb the source before the `dragstart` handler returns, which
  is when the browser snapshots the drag image, so the state driving the hiding
  is set at the very end of the handler.
- `drop` fires _before_ `dragend`. Ending the drag state on the drop shows the
  controls again while the drag is still running, flashing them up against where
  the dragged block used to be, so only `dragend` ends it — and it also drops
  the hovered block, the block having moved out from under the controls.

## packages/file-system

### The workspace watcher only covers workspaces open at startup

`startFileSystemWatcher` is called once at the end of
`initializeDesktopApp` with the paths of the workspaces loaded at that
point. A workspace added during the session is not watched until the
app restarts. Nothing surfaces when this happens: external changes to
that workspace are simply invisible, exactly as they were before the
watcher existed.

### Self-write detection only covers text writes

`Fs.writeTextFile` and `Fs.writeTextFiles` record a content hash, which
is how the watcher recognises its own write and stays quiet about it.
`Fs.writeBinaryFile` does not, so the app's own media writes are
dispatched as ordinary changes. That is the recoverable direction (the
owning package re-reads a file it already has), but a package reacting
expensively to binary changes would want to know.

Note the detection compares content rather than timing. An
ignore-window keyed on "we wrote this path N ms ago" would silently
swallow a genuine external change landing inside the window, which is
both invisible and unreproducible.

## packages/sql

### Renderer SQL reads resolve asynchronously despite synchronous typings

`Sql.get`/`Sql.all` are typed synchronous, and the Bun process adapter
(`bun:sqlite`) really is. But the renderer adapter forwards reads over
Electrobun RPC, whose `rpc.request.*` calls return Promises — so in the
renderer `Sql.all` returns a Promise typed as `T[]`, and `.map`-ing the
"rows" throws. Existing readers never hit this because they all execute
in the Bun process behind dedicated RPC adapters (search indexing,
databases background sync). Renderer-side SQL reads must `await` the
result (see `sqlQueryEntries`); awaiting is a no-op under the
synchronous adapters, so one code path serves both.

## packages/stores

### `Events._clearAll()` breaks store hydration for the rest of a test run

`createKeyValueStore`/`createObjectStore`/`createArrayStore` register a
`stores:hydrate` listener once, when the store module is first loaded.
`Events._clearAll()` removes it, and nothing ever registers it again, so
every later `hydrate()` call hangs: it dispatches its request and waits
forever for a response it can no longer receive.

This bites any test suite that both calls `Events._clearAll()` in cleanup
and awaits something which hydrates a store. It presents as a timeout in
whichever hook or test awaits the hydration, or — if the hydrating call
is not awaited — as the code after it silently never running.

In such a suite, remove only the listeners the tests registered rather
than calling `_clearAll()`, and register a stand-in for the platform
layer that answers `stores:hydrate-request` with a `stores:hydrate`
event (see `ui/theme/src/test-utils/initialize-tests.ts`). Note that
listener IDs are unique per event, so stale test listeners must still be
removed or they will shadow the next test's registration.

## packages/i18n

### New locale keys need the resource types regenerated by hand

`TranslationKey` is derived from `src/i18n-resources.d.ts`, which is
generated from the locale JSON rather than read from it. Adding a key
to `src/locales/en-GB.json` therefore does nothing on its own: the key
stays outside the union and every use of it fails to typecheck, with
an error that reads as though the key were misspelled ("Did you mean
`dataViews.canvas.name`?") rather than ungenerated.

Regenerate after editing a locale file:

```
bun packages/scripts/generate-i18n-types.ts
```

It is a Bun script (`import { Glob } from 'bun'`), so `npx tsx` fails
on the import. No package script wraps it, and nothing in the build
runs it, so the generated file has to be committed alongside the
locale change.

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

## packages/queries

### Query results are event-fresh, not clock-fresh

`useQueryResults` / `useQueryNodeResults` re-run only on data
events (source database SQL syncs, reindexes, background syncs)
and query document edits. Relative date values ("Today",
"Last N days") are resolved against `now` at run time, so time
passing never triggers a re-run: an entry aging out of a
"Last 7 days" window, or "Today" crossing midnight, stays in the
results until the next data event or remount. A possible fix is
scheduling a re-run (e.g. at the next local midnight) whenever
the compiled graph contains relative date values.

### Package typecheck fails on unrelated ui/icons errors

`npx tsc --noEmit -p packages/queries/tsconfig.json` reports errors
in `ui/icons` (missing `--jsx` for `content-icons.min.tsx`, a
symbol-to-string conversion) pulled in through the dependency
chain. They pre-date any queries work (verified on 2026-08-10
against earlier commits) and do not indicate a problem in the
queries package; the same files typecheck fine through
`features/queries`, whose tsconfig sets `jsx`.

## ui/theme

### Dark mode image dimming thresholds are provisional

`classifyImageBrightness` decides which images the dark mode
treatments apply to, using two fractions measured server side by
`apps/desktop-electrobun/src/bun/imageStats.ts`: `brightFraction`
(share of pixels above luminance 0.7, threshold 0.06) and
`nearWhiteFraction` (above 0.85, threshold 0.4).

`brightFraction` deliberately measures bright _area_ rather than
average luminance. An earlier mean-luminance rule missed obviously
glaring photos, because a bright subject against dark surroundings
averages out to a middling value: a sunlit photo that reads as bright
measured a mean of 0.45 while having 23% of its pixels above 0.7. The
feature exists to stop a bright image hurting in dark mode, so a dark
image with a bright patch should still be dimmed.

The 0.06 threshold was calibrated against a single image and is
expected to need revisiting once there is more variety to test with.
False positives are cheap here (a slightly dimmed image), false
negatives are the actual failure, so err low. To re-measure, run the
analysis from `imageStats.ts` over sample images from within
`apps/desktop-electrobun` (sharp resolves there).

Note also that dimming is a whole-image `brightness()` multiply, so a
mostly-dark image tripping the threshold on one bright patch has its
shadows darkened too. Only-touch-the-highlights needs a tone curve,
which means an SVG filter, which is too slow (see below).

### Dark mode image effects must use native CSS filter functions

`images.css` dims with `brightness()` and inverts with
`invert()`/`hue-rotate()`. An SVG `filter: url(#...)` reference gives
a much better tone curve (a gamma curve darkens highlights while
leaving shadows intact, where `brightness()` scales everything) but
Chromium rasterises reference filters on the CPU on every repaint. On
a transformed element such as `ImageViewer`, that re-runs per frame
during zoom and pan: images take seconds to appear and vanish while
panning. Do not reintroduce one for image treatments.

## ui/primitives

### Grouped Combobox lists are never virtualized

`Combobox` virtualizes automatically once a flat `items` list passes
`VIRTUALIZE_THRESHOLD` (50), but the check is
`!groups && items.length > VIRTUALIZE_THRESHOLD`, so passing `groups`
opts out entirely no matter how many items the groups hold. Adding a
group heading to an existing picker therefore silently drops
virtualization. Fine for small lists (collection pickers, data
sources), but don't reach for `groups` on a list that can grow to
hundreds of entries without checking the render cost first.

## features/designs

### `LayoutAutoFocusContext` is deliberately single-purpose

The layout render path uses many small single-purpose contexts
(`LayoutIdContext`, `LayoutRenderContext`, `DesignPreviewContext`,
`LayoutAutoFocusContext`) rather than one render-options bag. The
autofocus context was kept specific on purpose (decided in the
entry-editor-autofocus WG): with a single consumer it is unclear
whether a generic renderer-to-element signal mechanism should use
claim-once, broadcast, or element-targeted semantics. When a second
one-shot layout signal appears, generalise then (e.g. a named claim
token context) instead of adding another bespoke context.

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

## features/queries

### Builder canvas tests report unhandled SQL rejections

Rendering `QueryBuilderCanvas` in tests mounts the results node's
entries list, whose `useQueryNodeResults` effect calls
`runQueryNode` and rejects with "SQL database not initialized"
(the mock file system provides no SQL connection). The tests
themselves pass, but vitest reports the rejections as unhandled
errors at the end of the run (8 across the suite as of
2026-08-10). Mock `Queries.useNodeResults` (alongside the existing
`useNodeCounts` mock) to silence them when adding builder tests.

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

## data-views/canvas

### An entry node cannot be removed from the canvas by dropping its node

`reconcileNodes` gives **every** collection entry a node, auto-placing
any entry that has none below the placed ones. Filtering an entry node
out of the saved view data therefore does nothing useful: the next
render re-appends it at the bottom of the canvas. The symptom is a
"delete" that appears to fling the selected cards to the bottom of the
canvas rather than remove them.

Removing a card means taking its entry out of the collection
(`Collections.removeItems`), which is what the selection toolbar and
Delete do. Holding shift escalates to `DatabaseEntries.delete`, behind
a confirmation, which trashes the files. Both mirror the actions in
`DatabaseEntryOptionsMenu`.

Non-entry nodes pass through reconciliation untouched, so if the
canvas ever grows node types that are not backed by an entry, those
_can_ be removed by dropping the node, and the delete path will need
to branch on `node.type`.

### `CanvasView` has no test file, so its canvas wiring is unverified

`CanvasView` is the largest consumer of `ui/canvas` and has no test of
its own. Everything it does with the canvas is prop wiring:
`onNodesFrameChange`, `onSelectionDelete`, `selectionToolbar`, the
align actions, and the persistence handlers behind them. Wiring of
that shape typechecks perfectly while doing nothing at all — a
callback attached to the wrong prop, never passed, or passed a stale
closure looks identical to a correct one until it is run.

Several of the contracts it depends on are also easy to break from
the `ui/canvas` side without anything failing here:

- group drags report through `onNodesFrameChange`, never per-node
  `onFrameChange` (see the ui/canvas entry) — a consumer that quietly
  loses this handler silently stops persisting group moves, and the
  nodes snap back on release
- connection selection lives in the canvas store, so the toolbar,
  the layer's styling and deletion all read the same state; a
  consumer reintroducing local selection state gets two sources of
  truth that disagree
- alignment reads the canvas's _registered_ frames, not the saved
  nodes, because only the registry carries measured auto-heights

A harness is not cheap, which is why there isn't one: it needs a
collection with entries, a persisted data view, and database entry
rendering, all inside a mounted `CanvasProvider`. Worth building
before the next change to this file's selection wiring rather than
after. The behaviour to cover is listed in the (now deleted)
`canvas-selection-consumers` plan: lasso two entry nodes and drag the
box, expecting one persisted update with both frames; lasso two
connections and apply a style change, expecting it on both; Delete
with a node selection.

Until then the mechanisms are covered one level down, in
`ui/canvas`'s own tests, and the wiring is covered only by typecheck.

## ui/canvas

### Canvas focuses its viewport on any mousedown, breaking blur-dismissed overlays

With the default `shortcutScope="focus"`, `Canvas` calls
`viewport.focus()` in its mousedown handler so focus-scoped keyboard
shortcuts receive keys. The handler runs for every mousedown that
bubbles to the viewport, including presses inside content rendered on
the canvas.

Any overlay inside the canvas that dismisses itself on blur of an
autofocused input (the searchable picker pattern) therefore breaks:
pressing one of its options moves focus to the viewport, the input
blurs, and the overlay unmounts before the click can deliver the
selection. `preventDefault` on the overlay's mousedown does not help,
since the viewport handler calls `focus()` explicitly.

Such overlays must call `stopPropagation()` in their mousedown handler
(see `QuerySourcePicker` in `features/queries`). The canvas view's
`DataViewNewEntryPicker` / `DataViewEntryPicker` flows share this trap.

### Group drags snap to the grid but never to other objects

`CanvasSelectionBox` snaps the dragged group's bounds origin to the
grid when `snapToGrid` is on, but does not apply object snapping even
when `snapToObjects` is. `getObjectSnap` aligns a frame against a list
of other frames, and for a group the obvious target list includes the
selection's own members, which would snap the bounds to the nodes
inside it. Doing it properly means excluding every selected node from
the targets and aligning the union bounds rather than a node frame.

A single-node drag is unaffected and still snaps to both.

### A group drag reports through `onNodesFrameChange`, not `onFrameChange`

Moving a multi-node selection deliberately does not fire each node's
own `onFrameChange`. Consumers typically implement it as a read-modify
-write against a snapshot captured in the closure, so N calls in one
tick would each overwrite the last, and only one node would move.

`Canvas` takes `onNodesFrameChange` instead, called once on group-drag
mouseup with every moved node's frame, so the consumer applies them in
a single update. A consumer that supports multi-selection must handle
it; implementing only `onFrameChange` silently drops group moves.

## ui/primitives

### Base UI render-prop spreads silently overwrite own handlers

Components passed to a Base UI `render` prop receive Base UI's
merged props (its internal handlers plus `useButton` wrappers,
which always include `onClick`/`onMouseDown`/`onPointerDown`).
Writing `onMouseDown={...} {...other}` therefore drops the
component's own handler whenever Base UI supplies one of the same
name — there is no error, the handler just never runs. Spread
`{...other}` first and define handlers after it, chaining the
incoming handler before custom behaviour (see
`ComboboxChipRemove`, whose propagation stops were overwritten
this way, letting chip-remove mousedowns reach the trigger and
toggle the popup).

### Registry context values must be split from the data they collect

`SearchableMenu` collects its items through a context: each
`SearchableMenuItem` calls `register()` from an effect, which appends to
the menu's `orderedIds` state. That state feeds `getItemNavProps`, which
is part of the same context value.

Depending on the whole context object in the item's registration effect
therefore loops forever: registering changes `orderedIds`, which gives
the context a new identity, which re-runs the effect, which registers
again. Nothing converges, because unregister/register rebuilds the array
each pass even though its contents are unchanged. The main thread is
pinned, so it presents as a freeze rather than a slow render — and in
tests, vitest's own timeout cannot fire, so the run hangs instead of
failing.

Depend on the individual `register`/`unregister` callbacks (both stable,
`useCallback` with no deps) rather than the context object. The same
applies to any registry-style context: keep the stable registration
callbacks separate from the derived data, or split them into two
contexts.

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

### `printKeyboardShortcut` has no key separator on non-Mac platforms

`printKeyboardShortcut` (used by `KeyboardShortcut` and Tooltip
shortcuts) substitutes symbols and joins without a separator on Mac
(`⇧⏎`), but on other platforms it joins the raw key names as-is, so
`['Shift', 'Enter']` renders as "ShiftEnter". Multi-key shortcuts
therefore look broken outside Mac. A real fix means joining with `+`
(or similar) in the non-Mac branch; until then, avoid multi-key
shortcuts in always-visible UI text where the mangling is prominent.

## apps/desktop-electrobun

### The image viewer always loads the full resolution original

Every other image consumer passes a measured width to `useImageSrc`
and gets a bracketed downscaled variant. `ImageViewerDesignElement`
passes none, so the viewer always fetches the original — a different
URL from the variant a card already loaded, so opening an image from a
card starts a fresh download rather than hitting the browser cache.

This was masked as of the dark-mode-image-dimming work: the viewer now
lays out from the intrinsic dimensions in the image stats index and
fills the space with the image's average colour, so there is no longer
a flash of empty container. Only tested against ~300 KB images though,
where the download is negligible. Larger photos will spend real time
in decode with the placeholder showing.

If it needs fixing, the shape is: load the bracketed variant first
(often already browser cached from the card), then swap to the
original once the user zooms past the variant's resolution. The thing
that used to block this is already solved — the viewer's zoom
percentages read `naturalSize`, which now comes from the stats index
rather than `img.naturalWidth`, so they stay correct against the
original while a downscaled variant is on screen.

### The resized image cache is only bounded by size, never cleaned up

`getResizedImage` keys variants on `hash(sourcePath + mtime)`, so
deleting, renaming, or editing a source image orphans its variants
rather than removing them. Nothing hooks those events, and the
filename is a one-way hash so the orphans cannot be traced back to a
source. The only reclamation is `pruneImageCache()`, which runs once
at startup and deletes oldest-first until the directory is back under
500 MB.

Correctness is never at risk: the mtime in the key means a stale
variant cannot be served for a changed image, so this is wasted disk
only. Two weaknesses if it is ever worth improving: the prune sorts by
the cache file's write time and reads do not touch it, so it is FIFO
rather than LRU and can evict variants that are in daily use; and
running only at launch means a long session stays over the limit until
the next restart.

Note that `image-stats.json` deliberately lives **outside** the cache
directory, both so the prune cannot delete it and because it cleans
itself up (see `initializeImageStats`).

### Sharp's native bindings are only shipped for the build machine's platform

The image cache resizes via `sharp`, whose native bindings load at
runtime through `require('@img/sharp-<platform>/sharp.node')` — the
bundled bun code does not inline them. `electrobun.config.ts` copies
`../../node_modules/@img` into the app bundle so the require resolves
without a `node_modules` tree, but pnpm only installs the `@img`
package for the platform it ran on. A build produced on macOS
therefore ships no Linux or Windows bindings.

Nothing surfaces when this happens: `getResizedImage` catches the
load failure and serves the original image, so the app works and only
the perf win is lost. Cross-platform builds need the other platforms'
`@img` packages installed before `electrobun build` runs.
