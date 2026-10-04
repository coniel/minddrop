# Translations

How translation keys are organised, and when two strings share a key.

## Key by meaning, not by string

A key stands for one meaning. Two keys holding the same English are correct whenever their meanings differ, because translations diverge where English does not: grammatical gender, case, and English words which can be either a verb or a noun. A confirmation button and a menu action both reading "Delete" can take different forms in an inflected language, so they keep separate keys. A duplicate English string is not by itself a defect.

## Entity nouns come from the glossary

Entity names are the exception. Each is one meaning, part of the product's vocabulary. They are defined once, so the term stays consistent and renaming one is a single edit. Every entity noun has a singular and a plural key under its domain's `labels` section, in the locale file of the domain's core package (`packages/databases/src/locales/en-GB.json` for databases and entries):

| Entity       | Singular                        | Plural                           |
| ------------ | ------------------------------- | -------------------------------- |
| Automation   | `automations.labels.automation` | `automations.labels.automations` |
| Collection   | `collections.labels.collection` | `collections.labels.collections` |
| Content view | `contentViews.labels.view`      | `contentViews.labels.views`      |
| Database     | `databases.labels.database`     | `databases.labels.databases`     |
| Entry        | `databases.labels.entry`        | `databases.labels.entries`       |
| Design       | `designs.labels.design`         | `designs.labels.designs`         |
| Group        | `entityGroups.labels.group`     | `entityGroups.labels.groups`     |
| Property     | `properties.labels.property`    | `properties.labels.properties`   |
| Query        | `queries.labels.query`          | `queries.labels.queries`         |
| Space        | `spaces.labels.space`           | `spaces.labels.spaces`           |
| Tag          | `tags.labels.tag`               | `tags.labels.tags`               |
| Tag group    | `tags.labels.tagGroup`          | `tags.labels.tagGroups`          |
| Workspace    | `workspaces.labels.workspace`   | `workspaces.labels.workspaces`   |

Use the glossary key wherever the noun stands alone in a label slot: a heading, a menu item, a tab, a group heading in a picker, a chip. Never restate a noun in a package's own locale file.

The glossary lives in the core package rather than in a feature because every package rendering a noun depends on its domain's core package, whose initializer registers it. A test rendering another domain's noun needs that core package's translations registered: importing its test-utils does this for the packages whose setup registers them (`@minddrop/databases/test-utils`), otherwise call its initializer in the test setup. Automation and design nouns stay in the core bundle until those packages register translations of their own.

A new entity adds its singular and plural to the glossary.

## Fragments never share a key

A noun inside a sentence or phrase ("Add collection", "No queries", "Delete database?") is not a glossary entry. The surrounding grammar decides its form, so the whole phrase is one key, kept in the package which renders it.

## Singular and plural are separate keys

Not i18next plural forms (`_one` / `_other`). Those need the call site to pass `count`, and components take a bare `TranslationKey` through a `label` prop which translates without options.

## Everything else is keyed where it is used

Contextual strings live in the locale file of the package which renders them, under that package's domain section. After editing any `locales/en-GB.json`, run `bun packages/scripts/generate-i18n-types.ts` from the repo root to regenerate `packages/i18n/src/i18n-resources.d.ts`.

- **One owner per key.** A key used by one package lives in that package. A key shared between a domain's core package and its feature or UI packages, or between several packages of one domain, lives in the core package (`packages/databases` owns the keys `features/databases` and `ui/databases` share).
- **Global keys.** The core bundle keeps strings rendered by `ui/primitives` and `ui/components` (which every package renders), app-wide strings (`actions`, `error`, `formErrors`, `color`, `toast`) and the legacy designs strings. A key used by a package outside the domain whose section it sits in is renamed into the user's section, unless the user is `ui/components`, which has no section of its own: its domain components (`DatabaseCombobox`) use their domain's keys, owned by the domain's core package.
- **Registration.** A package registers its locale file in its initializer (`Databases.initialize`, `initializeDatabasesUi`), which every host rendering the package calls. A content view type passes its translations as the `locales` field of its config, registered by `ContentViewTypes.register`. Test setups register the translations their tests render.
