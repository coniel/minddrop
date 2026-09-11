---
title: 'Test cleanups await Fs.tests.cleanup() before clearing stores'
package: packages/file-system
summary: 'Await Fs.tests.cleanup() then Events.tests.cleanup() before clearing stores in cleanup; hooks must return the promise'
paths:
  - 'packages/file-system/src/FileSystem/FileSystem.ts'
  - 'packages/file-system/src/trackAdapterOperations/**'
  - 'packages/file-system/src/PendingOperationsStore/**'
tags: [file-system, testing, cleanup, async]
---

# Test cleanups await `Fs.tests.cleanup()` before clearing stores

Operations dispatch their event right after the store mutation, with file writes and follow-up updates as side effects afterwards, so a test which resolves on an event can finish while its operation is still running. If cleanup then clears the stores, the operation's next store lookup throws as an unhandled rejection, which vitest attributes to whichever test runs next (the entry template editor's "adds the template on save" test hit this under parallel turbo load). The file-system package tracks every adapter operation for this reason: package cleanups are async and `await Fs.tests.cleanup()`, which waits for pending operations and then resets the mock file system, before clearing anything, then `await Events.tests.cleanup()`, which waits for pending dispatches in turn. Never fix such a failure by making the test wait for a specific internal step of the operation.

Because these cleanups are async, a hook has to return their promise: `afterEach(cleanup)` does, and a hook body which calls `cleanup()` must `await` it. A bare `cleanup();` inside `afterEach(() => { ... })` returns before the stores are cleared, so the next test starts on the previous test's state and fails in confusing ways ("expected [] to equal [...]" on a freshly loaded fixture).
