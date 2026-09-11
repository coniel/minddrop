---
title: 'ScrollArea needs a getAnimations polyfill in happy-dom tests'
package: ui/primitives
summary: 'Tests rendering ScrollArea under happy-dom need Element.prototype.getAnimations polyfilled in the test setup'
paths:
  - 'ui/primitives/src/ScrollArea/**'
  - 'packages/test-utils/src/testing-library-react.tsx'
  - 'features/spaces/src/test-utils/setup-tests.ts'
tags: [scrollarea, happy-dom, testing, polyfill]
---

# `ScrollArea` needs a `getAnimations` polyfill in happy-dom tests

The base-ui scroll area polls `Element.getAnimations` on a timer, which happy-dom does not implement — tests rendering `ScrollArea` throw unhandled `viewport.getAnimations is not a function` errors after teardown. Polyfill it in the package's test setup (`Element.prototype.getAnimations = () => []`, see `features/spaces/src/test-utils/setup-tests.ts`).
