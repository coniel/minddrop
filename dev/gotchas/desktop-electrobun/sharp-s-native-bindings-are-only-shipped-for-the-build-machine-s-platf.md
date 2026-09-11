---
title: "Sharp's native bindings are only shipped for the build machine's platform"
package: apps/desktop-electrobun
summary: "A build only bundles sharp bindings for the build machine; install other platforms' @img packages before electrobun build"
paths:
  - 'apps/desktop-electrobun/electrobun.config.ts'
  - 'apps/desktop-electrobun/src/bun/images/imageCache.ts'
tags: [sharp, build, cross-platform, images]
---

# Sharp's native bindings are only shipped for the build machine's platform

The image cache resizes via `sharp`, whose native bindings load at runtime through `require('@img/sharp-<platform>/sharp.node')` — the bundled bun code does not inline them. `electrobun.config.ts` copies `../../node_modules/@img` into the app bundle so the require resolves without a `node_modules` tree, but pnpm only installs the `@img` package for the platform it ran on. A build produced on macOS therefore ships no Linux or Windows bindings.

Nothing surfaces when this happens: `getResizedImage` catches the load failure and serves the original image, so the app works and only the perf win is lost. Cross-platform builds need the other platforms' `@img` packages installed before `electrobun build` runs.
