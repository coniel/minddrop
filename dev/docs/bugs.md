# Known Bugs

Confirmed bugs that are not yet fixed, with enough detail to reproduce and
locate them. Organised by package/feature. Record a bug here when you find
one but decide not to fix it in the current work; delete the entry once the
underlying issue is resolved.

## packages/data-views

### `createVirtualDataView` tests fail: name falls back through uninitialized i18n

Three tests fail on `main` (pre-existing, surfaced by the views /
data-views split): `createVirtualDataView.test.ts` "returns the new
virtual view", "adds the view to the store", and "dispatches a view
created event", with the created view's `name` being `undefined` instead
of the view type name.

Cause: `createVirtualDataView` defaults the name via
`i18n.t(viewType.name)`, but the package's test setup never calls
`initializeI18n()`, so `t()` returns `undefined` instead of falling back
to the key. In the app i18n is always initialized before any data view is
created, so runtime behaviour is unaffected.

Fix direction: initialize i18n in the package's test setup (or stub the
default-name resolution), then remove this entry.

## packages/databases

### Concurrent file entry creation races on the storage directory

Dropping multiple files into a database creates one entry per file, but on a
fresh database whose property storage directory does not exist yet, only the
first file is written; the rest fail with `EEXIST: file already exists`.

Cause: `writePropertyFile`
(`packages/databases/src/writePropertyFile/writePropertyFile.ts`) ensures the
storage directory exists with a check-then-create guard
(`if (!(await Fs.exists(dir))) { await Fs.createDir(dir); }`, for both
`property` and `common` modes). A multi-file drop creates the entries (and
writes their files) concurrently, so several writes observe the directory
missing and all call `createDir`; every call after the first throws `EEXIST`.
It is a classic check-then-create race in the directory creation.

Fix direction: make the directory creation idempotent / race-safe, e.g.
create the storage directory once before the parallel writes, make
`createDir` ignore an already-existing directory, or catch and swallow
`EEXIST`. No data is lost, but the losing writes fail outright.

### `updateEntryMetadata` does not update the entries store, losing successive metadata updates

`updateEntryMetadata`
(`packages/databases/src/updateEntryMetadata/updateEntryMetadata.ts`)
queues the metadata file write, syncs SQL via the metadata updated event,
but never updates the entry in `DatabaseEntriesStore`. Callers that
compose the new metadata from the store therefore read stale state.

Confirmed repro: two successive `setEntryViewLayoutOverride` calls for
different views on the same entry. The second call spreads
`entry.metadata.viewLayoutOverrides` from the store, which still lacks
the first override, so the flushed metadata file (and SQL) contain only
the second override — the first is silently lost. The existing
"preserves existing layout overrides" test masks this by seeding the
store manually instead of calling set twice.

`persistVirtualViewConfig` works around the gap by mirroring the
composed metadata onto the store itself before calling
`updateEntryMetadata`, but `setEntryViewLayoutOverride` and
`clearEntryViewLayoutOverride` do not, so interleaving them with
`persistVirtualViewConfig` can also drop overrides from the persisted
file. Store readers (e.g. `DatabaseEntries.use`) also never see metadata
changes made through the non-mirroring callers.

Fix direction: update the store inside `updateEntryMetadata` itself so
every caller gets the mirror for free, then remove the caller-side
mirrors in `persistVirtualViewConfig` and `duplicateDatabaseEntry`, and
add a second-set test to `setEntryViewLayoutOverride`.

### Stale `DataViews.Store.getAll()` usage in views tests

Four tests fail on `main` (present since at least b2245174):
`src/loadDatabaseViews/loadDatabaseViews.test.ts` (3) and
`src/event-handlers/database-created/database-created.test.ts` (1), with
`views.find is not a function` / `expected {} to have property 'length'`.

Cause: the tests treat `DataViews.Store.getAll()` as an array
(`.find(...)`, `toHaveLength(...)`), but `createObjectStore.getAll()`
returns a `Record<string, TItem>` map. The tests should use
`getAllArray()` (or adapt the assertions to the map shape).

## features/databases

### Pre-existing test failures in DatabasePropertyEditor and DatabaseEntryRenderer

Eight tests fail on `main` (confirmed at d6ef9001, unrelated to working
changes): 7 in `src/DatabasePropertyEditor/DatabasePropertyEditor.test.tsx`
and 1 in `src/DatabaseEntryRenderer/DatabaseEntryRenderer.test.tsx`
("keeps rendering the entry across a rename").

Two distinct symptoms:

- `TypeError: viewport.getAnimations is not a function` (4 occurrences):
  jsdom does not implement `Element.getAnimations`, hit during component
  rendering. Most of the affected tests then time out at 5s.
- Unhandled rejection at `DatabasePropertyEditor.test.tsx:272`: a
  `DatabaseUpdatedEvent` listener reads `data.properties.find(...)`, but the
  event data shape is `{ original, updated }`, so `data.properties` is
  undefined. The assertion should read `data.updated.properties`.

Fix direction: polyfill/stub `getAnimations` in the test setup, and correct
the event data access in the property editor test.

### `useForm` fieldProps spread fails TextField typecheck

Spreading `fieldProps.<name>` from `useForm` (`@minddrop/utils`) onto a
`TextField` fails the typecheck in `NewDatabaseDialog`
(`features/databases`), `NewSpaceDialog` (`features/spaces`), and
`CreateDataViewForm` (`features/data-views`):
`FieldProps.error` is a plain `string` while `TextField`'s `error` prop is
typed `TranslationKey` (the `onChange` event type is also wider than the
input's). Runtime behaviour is fine — unknown keys render as-is.

Fix direction: reconcile the error typing between `useForm` and the field
primitives (e.g. make `useForm` validation produce translation keys and
type `FieldProps.error` accordingly), then remove this entry.

## features/desktop-app

### One structurally invalid persisted file blanks the whole app at startup

A single persisted config file whose JSON parses but whose shape is wrong
takes down app startup entirely: the window renders blank with only an
unhandled promise rejection in the console, no error UI, and no
indication of which file is at fault.

Observed while renaming `Collection.entries` to `Collection.items`
(2026-08-06). Collection files already on disk still carried the old
`entries` key, producing:
`TypeError: undefined is not an object (evaluating 'references.flatMap')`
at `App.tsx:9`.

Failure chain, and three separate places that let it through:

1. `readCollection` catches only read/parse failures. A file that parses
   as JSON is returned as-is through `Fs.readJsonFile<Collection>(path)`
   — the type parameter asserts a shape nothing verified, so a config
   missing required fields passes as a valid `Collection`.
2. `initializeCollections` maps over the loaded configs and calls
   `resolveItemReferences(collection.items)`. With `items` undefined,
   `references.flatMap` throws, and the throw escapes the whole `.map`,
   so *no* collections load even though only one file was bad.
3. `initializeDesktopApp` awaits each loader in sequence with no
   isolation, and `App.tsx`'s `init()` never catches, so the rejection
   leaves `initializingApp` stuck at `true` and `App` returns `null`
   forever. Every step after `Collections.initialize()` (spaces, search,
   selection, theme, extensions) is also skipped.

The same shape applies to every persisted-entity loader — data views,
spaces, databases, designs — since they share the read-cast-then-use
pattern and the same unguarded init sequence.

Fix direction: validate on read rather than type-casting, and mark
entities that fail validation as corrupted rather than throwing, so a bad
file degrades to one flagged entity the user can be told about. Isolate
per-item loading (one bad file drops one entity), and wrap the init
sequence so a failed step surfaces an error screen naming the file
instead of a blank window.

## packages/file-system

### `Fs.removeDir` throws `EFAULT` in the Electrobun runtime

Calling `Fs.removeDir` on a directory fails at runtime with
`EFAULT: bad address in system call argument, rm '<path>'`.

Trace: the mainview adapter maps `removeDir` to the RPC `fsRemoveDir`
(`apps/desktop-electrobun/src/bun/fileSystemRpc.ts`), which calls Bun's
`fsp.rm(resolved, { recursive: recursive ?? false, force: true })`. Bun's
`fs/promises.rm` throws `EFAULT` on a directory rather than removing it
(Node would throw `EISDIR`/`ENOTEMPTY`); it fails whether or not
`recursive` is set. This is a low-level failure in Bun's `rm`, surfaced
through the adapter.

Nothing in the app exercised this before: the databases package removes
directories with `Fs.trashDir` (native move-to-trash via `fsTrashDir`),
which works, and `removeDir` had no directory callers. The
`setDatabasePropertyFileStorage` cleanup originally used `removeDir` and
hit this; it now uses `trashDir` like the rest of the package.

Workaround / convention: use `Fs.trashDir` to remove a directory. If
`removeDir` is ever genuinely needed, the adapter would need a working
native call (or a Bun version bump that fixes `fsp.rm`).
