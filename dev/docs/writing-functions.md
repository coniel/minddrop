# Writing functions

How functions are laid out and shaped in this codebase. The governing rule is that a file exports exactly one function, named after the file, and that a function is named and typed for what it does, not for who calls it. Everything else here follows from those.

`dev/docs/package-api-conventions.md` covers how functions are exposed on a package's namespace and the API-function-versus-util split. `dev/docs/writing-components.md` covers helpers inside component files. `dev/docs/commenting.md` governs the JSDoc.

## One function per file

A file exports one function, named after the file. Navigation in this codebase is by file name: if a function is worth naming, it is worth being findable by that name.

This is not only about navigation. A function that exists as an unexported helper below another function is invisible to the next person who needs it, so they write it again. Three copies of the same metadata value resolver accumulated in `packages/databases` this way, each a private helper under a different util, each copied from the last. One file per function is the duplication guard.

A function with no companion files lives directly in its parent directory:

```
src/utils/isPropertyFilterDateValue.ts
```

One with companions (a test, a stylesheet) is wrapped in a directory with a barrel `index.ts`:

```
src/utils/resolveEntryMetadataValue/
  resolveEntryMetadataValue.ts
  resolveEntryMetadataValue.test.ts
  index.ts            // export * from './resolveEntryMetadataValue';
```

Any function with logic worth testing gets the directory and the test. Do not wrap a solo file on the expectation of a test later; wrap it when the test appears.

`index.ts` files are barrels only. They never define a function, type or constant.

### The one exception: helpers bound to the main function

A local helper below the main function is permitted only when it is highly specific to that function's needs and could never be used elsewhere. The recognisable cases:

- **A recursive step.** `collectDatabases(query, visited)` under `getQueryDatabases` exists to carry the visited set through the recursion. Nothing else will ever call it.
- **A step typed to the main function's own shapes.** A `convertToggleFilter(node, propertyType)` that only makes sense as one branch of `convertQueryFilterNodeToEntryFilter`.

The test is the same as for component helpers: could a second function ever call this? If the helper takes plain values and returns plain values, someone will write it again, and it is its own file. If in doubt, it is its own file.

Handlers and callbacks closed over a component's state are not helpers and are not covered here; see `dev/docs/writing-components.md`.

## Before writing: look for what exists

Search before writing any function, by concept rather than by the name you had in mind. Grep for the types involved, the field being read, the operation being done. Check `packages/utils` for domain-free helpers and the package's own `utils/` for domain ones.

When something close exists, prefer extending it to writing a sibling. An existing function may be augmented to fit a new use case as long as its core identity is kept: an optional argument that refines the behaviour, a widened input type, a new branch for a new property type. `resolveEntryMetadataValue` gaining a `color` branch keeps its identity ("the entry field behind a metadata type"). Turning it into something that also reads declared properties would not, and that is a second function which calls the first.

A near-duplicate with a different name is worse than either reuse or a clearly separate function, because it hides that the two do the same thing.

## Generic utils go in `packages/utils`

A function that knows nothing about the domain belongs in the global `packages/utils` package, never in a package's own `utils/` and never as a helper under the function that first needed it. `toArray`, `clamp`, `reorderArray`, `toKebabCase`: anything a second package would recognise as the thing it wanted.

The test is whether the function mentions a domain type or concept. A `toList(value: PropertyValue)` that wraps a string in an array is `toArray<T>(value: T | T[])` with a domain type it does not use. Strip the domain and it is a global util; the domain-specific caller passes its value in.

Left in a package, a generic helper is rewritten in the next package that needs it, and the copies drift. Check `packages/utils` first, add there when missing.

## Name and shape a function for what it does

A function is named and typed for its actual behaviour, not for the purpose its first caller has in mind. Callers come and go; the behaviour is what the next reader searches for.

The tell is the argument list. If a function takes a caller-specific object and only reads two fields off it, it is shaped for the caller, not for the job.

```ts
// Shaped for its caller: named after the filter, takes the filter,
// but reads only the property name and type.
function resolveFilterValue(
  entry: DatabaseEntry,
  filter: PropertyFilter,
): PropertyValue | undefined {
  if (Properties.constants.MetadataTypes.has(filter.propertyType)) {
    return resolveEntryMetadataValue(entry, filter.propertyType);
  }

  return entry.properties[filter.property];
}
```

What this does is resolve an entry's property value from a name and a type. Filtering is why it was written, not what it is. Named and typed for the job, it serves sorting, display and anything else that needs a value by name and type:

```ts
function resolveEntryPropertyValue(
  entry: DatabaseEntry,
  name: string,
  type: PropertyType,
): PropertyValue | undefined;
```

The filter util then passes the two fields it has, and the function is findable by anyone searching for "entry property value". Replacing the caller-specific argument with arguments for the values the function actually uses is usually the whole refactor.

The same applies to naming: `resolveFilterValue`, `getSortValue`, `columnValueFor` are three names for one behaviour, and three names means three files nobody connects. Name the behaviour once.

## Inside the file

Order within a function file:

1. Imports.
2. Types that exist only to describe this function's parameters (`CreateSpaceOptions`), exported.
3. The function, with its JSDoc.
4. Its permitted helpers, below it, unexported.

Style rules that apply to every function:

- Use whole words for names: `property`, `event`, `index`, never `prop`, `e`, `i`.
- Every `if` takes a block. Early returns and guards over nested conditions.
- Never chain ternaries. A function with early `if` returns replaces the chain.
- An empty line above every block and every `return`.
- No hard-coded user-facing strings; keys come from i18n.
- Utils are pure: they read and transform. Anything that writes to a store, dispatches an event or touches disk is an API function in the package root, never a util.

## Naming prefixes

The prefixes carry meaning and are chosen by behaviour, per `dev/docs/package-api-conventions.md`:

- `get*` retrieves an existing item, usually from a store, and throws when it is missing.
- `resolve*` derives or computes a value from its inputs. Never `get*` for derivation.
- `is*` / `has*` return a boolean and, where useful, act as type guards.
- `use*` is a React hook.
- `read*` / `write*` touch the file system. Store and config mutations are `update*`.
- `load*` reads everything under a directory into a store.

## Checklist

Before committing a new function:

- Does something like it already exist? Extend it if the identity holds.
- Is it in its own file, named after itself, exported, with a test if it has logic?
- Is it domain-free? Then it lives in `packages/utils`.
- Is it named and typed for what it does, taking the values it uses rather than a caller's object?
- Could a second function ever call any helper left below it? If so, that helper is its own file.
