---
title: 'Events.tests.cleanup() breaks store hydration for the rest of a test run'
package: packages/stores
summary: 'Never call Events.tests.cleanup() in suites that hydrate stores; it removes the one-time stores:hydrate listener for good'
paths:
  - 'packages/stores/src/createStorePersistence/**'
  - 'packages/stores/src/createKeyValueStore/**'
  - 'ui/theme/src/test-utils/initialize-tests.ts'
  - 'features/desktop-app/src/test-utils/initialize-tests.ts'
tags: [stores, events, testing, hydration]
---

# `Events.tests.cleanup()` breaks store hydration for the rest of a test run

`createKeyValueStore`/`createObjectStore`/`createArrayStore` register a `stores:hydrate` listener once, when the store module is first loaded. `Events.tests.cleanup()` removes it along with every other listener, and nothing ever registers it again, so every later `hydrate()` call hangs: it dispatches its request and waits forever for a response it can no longer receive.

This bites any test suite that both calls `Events.tests.cleanup()` in cleanup and awaits something which hydrates a store. It presents as a timeout in whichever hook or test awaits the hydration, or — if the hydrating call is not awaited — as the code after it silently never running.

In such a suite, remove only the listeners the tests registered rather than calling the events cleanup, and register a stand-in for the platform layer that answers `stores:hydrate-request` with a `stores:hydrate` event (see `ui/theme/src/test-utils/initialize-tests.ts`). The desktop-app feature's test cleanup skips the events cleanup for the same reason. Note that listener IDs are unique per event, so stale test listeners must still be removed or they will shadow the next test's registration. Making the stores re-register their listener on demand would remove the exception, but that is a change to how persistent stores initialize rather than a test fix.
