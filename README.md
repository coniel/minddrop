# MindDrop

MindDrop is a desktop app for organising your projects, studies, research, and ideas into databases built from plain Markdown files.

All your content lives in a database: a folder of entries that share the properties you define. The folder is a real folder on your disk and each entry is a real file inside it, so everything stays readable, editable, and portable with or without MindDrop.

- **Databases** give every entry the same typed properties, with entry templates and automations to keep them in step
- **Collections and queries** gather entries into groups, either picked by hand or matched by rules
- **Views** display a collection, query, or entire database as a board, table, gallery, or whatever else suits it
- **Spaces** combine several views into a custom-designed space built around a project, a topic, or an idea
- **The design studio** is a drag-and-drop canvas for designing how entries look as cards, rows, or a full page

MindDrop is free to use and licensed under the [AGPL-3.0](LICENSE). A Pro subscription adds encrypted sync across your devices, version history, publishing to the web, and AI features.

See [minddrop.app](https://minddrop.app) for more.

## Tech stack

The desktop app is built with [Electrobun](https://electrobun.dev) and [Bun](https://bun.com), with a [React](https://react.dev) 19 interface bundled by [Vite](https://vite.dev). Entries are read from and written to the file system as Markdown, JSON, or YAML. Alongside them, an SQLite database mirrors every entry and its properties, which lets the app start from SQL rather than from a full disk scan: it loads immediately, then reconciles against the file system in the background and patches its stores with whatever changed while it was closed. That same table is what queries run against. Full text search is [MiniSearch](https://lucaong.github.io/minisearch), held in memory, persisted to disk between runs, and rebuilt from SQL whenever it goes stale.

State lives in [Zustand](https://zustand.docs.pmnd.rs) stores, styling is plain CSS with a shared token layer, and packages talk to each other through a typed event bus rather than direct calls. The marketing site is a static [Astro](https://astro.build) build.

Everything is written in TypeScript, tested with [Vitest](https://vitest.dev), and managed as a [pnpm](https://pnpm.io) workspace orchestrated by [Turborepo](https://turborepo.com).

## Repository structure

The monorepo is split by role rather than by feature, so that the logic behind a feature can be used, and tested, without its interface.

| Directory     | Contents                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------ |
| `packages/`   | Core logic, with no UI: databases, properties, collections, queries, spaces, views, and the like |
| `features/`   | The React interface for each core package, one `@minddrop/feature-*` package per core package    |
| `ui/`         | Shared interface building blocks: primitives, composed components, icons, theme, drag and drop   |
| `data-views/` | The view types entries are displayed in: board, table, gallery, and notebook                     |
| `apps/`       | The desktop app, the marketing site, and the internal dev review tool                            |
| `dev/`        | Documentation and internal tooling that ships with the repo but not with the app                 |

Every package is consumed straight from source (`"main": "src/index"`), so there is no build step between packages and no compiled output to keep in sync.

### Core and feature packages

A core package owns a domain: its types, its stores, its file system and SQL side effects, and the API functions that make up its public surface. It exports one namespace per concept, such as `Databases` or `DatabaseEntries`, and it knows nothing about React.

Its matching feature package holds everything that renders: components, hooks, and the wiring between the two. So `packages/databases` defines what a database is and what you can do to one, while `features/databases` provides the interface for doing it.

## Getting started

MindDrop needs [Bun](https://bun.com) and [pnpm](https://pnpm.io). Install the workspace once from the repository root:

```
pnpm install
```

Then run the desktop app:

```
pnpm --filter @minddrop/desktop-2 dev
```

Or the marketing site:

```
pnpm --filter @minddrop/website dev
```

## Checks

Each of these runs across every package through Turborepo:

```
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

Add `--filter <package>` to any of them to narrow the run to a single package.
