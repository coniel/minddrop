---
title: 'A date built before vi.setSystemTime fails instanceof Date'
package: repo-wide
summary: 'vi.setSystemTime replaces the global Date class, so a Date built at module scope before a test pins the clock is not an instance of the Date the code under test sees. Build test dates after pinning, in beforeEach or the test.'
paths:
  - '**/*.test.ts'
  - '**/*.test.tsx'
tags: [testing, dates, fake-timers]
---

# A date built before vi.setSystemTime fails instanceof Date

`vi.setSystemTime` installs a fake `Date` class in place of the global one. A date built before the call, such as a module-level fixture, is an instance of the original class. Code under test which checks `value instanceof Date` after the clock is pinned compares against the fake class and gets `false`, so the value is treated as not a date and the test fails with no mention of the clock.

Build the dates a test hands to the code under test after pinning the clock, in `beforeEach` or inside the test, or pin the clock at module scope before building them. The pinned `now` itself can be built before the call, since only the code under test's `instanceof` check is affected.
