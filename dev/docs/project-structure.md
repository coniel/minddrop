# Project Structure

Where code goes and why. The workspace is split into layers by
**ownership**, not by size or complexity: each layer is defined by how
much of the app it is allowed to know about.

## The layers

| Directory       | Contains                                                 | May depend on          |
| --------------- | -------------------------------------------------------- | ---------------------- |
| `packages/`     | Data, APIs, stores, events. **No UI.**                   | other `packages/`      |
| `ui/primitives` | Low-level, domain-free building blocks                   | `ui/theme`, `ui/icons` |
| `ui/[domain]`   | Domain-aware, prop-driven components. **No app wiring.** | `packages/`, `ui/*`    |
| `features/`     | The app wiring: singletons, registration, event handlers | anything               |
| `data-views/`   | Registry contributions: the built-in data view types     | `packages/`, `ui/*`    |
| `apps/`         | The shipped applications                                 | anything               |

The dependency direction is strictly downward. In particular:

- **Nothing may depend on `features/`** except `apps/` and other
  `features/`. A feature package is a leaf.
- **`ui/` may never import from `features/`.** If a UI package needs
  something a feature owns, that is a signal the thing is misplaced or
  should be an event (see [Reaching the app](#reaching-the-app)).
- `data-views/` are view type plugins, not features. They must not
  depend on `features/` either.

## The placement test

The question is never "is this component complex enough to share?" It
is:

> **Does the thing install itself into the app, or does it render what
> it is handed?**

Something **installs itself** if it registers views or data view types,
initializes event handlers, opens tabs or dialogs, holds singleton
feature state, or is rendered once at the app root. That belongs in
`features/`.

Something **renders what it is handed** if it takes props and returns
UI, and reaches the rest of the app only by dispatching events. That
belongs in `ui/[domain]`, regardless of how much logic it contains.

Applied to `features/databases`, the split is:

- `DatabasesFeature`, `registerDatabaseViews`, the event handlers, the
  entry dialog, `DatabasesSidebarMenu`, `DatabaseView` — installs
  itself, stays a feature.
- `DatabaseEntryRenderer`, the entry drag hooks, the drop utils, the
  floating toolbar — prop-driven, belongs in `ui/databases`.

## Why features must be leaves

Features are the app's composition layer, and they are also the model
for extensions. An extension receives `packages/` APIs and `ui/`
components through `MindDropApi`; it never receives `features/`. So a
feature that other packages import is a feature doing something an
extension could not do, which means built-in functionality is quietly
privileged over third-party functionality.

Treating `features/` as leaves keeps built-in features honest: they are
peers of extensions, composed by the app rather than depended upon by
each other. When a feature needs to reuse another feature's UI, the
reusable part moves down into `ui/[domain]` where extensions can reach
it too.

`MindDropApi.Ui` is the practical consequence: it exposes
`ui/primitives` plus the `ui/[domain]` packages. "Is this in `ui/`?"
and "do extensions get this?" are the same question, which makes it a
useful forcing function when deciding placement.

## ui/[domain] vs ui/components

`ui/[domain]` packages mirror the core packages they build on:
`ui/databases` above `packages/databases`, `ui/data-views` above
`packages/data-views`, and so on. The pairing keeps each package small
and makes the home for a component obvious from its subject.

`ui/components` is the cross-domain remainder: complex components that
aren't about any one core domain (`PanelView`, `Setting`,
`ThemeVariantPicker`, `ImageViewer`).

### Placing components that span domains

Many components touch several core packages. Place them by **the entity
the component acts on, not everything it touches and not the nouns in
its name**:

- `DataSourceCombobox` reads collections, queries and databases, but it
  produces a data source → `ui/data-views`.
- `DataViewFloatingToolbar` is hosted by a data view, but every card is
  a database-entry action → `ui/databases`.
- `AddCollectionEntryButton` creates _database entries_, but it
  requires a `collectionId`, persists through `Collections.addItems`,
  and is unusable without a collection — the databases only filter what
  can be added → `ui/collections`.

The last one is the trap: "Entry" in the name suggests databases, and
it does create entries. The deciding question is what it acts on. A
useful check is the required props — a component that cannot render
without a `collectionId` is a collections component.

Placing by dependencies produces endless argument; placing by subject
is almost always unambiguous.

### Creating a ui/[domain] package

Create one **when a second consumer needs something**, not
preemptively. Until then the component can live in its feature package.
Naming follows the existing convention: directory `ui/databases`,
package `@minddrop/ui-databases`.

## Contributions

`data-views/` holds the built-in data view types (board, gallery,
notebook, table). They are not features, and not `ui/[domain]`
packages: they are **contributions** — implementations of a registry
that third parties will also fill.

The defining property is that a contribution **exports a descriptor and
does not register itself**. `data-views/board` exports
`BoardViewType` (component, options menu, skeleton, defaults);
`features/desktop-app` decides to register it:

```ts
// data-views/board/src/BoardViewType.ts
export const BoardViewType: DataViewType<...> = { type: 'board', component, settingsMenu, ... };

// features/desktop-app/src/initializeDesktopApp/initializeDataViewTypes.ts
DataViewTypes.register(BoardViewType);
```

That inversion is what keeps them out of `features/`: they do not
install themselves, so the placement test puts them below the feature
line, and the same dependency rules apply — a contribution may use
`packages/` and `ui/*`, never `features/`.

The reason to enforce it is conformance. A data view type is the most
obvious thing an extension will contribute, so the built-in ones are
written against exactly the API an extension gets. If they lived in
`features/` they could reach for feature packages, the built-in path
would drift from the extension path, and nothing would catch it.

Future registries (property types, editor plugins, design elements)
should follow the same shape: a top-level directory per registry, one
package per contribution, descriptor exported and registration left to
the app.

Naming: directory `data-views/<type>`, package
`@minddrop/data-view-<type>`. The `data-view-` prefix matters because
`@minddrop/views` is a different concept (code views); an unprefixed
`view-board` reads as if it belonged to that registry instead.

## Reaching the app

A prop-driven component sometimes needs an app-level action: opening an
entry in a tab, launching the design studio. It must not import the
feature that does this. Instead it **dispatches a domain event**, and
the owning feature's handler performs the wiring:

```
ui/databases: DatabaseEntryRenderer
  → dispatches OpenDatabaseEntryViewEvent
      → features/databases event handler
          → Tabs.open(...)
```

This is the same pattern used for SQL persistence (core API functions
dispatch; handlers do the side effect), and it is the only mechanism
extensions have, so a component built this way works identically for
built-in and third-party callers.

Actions that are inherently app-shell concerns (tabs, view areas,
panels) should be exposed as **APIs**, in `packages/` or through
`MindDropApi`, rather than as components. `Tabs` is app wiring and
correctly stays in `features/views`; what extensions need is
"open this in a tab", not the tab bar itself.

## Deciding where a new file goes

1. Is it data, an API, a store, or events, with no UI? → `packages/[domain]`.
2. Is it a domain-free building block (button, input, layout)? → `ui/primitives`.
3. Is it an implementation of a registry the app fills (a data view
   type, later a property type or editor plugin)? → the registry's
   directory, e.g. `data-views/`.
4. Does it install itself into the app (registration, event handlers,
   singleton state, root-rendered)? → `features/[domain]`.
5. Otherwise it is prop-driven UI: does it belong to one core domain?
   → `ui/[domain]` (create the package on the second consumer).
6. No single domain? → `ui/components`.

If a rule pulls two ways, the deciding question is whether an extension
could reasonably want the thing. If yes, it belongs below the feature
line.

## Health checks

Two edges that should stay clean, and are worth checking when adding
dependencies:

- No `package.json` under `ui/`, `packages/` or `data-views/` lists a
  `@minddrop/feature-*` dependency.
- `features/*` depend on each other only for composition inside
  `features/desktop-app`; a feature importing another feature's
  component means that component should move down.

## Current state

`ui/databases` is the first `ui/[domain]` package. The layering above
is otherwise still the target. Known gaps:

- `DatabaseEntryRenderer` is still in `features/databases`, so every
  built-in view type keeps a `@minddrop/feature-databases` dependency.
  It is blocked on `LayoutRenderer`: its element subtree reaches
  `@minddrop/feature-data-views` (`ViewDesignElement`) and
  `@minddrop/feature-markdown-editor` (`EditorDesignElement`,
  `FormattedTextElement`), so `ui/designs` cannot exist before
  `ui/data-views` and `ui/markdown-editor` do.
- `features/databases`, `features/designs` and `features/spaces` import
  renderers and editor fields from each other
  (`LayoutRenderer`, `DataViewRenderer`, `DataViewOptionsMenu`, the
  property editor fields). Each is prop-driven and should end up in
  `ui/designs`, `ui/data-views` and `ui/properties` respectively.
- `DataSourceCombobox` is still in `ui/components` and belongs in
  `ui/data-views`; it currently reaches into `ui/databases` for the
  database fallback icon.
- `AddCollectionEntryButton` is parked in `ui/components` and belongs
  in `ui/collections`, which has not been earned yet (one consumer).
  `ui/components` is the holding bucket for single-domain components
  whose package does not exist yet.

Migrate lazily: move a component down when it gains a second consumer
or when its feature is being worked on anyway, rather than as one
sweep.
