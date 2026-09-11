---
title: 'Builder canvas tests report unhandled SQL rejections'
package: features/queries
summary: 'Mock Queries.useNodeResults in QueryBuilderCanvas tests to silence unhandled SQL database not initialized rejections'
paths:
  - 'features/queries/src/QueryBuilderCanvas/QueryBuilderCanvas.test.tsx'
  - 'packages/queries/src/useQueryNodeResults.ts'
tags: [tests, vitest, sql, mocks]
---

# Builder canvas tests report unhandled SQL rejections

Rendering `QueryBuilderCanvas` in tests mounts the results node's entries list, whose `useQueryNodeResults` effect calls `runQueryNode` and rejects with "SQL database not initialized" (the mock file system provides no SQL connection). The tests themselves pass, but vitest reports the rejections as unhandled errors at the end of the run (8 across the suite as of 2026-08-10). Mock `Queries.useNodeResults` (alongside the existing `useNodeCounts` mock) to silence them when adding builder tests.
