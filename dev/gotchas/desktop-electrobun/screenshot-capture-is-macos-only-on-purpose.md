---
title: 'Screenshot capture is macOS-only on purpose'
package: apps/desktop-electrobun
summary: 'screenshotRpc is intentionally macOS-only (dev tooling), keep the darwin guard unless screenshots become a user feature'
paths:
  - 'apps/desktop-electrobun/src/bun/screenshotRpc.ts'
tags: [screenshots, macos, cross-platform, rpc]
---

# Screenshot capture is macOS-only on purpose

`screenshotRpc.ts` shells out to the macOS `screencapture` binary and throws on any other platform. This is a known exception to the cross-platform rule: the RPC backs dev tooling (design screenshots), not runtime user functionality, so it was left platform-specific rather than reimplemented portably. If screenshots ever become a user feature, this needs a per-platform implementation; until then the `process.platform !== 'darwin'` guard is the intended behaviour.
