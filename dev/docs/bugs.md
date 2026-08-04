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
