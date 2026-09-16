---
title: 'Only one Electrobun app can run in dev at a time'
package: apps/desktop-electrobun
summary: 'A running `electrobun dev` blocks every other Electrobun build machine-wide, even from an unrelated repo; the build waits silently because its message is buffered behind vite output'
paths:
  - 'apps/desktop-electrobun/package.json'
  - 'apps/dev-tools/package.json'
tags: [electrobun, hutch, locks, dev, build, hang]
---

# Only one Electrobun app can run in dev at a time

Start the desktop app with `bun run dev`, then try to start the dev tools app, and the second one hangs after vite prints `built in 2.1s`. No error, no bundle, no app window. Quit the first app and the second instantly reports `electrobun build complete` and opens.

This is a lock, not a build failure. A running `electrobun dev` holds a lease for its whole lifetime, and `electrobun build` waits for it. The scope is **the whole machine**: moving one app into its own repo does not help, which was tested. The engine carries an internal error named `BuildReadLeaseNameCollision`, which suggests the lease name is derived from something shared rather than from the app directory, but that is not confirmed.

Two things make it read as a hang rather than a wait:

- The build does print `[electrobun] Waiting for the project build lock...`, but `bun run dev` is `vite build && electrobun build`, and the message sits buffered behind vite's output.
- While it waits it **holds** `~/.hutch/state/locks/graph.lock`, so every other Electrobun command anywhere on the machine now blocks too, including ones in other checkouts.

So run one app in dev at a time. To use both, build the one you are not working on and run the built app, which starts no dev supervisor and takes no lease.

## A killed build orphans its lock holder

`Ctrl-C` or killing the `npx electrobun build` wrapper does not stop `hutch-engine`. The child survives, keeps holding the global lock, and every later build hangs with no output — including builds that would otherwise have succeeded. A pile of `apps/*/.cottontail-tmp/electrobun/<pid>/` directories is the sign that this has happened repeatedly.

```sh
pkill -f "hutch-engine electrobun build"
```

Leave `hutch-engine electrobun dev` alone unless you mean to stop the app; it is not the process holding the lock.
