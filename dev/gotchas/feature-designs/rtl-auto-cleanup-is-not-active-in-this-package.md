---
title: 'RTL auto-cleanup is not active in this package'
package: features/designs
summary: 'Component tests in features/designs must call RTL cleanup in afterEach before fixture cleanup; vitest runs without globals'
paths:
  - 'features/designs/vitest.config.ts'
  - 'features/designs/src/test-utils/**'
tags: [testing, vitest, react-testing-library, cleanup]
---

# RTL auto-cleanup is not active in this package

The vitest config runs without globals, so React Testing Library never registers its automatic `cleanup`. Component tests must call RTL `cleanup` (re-exported from `@minddrop/test-utils`) in `afterEach` **before** the fixture cleanup, or queries in later tests match stale DOM from earlier ones.
