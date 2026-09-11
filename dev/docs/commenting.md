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

**A step is a blank-line-separated statement group**, which makes the
rule checkable: scan the finished function for a group with no comment
above it — each one is a gap in the skim. The groups most often left
bare are the ones whose code looks self-explanatory, and those still
take a comment, because a name only reads as documentation once the
reader has dropped out of the comments and into the code:

- The call to the well-named function the body was built around
  (`applyElementSettings(...)` still takes `// Apply the change`).
- The callback or emit handing the result off at the end
  (`onElementsChange(result.elements)` still takes
  `// Emit the adjusted layout`).

Calibrate density against `packages/databases`, which is the reference.

Not everything needs one:

- Single-expression accessors are covered by their name and JSDoc.
- A `return` of the value the previous step just built needs nothing.
- A trivial early-return guard on a missing value
  (`if (!selected) return`) needs nothing; a guard encoding a real
  rule takes one.
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

A trailing clause justifying the step is the most common way this creeps
in. Delete it whenever the code, its name or its type already says it:

```ts
// BAD, the clause restates what the column's name already says
// Drop the no-value column while it holds nothing, as it names no
// option of its own

// BAD, the Required<Pick<...>> type says the second half
// The column settings every board falls back to, declared with their
// values present so that consumers resolve concrete ones

// GOOD
// Drop the no-value column when empty
// The column settings every board falls back to
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
  the function correctly. JSDoc states the contract: what goes in, what
  comes out, and any behaviour that changes the result from the caller's
  side. How the function gets there is invisible to the caller and goes
  stale when the internals change. "Keeps the entries matching every
  filter. Metadata properties are read by their type rather than by
  name, since implicit metadata properties carry translated names" is
  one sentence of contract followed by one of internals; the caller
  passes filters and gets entries, and how metadata is looked up makes
  no difference to them. The same goes for per-case semantics: "text
  compares case insensitively, dates compare by local day, an unset
  toggle counts as off" is the start of a list that has no natural end.
  With a hundred cases nobody would list a hundred, so list none; a
  caller who needs one case reads the function. "Checks whether a
  property value matches a filter" is the whole JSDoc. If a detail
  matters to a maintainer, it is a step comment inside the function.
- **Examples**, unless the term itself is ambiguous. "A value a property
  holds, such as a tag or a select option" earns its example because
  "value" alone is ambiguous.
- **Product names or analogies.** Describe the behaviour itself, never
  "Notion-style" or "like the way X does it", even when the instruction
  that led to the code was phrased that way.
- **Plan entries or tickets.** They live outside the repo. State the
  constraint itself.
- **Downstream consumers.** A package does not name the packages that
  depend on it, and a function does not name its callers. "Resolves
  the modifier classes for an element's text settings, shared by
  text-bearing element renderers" narrates its consumers with the
  "shared by" clause — the function just resolves the classes. Who
  uses it is what call sites are for.
- **Another package's concepts, where this package does not depend on
  that package.** Absolute, and examples are not an exception. A
  package's comments are written in its own vocabulary and that of its
  dependencies, and in nothing else. A theme util does not mention
  entries, a primitive does not mention design elements, and neither
  mentions them "for example". If the term is not in reach of an
  import, it is not in reach of a comment: say it in this package's own
  terms, or drop the sentence. Being true is not the test. The reader
  of a package has no reason to know what a package it never depends on
  calls things, and the sentence goes stale the moment that package
  renames them.
- **Rendering behaviour, outside the code doing the rendering.** It is
  at home in a component's JSDoc, in its internals and in the utils it
  calls, describing what that code itself renders. Everywhere else it is
  out: a data type, a core API function or a store update never explains
  what some renderer will do with the value it carries. Rendering code
  is no exception where the behaviour is not its own — a component
  describes what it renders, not what its children or its callers do.

  In **types it is never allowed**, with two exceptions: the type is
  itself about rendering (a component's props), or the property's whole
  job is to drive rendering — a flag controlling render behaviour, an
  i18n key, a design or styling value. The test is whether the field
  would still mean what the comment says if nothing rendered it.

  ```ts
  // BAD, a data field narrating what renderers do with it
  /**
   * Name of the property the element takes its content from. Absent
   * elements render their own static content, as do mapped elements
   * whose property no longer exists.
   */
  property?: string;

  // GOOD
  /**
   * Name of the property the element takes its content from. Absent
   * when the element is unmapped.
   */
  property?: string;

  // ALSO GOOD, the flag's only job is to drive rendering
  /**
   * Whether the element grows to its content's height, stretching the
   * rows it spans and pushing rows below it down.
   */
  naturalHeight: boolean;
  ```

- **The system around the function.** A function documents its own
  contract, never the role its operation plays in a larger design, the
  meaning other code assigns to its output, or a lifecycle other code
  drives. The function knows and cares about none of that.

  ```ts
  // BAD, documents the event system's architecture from inside a
  // store function which enforces none of it
  /**
   * Appends a dispatched event to the log. The entry marks the
   * event's side effects as in flight, letting renderers explain
   * transitional store states, and is removed once the event's
   * listeners have settled.
   */

  // GOOD
  /**
   * Appends a dispatched event to the log.
   */
  ```

  The test: could this JSDoc survive the surrounding system being
  redesigned without the function's body changing? Here every dropped
  sentence describes the dispatcher and the renderers, so it belongs
  on the code that owns that behaviour — the dispatcher's JSDoc for
  the lifecycle, the plan for the design.

**Every entry above is the same rule in a different costume: a comment
carries only what the code under it does.** Knowledge from outside that
scope — how other code is implemented, what happens next in a flow it
takes part in, an example of a thing the reader can go and look at — is
out, however true and however helpful it seems. It is written where the
code cannot enforce it, so it goes stale silently, and it buries the one
thing the reader came for.

Design reasoning belongs in the plan, not in the type or the function.

## Phrasing

Write comments the way you would say them out loud. If a sentence would
sound strange spoken, rewrite it.

**Explicit over expressive.** A comment gets a point across as
efficiently as possible; it is not trying to sound good. Pick the
plainest verb with one meaning: "Returns entries matching every filter",
not "Keeps the entries matching every filter", which could mean the
function holds on to them. No metaphor, no personification ("the filters
say nothing about them"), no flourish. If a clause is there for style
rather than information, cut it.

**One idea per sentence.** Bullet points, not prose. A comment is read
at a glance, by someone on their way to something else. Clauses hung off
a noun phrase (`which ...`, `leaving ...`, `so that ...`) make the reader
hold the whole sentence before any of it resolves. Split them into
separate statements. Short sentences in a row read faster than one long
one, even where a word repeats, and a fragment is fine when it is the
shortest true statement.

Avoid:

> The ramp the default colour draws from, which a scheme rebinds to its
> own hue, leaving it neutral outside one.

Prefer:

> The ramp the default colour draws from. Schemes rebind this to their
> own hue. Neutral outside a scheme.

This applies to JSDoc as much as to step comments, and a JSDoc
description states only the function's main effect — it does not walk
through the mechanism, whose details are found by reading the code.
A description written in the implementation's own vocabulary fails on
both counts:

Avoid:

> Applies a settings change to an element, adjusting the layout when
> the change alters its intrinsic height: the element's span
> re-quantizes onto the new step and floor, and the change propagates
> through the bottom edge of the element's row band — elements sharing
> its rows hold the edge while they reach below it.

Prefer:

> Applies a settings change to an element, adjusting the layout when
> the change affects the element's height.

These constructions read as written-not-spoken and come up often:

| Avoid                                                         | Prefer                                                                |
| ------------------------------------------------------------- | --------------------------------------------------------------------- |
| `a record outliving its contents if they are removed by hand` | `A record can outlive its contents if they were removed by hand`      |
| `history files being written once`                            | `since history files are only ever written once`                      |
| `..., which is the ordinary rename`                           | `. This is the ordinary case for a rename`                            |
| `reviving the timestamps JSON stores as strings`              | `JSON stores the timestamps as strings, so they are revived as dates` |
| `Advisory for consumers: ...`                                 | `Used to ...`                                                         |

**Use the plain verb.** "Holds", "carries" and "leads with" are the
written register of "has", "returns" and "puts first". The elevated verb
makes the reader translate it back:

| Avoid                                          | Prefer                                          |
| ---------------------------------------------- | ----------------------------------------------- |
| `carries nothing for an option with no colour` | `returns nothing when the option has no colour` |
| `leads with the no-value column`               | `puts the no-value column first`                |
| `empty when it holds none`                     | `empty when it has none`                        |

**Use the word for the state.** Spelling out a condition a single word
already names is the same reach:

| Avoid                           | Prefer            |
| ------------------------------- | ----------------- |
| `while it holds no entries`     | `when empty`      |
| `a column which holds none yet` | `an empty column` |

This applies to test names as much as to comments, since they are read
as sentences.

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

The period rule has a lint rule of its own,
`minddrop/multiline-comment-period` in `packages/eslint-config`. It is
**currently off**, because around 1,600 comments across the repo predate
the convention and lint runs with `--max-warnings 0`. Every one of them is
auto-fixable, so turning it on is a matter of running `eslint --fix` over
the repo and flipping the rule to `error` in `base.js`. Doing that while
several worktrees have unmerged work would cost more in conflicts than it
saves, so it waits for a quiet moment.

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
