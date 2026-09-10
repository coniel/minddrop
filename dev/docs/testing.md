# Testing

How tests are written in this codebase. The governing rule is that a test only counts once it has been seen to fail for the right reason. A test that has only ever been green is an untested test, and this codebase has shipped bugs behind several of them.

The reference suites are `packages/designs-next` (core: pure utils, API functions, store and events) and `ui/designs-next` (UI: rendering and interaction).

## The rule

**Never keep a test you have not watched fail.** Passing against correct code proves only that the test does not falsely fail. It says nothing about whether the test can fail at all, which is the property you actually want.

There are two ways to get that evidence, and either is fine:

- **Write the test first** and watch it go red before the code exists.
- **Mutate the mechanism** after the fact: break the thing the test claims to cover, confirm that test fails, restore.

Both are cheap. A scripted mutation sweep over nine mechanisms in one component takes about a minute.

### Red is weaker than wrong

The red step proves a test fails when the behaviour is **absent**. It does not prove the test fails when the behaviour is **wrong**. Those come apart whenever the test's model of the world is itself mistaken, and that is exactly where the expensive bugs live.

A worked example from `DesignBlockEditor`. Six tests asserted that the element insert menu was open after the user's gesture. All six were green. The feature was broken in the browser: the menu opened on `pointerup`, and the `click` a browser fires immediately after dismissed it again. The tests never saw it because `fireEvent.pointerUp` does not synthesize the trailing `click`. Written test-first, they would have gone red (no implementation), then green (implementation on `pointerup`), and the bug would have shipped anyway. The flaw was in the event sequence the test modelled, not in the order the test was written.

So: prefer test-first where it fits, but treat "does this test model what the browser actually does?" as a separate question that the red step does not answer.

## When to write tests first

**Core packages: yes, by default.** Pure utils, API functions, store mutations, validation. The behaviour is specifiable before it exists, the test environment has no gap with reality, and every core API function needs tests regardless. Writing `floorToMultiple`'s tests first pins the floor-versus-round semantics before the implementation can quietly pick one.

**Interaction and visual work: no.** Where the specification emerges from looking at the thing — how bright a marker is, how long a press waits before it counts as a drag, which grid square a pointer belongs to — tests written up front are churn, and they anchor the implementation to the first guess. Build it, settle it, then mutation-verify the tests you keep.

## What the environment cannot see

`vitest` runs against jsdom, which is not a browser. It does not lay anything out and it does not implement pointer semantics. Three gaps have each produced a bug here:

- **Derived events do not fire.** `fireEvent` dispatches exactly the event named. A browser derives `click` from a press-release pair, and `mouseover`/`mouseout` pairs from movement; jsdom derives nothing. A gesture test must fire the whole sequence by hand, including the trailing `click`. `userEvent` synthesizes more of it and is the better default for multi-event gestures.
- **`getBoundingClientRect` returns zeroes.** Anything reading measured geometry silently takes its fallback path. Tests that need a real measurement stub the method on the element (see `divides pointer deltas by the measured display scale`).
- **Third-party pointer behaviour is absent.** Base UI's popover dismissal, focus management and hover interactions do not run. A menu that closes itself in the browser stays open in jsdom.

When behaviour cannot be expressed in this environment, **leave it to end-to-end tests in a proper framework rather than writing a unit test that only looks like coverage**. A green test that cannot fail is worse than no test: it stops anyone looking.

Where a unit test pins the _contract_ a fix relies on but cannot reproduce the browser behaviour that caused the bug, say so in the test name or a comment, so its green is not read as more than it is.

## Test rot

A test can be correct when written and vacuous later. In `DesignBlockEditor`, `fireEvent.click(title)` asserting that a click on a block leaves the selection alone was real while selection ran on `click`; when selection moved to `pointerdown` the assertion triggered no code path at all and passed regardless of what the guard did.

Neither test-first nor a one-time mutation check catches this. **When you change the mechanism a behaviour runs on, re-verify the tests that cover it** — the ones that keep passing without modification are the suspects.

## Structure

Tests sit beside the code they cover, in the same directory: `createDesign/createDesign.test.ts`, `DesignBlockEditor/DesignBlockEditor.test.tsx`. A file with a test is a file with a companion, so it lives in its own directory behind a barrel `index.ts`.

Each package owns a `src/test-utils/` directory exporting `setup` and `cleanup` plus its fixtures, and re-exports them from `<package>/test-utils`. `setup` loads fixtures into the store and installs fake timers; `cleanup` clears stores, settles the mock file system and restores timers.

```ts
describe('createDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);
});
```

UI packages add their own `src/test-utils.ts` on top, registering translations and any element configs the rendered components resolve.

## Fixtures

**Never build mock objects by hand.** Spread from a fixture instead, so a change to the entity shape reaches every test.

**Destructure from the main fixture object**, never import a fixture file directly:

```ts
// GOOD
const { dataView_gallery_1 } = DataViewFixtures;

// BAD
import { dataView_gallery_1 } from '../test-utils/fixtures/data-views.fixtures';
```

Fixture modules are exported twice from a package's `test-utils` barrel — flat, and namespaced as `DesignFixtures`, `ElementConfigFixtures` — and the namespaced form is the one to use.

### Naming

A fixture is named `<type>_<number>`, `<type>_<variant>` or `<type>_<variant>_<number>`, with the entity type in camelCase and the variant naming what makes this one different.

```ts
tag_1; // nothing distinctive about it
dataView_gallery_1; // a gallery view
sidebarGroup_library; // the library group
```

Reading the name tells you which fixture you are looking at without opening the file, and the numbers stay attached to their variant rather than running across the whole type.

**Number the ordinary ones from the start, even where there is only one.** A plain fixture of a type and a basic variant of it both take a number — `dataView_1`, `dataView_board_1` — so that the second one a later test needs can be added without renaming the first out from under everything already using it.

Leave the number off only where a second one makes no sense: a singleton such as `sidebarGroup_library`, or a variant standing for one specific case such as `sidebarGroup_empty`.

**The fixture's ID is its name**, with only the leading type swapped for the entity type the ID has to carry. Everything after it, variant and number included, stays as written, so an ID in a failure message points straight back at the fixture it came from:

```ts
tag_1.id === 'tag_1';
dataView_gallery_1.id === 'data-view_gallery_1';
sidebarGroup_empty.id === 'sidebar-group_empty';
```

The collection exported alongside the fixtures takes the plural of the type with no underscore: `dataViews`, `sidebarGroups`.

### Reference fixture values, never retype them

A test names a fixture value by reading it off the fixture, so that changing the fixture reaches the test:

```ts
// GOOD
expect(resolveDataViewId(path)).toBe(dataView_gallery_1.id);

// BAD
expect(resolveDataViewId(path)).toBe('data-view_gallery_1');
```

A literal is right only where the value is deliberately _not_ a fixture: an ID for an entity which does not exist, standing in for a missing item or a bad lookup.

### Never reinvent another package's fixtures

Each package exports its fixtures for other packages to use, and a consumer never writes its own version of another type's data. **An ID is data like any other**: read it off the owning package's fixture rather than writing the string out.

```ts
// GOOD
const { objectDatabase, objectEntry1 } = DatabaseFixtures;
const { space_1 } = SpaceFixtures;

items: [objectDatabase.id, space_1.id];

// BAD, an entry ID's shape is the databases package's to change
const entryId_1 = 'database-entry_1';
```

Where a consumer needs a fixture which does not exist yet, or needs a new one, **it goes in the type's own package**, not the consumer's. That way one edit covers every test using it.

Fixtures reach other packages through a `./test-utils` subpath in the package's `exports` map, so nothing production code imports resolves into `src/test-utils` and the fixtures never ship:

```json
"exports": {
  ".": "./src/index.ts",
  "./test-utils": "./src/test-utils/index.ts"
}
```

A dependency only the fixtures need belongs in `devDependencies`.

One ordering note: importing another package's `test-utils` runs its `initializeMockFileSystem()`, and the last call wins. A package's own call has to come after the ones its fixtures trigger, which it does as long as it happens in the module body rather than inside an import.

`packages/data-views` is the reference for both naming and consuming — its fixtures read their workspace path off `WorkspaceFixtures`. Not every fixture file follows the naming yet — `packages/databases` has `objectEntry1` next to `rootStorageEntry_empty_value` — so copy the convention rather than the nearest existing file.

## Assert outcomes, not calls

**Avoid spies.** Check the store, the file system or the rendered output for the change the code was supposed to make. A spy asserts that a function was called, which is an implementation detail that survives the behaviour being wrong.

```ts
// GOOD
await createDesign({ type: 'card', name: 'My design' });

expect(DesignsStore).toHaveItem(design.id, newDesign);

// BAD
expect(writeDesignSpy).toHaveBeenCalledWith(design);
```

`Foo.Store` is exported for exactly this: tests read and seed stores directly, while app and feature code always goes through the API functions.

The mock file system is asserted the same way, through `MockFs.exists(path)` and its readers rather than through spies on `Fs`.

### Store matchers

Assert against the store itself, not against the result of reading it. `@minddrop/stores/test-utils` adds matchers that take the store as the received value, so a failure can say which store was read and what it actually held:

```ts
expect(DesignsStore).toHaveItem(design.id, newDesign); // holds this item
expect(DesignsStore).toHaveItem(design.id); // holds some item under the id
expect(DesignsStore).not.toHaveItem(deleted.id); // holds no such item
expect(DesignsStore).toHaveItems([design1, design2]); // holds exactly these, any order
expect(DesignsStore).toHaveItemCount(0);
expect(DevToolsEventsStore).toHaveItemOrder([event1.id, event2.id]); // array stores
expect(ThemeStore).toHaveStoredValue('variant', ThemeDark); // key-value stores
```

`toHaveItems` takes either the items or their identifiers, and ignores order — `getAllArray()` order is an accident of insertion for object and key-value stores, and pinning it makes tests fail for the wrong reason. Where order _is_ the behaviour, an array store has `toHaveItemOrder`.

The matchers distinguish a missing item from a mismatched one, which is the failure the old `expect(Store.get(id)).toEqual(x)` shape could not report:

```
Designs:Designs has no item "design_9". It holds: design_1, design_2.
```

The key-value matcher is `toHaveStoredValue`, not `toHaveValue`: jest-dom already owns `toHaveValue` for form elements.

To assert on an item's fields rather than the whole item, reach for `storeItem` instead of dodging the getter's nullable return with `?.` or `!`. It throws the same "has no item" message, so a missing item reports itself rather than surfacing as `expected undefined to be 'red'`:

```ts
// GOOD
const entry = storeItem(DatabaseEntriesStore, objectEntry1.id);

expect(entry.metadata.color).toBe('red');
expect(entry.properties.Color).toBe('red');

// BAD
const entry = DatabaseEntriesStore.get(objectEntry1.id);

expect(entry?.metadata.color).toBe('red');
expect(entry?.properties.Color).toBe('red');
```

The matchers register as an import side effect. A package's `src/test-utils/setup-tests.ts` imports `@minddrop/stores/test-utils`, which reaches every test importing that package's test-utils; a test that does not import them carries the side-effect import itself. This is also what makes the matcher types visible to `tsc --noEmit`, which a `setupFiles` entry would not be.

Events are asserted by listening for the real dispatch:

```ts
it('dispatches the design created event', async () =>
  new Promise<void>((done) => {
    Events.addListener(DesignCreatedEvent, 'test-design-created', (payload) => {
      expect(payload).toEqual(newDesign);
      done();
    });

    createDesign({ type: 'card', name: 'My design' });
  }));
```

## Naming

A test name states the behaviour, in the same voice as a JSDoc summary: `inserts the picked element type on the marked grid square`, `holds the marked area inside the design`, `leaves Backspace to editable controls`. Not `it('works')`, and not the name of the function under test.

Prefer a name that would read as a bug report if it failed. `marks the square a grid line closes rather than the one it opens` says what broke; `handles grid lines` does not.

## Coverage expectations

- **Core package API functions and utils: full coverage.** Pure functions and store mutations are cheap to test and are the layer everything else trusts.
- **UI components: the behaviour, not the markup.** Rendering assertions are worth having where the rendered result _is_ the behaviour (a block's position, a marked area's size), but assertions that merely restate the JSX are noise.
- **Interaction: cover what the environment can genuinely express**, mutation-verify it, and hand the rest to e2e.

## Running

Per package, from the package directory:

```
npx vitest run                    # the whole suite
npx vitest run src/DesignBlockEditor   # one directory
```

At the end of a round of work, run the affected packages' suites together with prettier, eslint and `tsc --noEmit`.
