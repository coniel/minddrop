---
title: 'Invalid t() keys can crash tsc, not just error'
package: packages/i18n
summary: 'An invalid t() key or passing t to a (key: string) param can crash tsc with Debug Failure; type params as TranslationKey'
paths:
  - 'packages/i18n/src/**'
tags: [i18n, typescript, tsc-crash, translation-key]
---

# Invalid `t()` keys can crash tsc, not just error

Calling `t()` with a key missing from the generated union (especially with an interpolation options argument) can crash the TypeScript compiler with `Debug Failure. No error for last overload signature` instead of reporting a normal error — a known i18next typing bug. The crash reports no file name. The same crash fires when passing the overloaded `t` function into a parameter typed `(key: string) => string` (type such parameters as `(key: TranslationKey) => string` instead).

To locate the offending file, request per-file semantic diagnostics via the TS API in a try/catch loop over the program's source files (a tsc run dies on the first crash without naming the file).
