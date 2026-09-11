# Writing components

How React components are laid out in this codebase. The two governing rules are that a file holds exactly one component, and that a helper a second component could call belongs in `utils/` rather than in a component file. Everything else here follows from those.

`dev/docs/project-structure.md` decides which package a component belongs in; this doc covers what happens once it is there. `dev/docs/commenting.md` governs the JSDoc.

## One component per file

A file exports one component, named after the file. Navigation in this codebase is by file name: if a component is worth naming, it is worth being findable by that name.

A component with no companion files lives directly in the package's `src`:

```
src/DesignPreviewPane.tsx
```

One with companions (a stylesheet, tests, sidecar components) is wrapped in a directory with a barrel `index.ts`:

```
src/DesignBlockEditor/
  DesignBlockEditor.tsx
  DesignBlockEditor.css
  DesignBlockEditor.test.tsx
  index.ts            // export * from './DesignBlockEditor';
```

Do not wrap a solo file in a directory on the expectation of companions later. Wrap it when the second file appears.

The one exception to the rule is the companion component described under [Render functions](#render-functions).

## Sidecar components

A component that exists only to be part of one other component — it will never be rendered on its own, and never by a second component elsewhere — is a **sidecar**: its own file, flat inside the parent component's directory, not exported from the package.

```
src/DesignBlockEditor/
  DesignBlockEditor.tsx
  DesignBlockEditor.css
  DesignBlockEditor.test.tsx
  SizeLabel.tsx        // rendered only by DesignBlockEditor
  SizeLabel.css
  SizeLabel.test.tsx
  index.ts             // exports DesignBlockEditor only
```

The parent imports it by relative path (`./SizeLabel`). The directory barrel exports the main component only, so the package's public surface stays one component per directory.

A sidecar's own companions stay flat beside it rather than gaining a nested directory: the parent's directory is already the wrapper. The `minddrop/companion-directory` lint rule exempts them on exactly that basis — a file whose directory is named after another file in it.

The moment a sidecar is wanted by a second component, it stops being a sidecar. Promote it to its own directory in the package, or to a `ui/[domain]` package if the second consumer lives elsewhere.

**The test is intent, not size.** A twenty-line sub-component that only ever renders inside one parent is a sidecar. A four-line component two features render is not — it belongs to the package.

## Helpers: component file or `utils/`

The problem this rule is aimed at is duplication. The same helper gets rewritten inside a dozen component files, each copy slightly different, none of them tested. A util in `utils/` is written once, tested once, and found by the next person who needs it.

But duplication has a shape. It happens to functions a second component _could_ have called. A helper that hard-codes one component's class strings cannot be duplicated by anyone, and moving it to `utils/` only fills that directory with noise nobody can reuse.

So the test is not size, and not specificity:

> **Could a second component ever call this?**

- **No — it stays in the component file.** The function names this component's class strings, encodes its markup structure, or is typed to its props. Nothing outside the file can use it, so nothing outside the file will duplicate it. Class-name resolvers, render helpers, formatters shaped around this component's own data.
- **Yes — it goes in `utils/`.** The function takes plain values and returns plain values without referring to this component. Someone will write it again. `clamp`, geometry, date and number formatting, anything a second component would recognise as the thing it wanted.

A worked pair from `ui/designs-next`:

- `resolveTextSettingsClass(element)` — called by two element renderers in a different package. A util, and correctly so.
- `resolveSurfaceClass(gridOverBlocks, gridInFront)` — returns `design-block-editor` class strings. No second caller is possible. Stays in `DesignBlockEditor.tsx`.

### The corroborating signal: do you want to test it directly?

`utils/` directories carry tests. If a helper has edge cases you want to pin down in isolation, it deserves its own util directory and test file. If it is fully covered through the component's own tests, it stays in the component file.

This settles the borderline cases mechanically. `resolveSizeLabelFontSize` has fitting math with edges worth testing on their own, which is the tell that it wanted to be a util. `resolveSurfaceClass` is exercised by every editor test that asserts on the surface's classes and needs nothing of its own.

### Where the util goes

Once a function is a util, check in this order, and check **before writing anything**:

1. **`packages/utils`** — does it already exist? Grep before you write. Duplicating an existing util is the failure this rule is aimed at.
2. **`packages/utils`, as a new util** — would it make sense to any package in the workspace, with no knowledge of this domain? `clamp`, `toKebabCase`, `reorderArray`. Domain-free things go global.
3. **The package's own `utils/`** — everything else. `formatSnapUnits` knows what a snap resolution is, so it belongs to `ui/designs-next`.

One directory per util:

```
src/utils/formatSnapUnits/
  formatSnapUnits.ts
  formatSnapUnits.test.ts
  index.ts
src/utils/index.ts       // barrel re-exporting each util
```

Utils are pure: they read and transform their arguments. Anything that writes to a store, dispatches an event or touches disk is not a util (see `dev/docs/package-api-conventions.md`).

Do not reach into another feature package's `utils/`. If two packages want the same domain util, it belongs in the domain's core package or in `packages/utils`.

### Handlers are not helpers

A component's event handlers are part of the component either way. They close over its props and state, so they stay inside it, declared below the hooks per the ordering convention. The question above only applies to functions that map arguments to a result.

Trivial inline expressions need neither a util nor a name — `` `${count} items` `` in JSX is not a formatter.

## Render functions

A prop that renders something (`renderItem`, `renderCell`) never gets an inline function literal in JSX:

```tsx
// Not this
<SortableList
  renderItem={(id, sortable) => {
    const workspace = workspaces.find((workspace) => workspace.id === id);
    ...
    return <WorkspaceButton workspace={workspace} sortable={sortable} />;
  }}
/>
```

Where it goes instead depends on how many instances of the surrounding component are on screen.

- **A single instance** (a sidebar, a toolbar, a switcher): declare the render function in the component body, below the hooks with the handlers, and pass it by reference. It closes over the component's state like a handler does, and the one instance recreating it per render costs nothing.
- **Many instances** (a card, a row, a cell): extract the rendered piece into a standalone component so the lookup and the closure are not rebuilt per instance per render. Give it its own props and let it read what it needs from the stores itself.

A component extracted this way is the one exception to the one component per file rule. If it purely adds behaviour, props or a data lookup on top of a single existing component — a `SortableWorkspaceButton` that takes an ID and the sortable props, resolves the workspace and renders `WorkspaceButton` — it is a **companion**: it lives in the same file as the component that renders it, below that component and unexported from the package. Anything with markup or a stylesheet of its own is a sidecar or a component in its own right, and follows the rules above.

## Inside the file

Order within a component file:

1. The props interface, with JSDoc on every prop.
2. The component, with its JSDoc.
3. The component's own helpers, below it, unexported.

Hook order inside the component: `useRef`, `useState`, `useMemo`, custom hooks, derived values and plain declarations, `useEffect`, then callbacks and handlers.

Styling goes in the companion stylesheet, with class names namespaced to the component's feature (`design-block-editor-size-label`). Inline styles are for dynamic values only — positions computed from props, user-configured sizes — and even then prefer handing the stylesheet a CSS custom property over hard-coding the whole declaration in JS.

Build from `ui/primitives` rather than raw elements: `TextInput`, `Select`, `Group`, `Stack`, `Icon`. A custom-styled `div` where a primitive exists is a bug report waiting to be filed against the theme.
