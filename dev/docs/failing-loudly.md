# Failing loudly

How code that reads, diffs and deletes is written so that a failure is seen rather than acted on. The governing rule is that a failed read is never treated as an absence, and an absence is never acted on destructively unless the read that found it succeeded.

These rules come from the silent failure audit (Dev plans: `silent-failure-audit`). The incidents behind it cost data without leaving more than a console line. `dev/docs/writing-functions.md` covers how functions are shaped; this doc covers what they may conclude from a failure.

## A failed read is not an absence

A reader which catches an error and returns `null`, `[]`, `{}` or a default hands its caller a value which means "there is nothing here". The caller cannot tell that from "I could not look".

`readEntry` returned null for a file whose frontmatter did not parse. Background sync read the null as a deleted entry: it dropped the entry's index row, told the renderer the entry was gone, which removed it from every collection and view config, and swept its metadata sidecar. One YAML typo did all of that.

- A reader whose failure a caller could act on returns a result which distinguishes the cases, such as `{ status: 'changed' | 'unchanged' | 'unreadable' }` (`readEntryIfChanged`), or throws.
- `null` from a reader means "does not exist", checked as such (an `exists` call, a missing directory entry), never "could not be read".
- A `catch` which returns a value says in its comment which caller decision that value feeds, and why acting on it is safe.

## An absence is not a deletion

A diff, sweep or cleanup deletes something because it was not found. Before it does, the thing must have been looked for and not found, not merely missing from a list built by a reader that may have skipped it.

- A diff keeps a list of what it could not read (`unreadablePaths`, `retainedPaths`) and treats those as present.
- A sweep deletes only what a successful listing shows has no owner.
- A destructive side effect of a deletion (removing references, deleting dependent files) follows a deletion the user made, or one confirmed on disk, never one inferred from a failed read.

## A file the app cannot read is not overwritten

A write which merges into or replaces an existing file first checks it can read that file. If it cannot, the file holds edits the app does not have, and the write throws rather than destroying them (`writeEntry` and `EntryFileUnparseableError`).

## Siblings keep the same books

Where several functions do the same job (every `Fs` writer, every entry mutation), every one does the same bookkeeping: self-write recording, events, history, the SQL index, the search index. `writeJsonFile` once skipped the self-write recording `writeTextFile` did, and every sidecar write then looked like an external change and rescanned the workspace.

- A new member of such a family is written by copying the family's bookkeeping, and its test asserts the bookkeeping, not only the main effect.
- Where the bookkeeping can live in one function every member calls, it does (`writeJsonFile` writes through `writeTextFile`).

## Cheap triggers do cheap work

An action the user takes often (a keystroke, an edit, a watcher event) does work proportional to what changed, not to the workspace. A change to one file re-reads that file. A full scan is for startup and for changes whose extent is unknown (a directory arriving, a burst of changes).
