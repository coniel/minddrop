---
title: 'A listener which throws fails silently apart from the console'
package: packages/events
summary: 'dispatchEvent swallows listener errors to console.error; assert on listener outcomes in tests, not on dispatch resolving'
paths:
  - 'packages/events/src/dispatchEvent/**'
tags: [events, error-handling, testing]
---

# A listener which throws fails silently apart from the console

`dispatchEvent` catches whatever a listener throws, reports it with `console.error` and carries on to the remaining listeners, so that a listener cannot break the code which dispatched the event. That code has already done what the event reports and can neither prevent nor recover from a listener's failure.

The cost is that a listener throwing in a test does not fail the test. Assert on what a listener was supposed to do rather than on the dispatch resolving, and watch for `Event listener "..." failed handling "..."` in the output of a test that passes but should not.
