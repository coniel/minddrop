# Known Bugs

Confirmed bugs that are not yet fixed, with enough detail to reproduce and
locate them. Organised by package/feature. Record a bug here when you find
one but decide not to fix it in the current work; delete the entry once the
underlying issue is resolved.

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
(`features/databases`), `NewPageDialog` (`features/pages`), and
`CreateDataViewForm` (`features/views`):
`FieldProps.error` is a plain `string` while `TextField`'s `error` prop is
typed `TranslationKey` (the `onChange` event type is also wider than the
input's). Runtime behaviour is fine — unknown keys render as-is.

Fix direction: reconcile the error typing between `useForm` and the field
primitives (e.g. make `useForm` validation produce translation keys and
type `FieldProps.error` accordingly), then remove this entry.

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
