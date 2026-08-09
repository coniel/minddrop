# Contributing

Thanks for taking an interest in MindDrop. This document covers how the repository is put together and what is expected of a change before it is merged. Everyone taking part is expected to follow the [code of conduct](CODE_OF_CONDUCT.md).

## What to send

Issues are the most useful thing you can open, and they are welcome and encouraged. Bugs, papercuts, confusing behaviour, and ideas all belong there. For a small problem it is usually quicker for us to fix it directly than to review a patch for it, so please report it rather than assuming it needs a pull request attached.

Small fixes are welcome as pull requests: a bug, a typo, a broken edge case, a missing translation. Larger changes and new features are not, and will be closed. The source being open is about transparency, not shared authorship: what MindDrop becomes, and the form each feature takes, stays a decision made in one place.

If you want to build a feature, build it as an extension. The extensions system is in development and not yet available, so there is nothing to build against today, but it is where third party features are meant to live rather than in the core packages. It will be documented once it lands.

## Getting set up

You will need [Bun](https://bun.com) and [pnpm](https://pnpm.io). Install the workspace once from the repository root with `pnpm install`, then run the desktop app with `pnpm --filter @minddrop/desktop-2 dev`.

The [README](README.md) describes how the monorepo is divided. The short version: `packages/` holds core logic with no UI, `features/` holds the React interface for each core package, `ui/` holds shared building blocks, and `data-views/` holds the view types entries are displayed in.

## Where code goes

The split between a core package and its feature package is the important one. Anything that reads or writes data, touches the file system or SQL, or defines what a concept is belongs in the core package. Anything that renders belongs in the feature package. If you find yourself importing React into `packages/`, the code is probably in the wrong place.

Within a package, each exported function gets its own file named after it, so the file listing reads as the package's API. A file with companions, such as a test or a stylesheet, is wrapped in a directory of its own with a barrel `index.ts`; a file with no companions sits directly in its parent directory. Functions that only read or transform data live in the package's `utils/` directory, one directory per util with its test beside it. Anything that writes to a store or to disk is an API function in the package root instead.

Components follow the same shape. The main component sits at the top of its file, with any local helpers below it, and its styles go in a companion CSS file rather than inline. Build interfaces out of the existing primitives in `ui/primitives` rather than raw HTML elements or bespoke CSS, and use the tokens in `ui/theme/src/tokens.css` for colour and spacing.

User-facing strings are never hard coded. Add them to the package's `src/locales/en-GB.json` and read them through `@minddrop/i18n`.

## Comments

Comments are expected, and there are more of them here than in most codebases. The convention is a brief comment above every logical step in a function body, even simple ones, so that a function can be skimmed without being mentally parsed. Exported functions and components get a JSDoc block describing what they do, and interface properties are documented individually. Calibrate density against `packages/databases`, which is the reference.

Say what the code does rather than how it came to be. Comments should not narrate history, restate the obvious, or document behaviour that is simply what a reader would expect.

## Tests

Tests run on [Vitest](https://vitest.dev) and live beside the code they cover. Core package API functions should always have them.

Test what changed rather than what was called. Assert against the resulting state in the relevant store, and reach for spies only when there is no observable outcome to check. Build inputs by spreading the package's existing fixtures instead of writing mock objects by hand, so that a change to a shape does not quietly leave tests passing against something that no longer exists.

## Before opening a pull request

Run the checks over what you touched:

```
pnpm --filter <package> test
pnpm --filter <package> lint
pnpm --filter <package> typecheck
```

Formatting is handled by Prettier, and ESLint is configured per package. Run `pnpm format` from the root, or let your editor do it on save.

Keep each commit to one change, and prefix the message with the package it belongs to, as in `databases: add duplicateDatabaseEntry` or `feature-databases: wire up entry duplication in options menu`. Changes to translation files belong in the commit that introduced the strings. Describe the change itself and leave out the incidental details.

## Licensing

MindDrop is licensed under the [AGPL-3.0](LICENSE), and contributions are accepted under the same terms.
