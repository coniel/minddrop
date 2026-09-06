# Package API conventions

How the core packages in `packages/` shape their public APIs. A core package exports namespace objects (`Collections`, `Databases`, `DatabaseEntries`) plus types, and everything a consumer touches goes through those namespaces. This is the shape future extensions receive, so surface area is a liability and every key on a namespace is a commitment.

The reference implementations are `packages/collections` (a single-entity package) and `packages/databases` (several entity namespaces in one package). `ui/theme` (`Theme`) is the reference for a non-entity namespace.

## Scope

Domain packages only. Infrastructure toolkits (`utils`, `stores`, `i18n`, `test-utils`, `dev-tools`, `editor`, `ast`) keep flat exports since their APIs don't map to a namespace shape.

## Barrel

The package `index.ts` contains only:

- `export type * from './types'` and `export type * from './events'` (event data types). Function-specific types colocated with their function get their own `export type { ... } from` line.
- One `export * as Foo from './Foo'` line per namespace.

No flat value exports. Everything a consumer calls, catches or listens for lives on a namespace.

```ts
export type * from './types';
export type * from './events';
export type { VirtualCollectionData } from './loadVirtualCollections';
export * as Collections from './Collections';
```

## One namespace per entity type

A package that manages more than one entity type gives each its own namespace file and `export * as` line (`Databases`, `DatabaseEntries`, `DatabaseTemplates`; `Tags` and `TagGroups`). Never add sub-entity aliases to the parent namespace (`Tags.createGroup`, `Tags.useAllGroups`).

Package-level lifecycle functions are named after the package and live on the package's namespace, not on a sub-concept: `Views.initialize` (function `initializeViews`), never `DataViews.initialize`.

## Namespace file shape

The namespace file (`Collections.ts`) re-exports each API function under a short alias with the entity prefix stripped, and groups the non-function members under fixed keys:

| Key         | Contents                                                                                            | Example                                                                                                       |
| ----------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `events`    | Event name constants, capitalized keys, `as const` so the literal types key the event data registry | `DatabaseCreatedEvent` → `Databases.events.Created`                                                           |
| `errors`    | Error classes                                                                                       | `DatabaseNotFoundError` → `Databases.errors.NotFound`                                                         |
| `constants` | Consumer-facing constants, entity prefix stripped                                                   | `DatabasesIcon` → `Databases.constants.Icon`, `DefaultDatabaseIcon` → `Databases.constants.EntityDefaultIcon` |
| `templates` | Entity templates                                                                                    | `BlankDatabaseTemplate` → `Databases.templates.Blank`                                                         |
| `Store`     | The package store, for tests only                                                                   | `CollectionsStore` → `Collections.Store`                                                                      |

Functions go on the namespace root:

- CRUD: `create`, `get`, `getAll`, `update`, `delete`.
- File system: `read`, `write`, `load` (plus `readConfig`/`writeConfig` style variants).
- Hooks: `useFoo` → `use`, `useAllFoos` → `useAll`, `useFooDefaults` → `useDefaults`.
- Utils go on the root too, not under a `utils` key: `resolveEntryColor` → `DatabaseEntries.resolveColor`, `searchDatabases` → `Databases.search`.

Some namespaces carry custom keys where a group of members is a distinct concern (`Databases.sql`, `Designs.tokens`, `Properties.schemas`). Add one only when the members are clearly a set that consumers address together.

```ts
export const events = {
  Created: CollectionCreatedEvent,
  Updated: CollectionUpdatedEvent,
} as const;

export const errors = {
  NotFound: CollectionNotFoundError,
};

export const constants = {
  Icon: CollectionsIcon,
  EntityDefaultIcon: DefaultCollectionIcon,
};

export { createCollection as create } from './createCollection';
export { getCollection as get } from './getCollection';
export {
  CollectionsStore as Store,
  useCollection as use,
} from './CollectionsStore';
```

## Expose only what consumers use

Include only members that code outside the package actually needs. Internal constants (directory and file names, size limits, SQL type sets) and internal helpers (path resolvers, validators) stay unexported inside the package. Errors and events are always exposed since consumers catch and listen for them. A package whose constants are all internal simply has no `constants` key.

Before adding a key, grep for usage outside the package. If nothing uses it, leave it internal.

## File layout

One exported function per file, named after the function. A function with companion files (test, CSS) is wrapped in a directory with a barrel `index.ts` (`getCollection/getCollection.ts`, `getCollection/getCollection.test.ts`, `getCollection/index.ts`). A function with no companion is a solo file in the package root. `index.ts` files are barrel-only: never define types, functions or constants in them.

Interfaces that exist only to type one function's parameters (`CreateSpaceOptions`) are declared and exported from that function's file, above the function. The `types/` directory holds entity and domain types shared across the package (`Space`, `UpdateSpaceData`).

Store definitions and their hooks (`CollectionsStore`, `useCollection`, `useCollections`) live together in `FooStore.ts`.

## API functions versus utils

`utils/` is for side-effect-free helpers only. They may read stores and transform data but never write to a store or to disk. Anything that mutates state is an API function in the package root. This keeps utils composable and avoids module cycles: API functions import the utils barrel, so a util calling an API function closes a cycle.

## Naming

- `get*` retrieves an existing item, usually from a store (`getTag`, `getAllTags`).
- `resolve*` derives or computes a value (`resolveCollectionFilePath`, `resolveNextTagColor`). Never `get*` for derivation.
- `use*` for React hooks.
- `write*` means writing to the file system (`writeCollection`, `writeDatabaseConfig`). Store and config mutations are `update*`. Comments follow the same vocabulary: "Update the collection" above an `update` call, "Write the collection" only above a file write.
- `read*` reads an entity from the file system without touching the store (`readCollection`). `load*` reads everything under a directory into the store and dispatches the loaded event (`loadTags`).

## Getters

Getters throw a `NotFound` error by default. When a caller legitimately needs a non-throwing lookup, the getter takes a `throwOnNotFound` overload parameter rather than the caller falling back to the store:

```ts
export function getCollection(id: string): Collection;
export function getCollection(
  id: string,
  throwOnNotFound: false,
): Collection | null;
```

Use `throwOnNotFound: false` only where absence is an expected, handled case. Don't add existence guards for unlikely races such as mid-flight deletion: use the throwing getter and let the function throw. The events system catches and reports listener errors without breaking the dispatcher.

## Store access

`Foo.Store` is exported for tests only. App and feature code always goes through the API functions (`Collections.delete`, never `Collections.Store.remove`), because the API functions carry the side effects: event dispatch, file writes, skipping file deletion for virtual entities.

The rule also applies inside the package. Event handlers and utils read through the package's own getters (`getSpace(id, false)`, `getAllDatabases()`), never `FooStore.get`. Direct store calls are correct only in the getter and hook implementations themselves, and for writes inside the package's own API functions (`CollectionsStore.set` in `createCollection`).

## Mutation flow

An API function that mutates an entity:

1. Reads the current entity through the throwing getter.
2. Mutates the store.
3. Dispatches the domain event immediately after the store mutation.
4. Performs persistence side effects (file writes) after the dispatch.

Input preparation that happens to touch disk (copying provided files to compute the values an entity is created with) stays before the store mutation. Only the entity's own persistence counts as a post-dispatch side effect.

```ts
CollectionsStore.set(collection);

Events.dispatch(CollectionCreatedEvent, collection);

await writeCollection(collection.id);
```

Events are dispatched without knowledge of subscribers. Never comment on why an event is dispatched or what listens to it, and never describe what a downstream package or owner does with the entity.

SQL sync is a side effect performed in event handlers, never in API functions. An API function mutates the store and files and dispatches its event; handlers registered in the package's `event-handlers/` perform the SQL work.

## Events and errors

Event name constants and their data types live in `events.ts`, with the data types registered on the `EventDataMap` module augmentation. Names follow `package:entity:action` (`collections:collection:created`, `collections:loaded`).

Each error is a class in `errors/`, named `<Entity><Reason>Error` (`CollectionNotFoundError`), exposed on the namespace with the entity prefix and `Error` suffix stripped.

## Package boundaries

Package code and comments never reference downstream consumers. Features never import other features: shared components go in a `ui/<domain>` package, shared events in the domain's core package. Single-instance event wiring is an `initializeX(): VoidFunction` function, not a null-rendering component.
