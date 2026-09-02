# Commenting

How comments are written in this codebase. The goal is that a function
body can be skimmed by reading only its comments, without parsing the
code underneath them.

## Density

Put a brief comment above **every logical step** in a function body, even
simple ones: a store write, a guard, each branch of an `if`, a `.map` or
`.filter`. The comments are a pre-parsed version of the code.

Commenting only the steps that feel interesting is worse than commenting
none of them, because it makes the ones that are there look arbitrary and
leaves gaps in the skim.

Calibrate density against `packages/databases`, which is the reference.

Not everything needs one:

- Single-expression accessors are covered by their name and JSDoc.
- A `return` of the value the previous step just built needs nothing.
- Imports, type definitions and barrel files take no step comments.

## What a step comment says

**Start with a verb naming the action.** Add the why to the same sentence,
or a following one, and only when it would not be obvious. A why that the
surrounding steps already make clear is noise:

```ts
// BAD, the next step says what the files are read for
// Read the old key's history files, to merge them into the history
// the new key already has.
const contents = await Fs.readDir(fromDirPath);

// GOOD
// Read the old key's history files
const contents = await Fs.readDir(fromDirPath);
```

Put the why where the surprising thing is, which is often not the step
you first attached it to. A why in the wrong place reads as noise in one
comment and leaves a real gap in another:

```ts
// BAD, explains a read the next step already explains, and implies
// something is expected not to move
// Read the old directory again to see what did not move
const remaining = await Fs.readDir(fromDirPath);

// BAD, says why the directory is kept but not why anything would be
// left behind, which is the part a reader cannot work out
// Check if anything was left behind. If so, keep the directory
// rather than losing what is still in it.

// GOOD
// Read the old directory again
const remaining = await Fs.readDir(fromDirPath);

// Check if anything was left behind by a file name conflict. If so,
// keep the directory rather than losing what is still in it.
```

```ts
// Filter for log files
const logFiles = entries.filter(
  (entry) => Fs.getFileExtension(entry.path) === LogFileExtension,
);
```

A comment that states context or a precondition **instead of** the action
reads as a non sequitur above the line it belongs to, even when the fact
is true and is the actual reason for the line:

```ts
// BAD, states where things are rather than what happens
// The content directory sits alongside the log files
const logFiles = entries.filter(/* ... */);

// BAD, states a precondition rather than the action
// The content directory does not exist until the subject's first
// content change is recorded.
await Fs.ensureDir(contentDirPath);

// GOOD, names the action, then the reason
// Ensure the content directory exists, in case this is the
// subject's first recorded content change.
await Fs.ensureDir(contentDirPath);
```

Naming the action usually conveys the context anyway. "Filter for log
files" already tells the reader the directory holds other things.

**Name the operation plainly.** Use the verb for what the code actually
does. Reaching for a more colourful one makes the reader work out which
operation is meant.

```ts
// BAD, a roundabout way of saying "rename"
// Hand the whole directory over if the new key has no history

// GOOD
// Check if the new key already has a history. If not, the directory
// can simply be renamed.
```

**Follow the order of the code.** A comment above a guard describes the
check first and the consequence second, because that is the order the
lines below it read in. Putting the consequence first makes the reader
run the comment backwards against the code.

```ts
// BAD, states the outcome before the condition
// Rename the directory if the new key has no history of its own
if (!(await Fs.exists(toDirPath))) {
  await Fs.rename(fromDirPath, toDirPath);

  return;
}

// GOOD, reads in the same order as the code
// Check if the new key already has a history. If not, the directory
// can simply be renamed.
if (!(await Fs.exists(toDirPath))) {
  await Fs.rename(fromDirPath, toDirPath);

  return;
}
```

**Comments on declarations are the exception.** A constant or a
module-level variable has no action, so describe what the value is.

```ts
// The append in flight for each subject, keyed by its history
// directory path.
const appendsInFlight = new Map<string, Promise<unknown>>();
```

## What not to comment

- **Normal behaviour.** Document deviations, not what the code obviously
  does or what any reader would expect. "The ID never changes" is noise.
- **Anything derivable from what you just said.** Drop a sentence whose
  content follows from the sentence before it, or from the design the
  reader already has.
- **Implementation details in JSDoc**, unless a caller needs them to use
  the function correctly.
- **Examples**, unless the term itself is ambiguous. "A value a property
  holds, such as a tag or a select option" earns its example because
  "value" alone is ambiguous.
- **Product names or analogies.** Describe the behaviour itself, never
  "Notion-style" or "like the way X does it", even when the instruction
  that led to the code was phrased that way.
- **Plan entries or tickets.** They live outside the repo. State the
  constraint itself.
- **Downstream consumers.** A package does not name the packages that
  depend on it.

Design reasoning belongs in the plan, not in the type or the function.

## Phrasing

Write comments the way you would say them out loud. If a sentence would
sound strange spoken, rewrite it. Prefer two plain sentences over one
with clauses hung off it.

These constructions read as written-not-spoken and come up often:

| Avoid                                                         | Prefer                                                                |
| ------------------------------------------------------------- | --------------------------------------------------------------------- |
| `a record outliving its contents if they are removed by hand` | `A record can outlive its contents if they were removed by hand`      |
| `history files being written once`                            | `since history files are only ever written once`                      |
| `..., which is the ordinary rename`                           | `. This is the ordinary case for a rename`                            |
| `reviving the timestamps JSON stores as strings`              | `JSON stores the timestamps as strings, so they are revived as dates` |
| `Advisory for consumers: ...`                                 | `Used to ...`                                                         |

No em dashes in comments.

## Syntax

**Periods.** A single-sentence comment on a single line takes no full
stop. A comment that runs to more than one sentence, or wraps onto more
than one line even as a single sentence, always ends with one.

```ts
// Read the log

// Check the log exists. A subject only gets one once something has
// been recorded against it.

// Populate the last-modified timestamp property value so it persists
// to the entry file.
```

**Block comments are always multi-line.** Never `/** Foo **/` on one
line. The exception is a comment inside JSX delimiting a child
component, which stays on one line:

```text
{/** Navigation menu **/}
```

**Interface property JSDoc is always multi-line**, one block per
property, never a single-line `/** Foo */`.

```ts
export interface MoveHistoryOptions {
  /**
   * The absolute path of the directory holding the history.
   */
  ownerPath: string;
}
```

**Function JSDoc** goes on every exported and every non-trivial function,
and includes `@param` for each parameter and `@returns` where something
is returned. `@param` lines use a dash separator and end with a full
stop.

```ts
/**
 * Reads the contents stored for a content record.
 *
 * @param options - The content to read.
 * @returns The stored contents, or null if the file is missing.
 */
```

Add `@throws` for each error the function itself throws, and
`@dispatches` for each event it dispatches. `@dispatches` is not standard
JSDoc, but the events a function fires are as much a part of its contract
as what it returns, and nothing else surfaces them at the call site.

The tags go in three groups, each separated by a blank line: `@param` and
`@returns` first, then the `@throws` tags, then the `@dispatches` tags.

```ts
/**
 * Renames a database, moving its directory to the new name.
 *
 * @param id - The ID of the database to rename.
 * @param newName - The new name for the database.
 * @returns The renamed database.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 * @throws {PathConflictError} If a database already exists at the new path.
 *
 * @dispatches databases:database:renamed
 */
```

`@throws` names the error type in braces, then the condition. Document
every error a caller can get back, including ones raised by the getters
and helpers the function calls: `deleteDatabaseEntry` documents
`DatabaseEntryNotFoundError` even though `getDatabaseEntry` is what
throws it. `@dispatches` takes the event name alone.

Components get a brief JSDoc describing what they render, and their prop
interfaces are fully commented per property.

## Placement

JSDoc sits directly above the thing it documents. Local helper functions
go below the main function in the file, so the file reads top down from
its entry point.
