---
title: 'Electrobun imports need a synced Hutch devkit'
package: apps/desktop-electrobun
summary: 'The electrobun npm package exports only an error; run `npx electrobun sync` per app to project .hutch/devkit before building or typechecking'
paths:
  - 'apps/desktop-electrobun/tsconfig.json'
  - 'apps/desktop-electrobun/vite.config.ts'
  - 'hutch.config.ts'
tags: [electrobun, hutch, build, devkit, checkout]
---

# Electrobun imports need a synced Hutch devkit

Since Electrobun 2, the `electrobun` npm package is a bootstrapper that downloads Hutch and forwards to it. Its export map points every subpath at `lib/moved.cjs`, which throws — the real SDK is projected into a gitignored `.hutch/devkit/` per app by `npx electrobun sync`, and that is what `electrobun/bun`, `electrobun/view` and `electrobun/main` resolve through.

So a fresh checkout, a newly merged branch or any worktree that has not synced fails on every `electrobun` import: the app tsconfigs extend `./.hutch/devkit/tsconfig.json` for the path aliases, and both Vite configs call `electrobunViteAliases()` against that directory. The failure reads as a module resolution error, which looks like a broken merge or a bad install rather than a missing step. `pnpm i` does not fix it and neither does deleting `node_modules`.

Run `npx electrobun sync` once in each app directory — `apps/desktop-electrobun` and `apps/dev-tools` have separate devkits. The downloads are cached in `~/.hutch` and shared, so only the first is slow.

The root `hutch.config.ts` declares `packageManager: 'pnpm'`. Without it Hutch's built-in resolver ignores `pnpm-lock.yaml` and writes its own `hutch.lock`, splitting the workspace off its lockfile.
