---
title: 'Package translations resolve only once registered'
package: packages/i18n
summary: "A package's keys render as raw keys until its initializer registers them, and registering before initializeI18n throws"
paths:
  - 'packages/i18n/src/initializeI18n/**'
  - 'packages/i18n/src/registerTranslations/**'
  - '**/src/locales/index.ts'
  - '**/test-utils/setup-tests.ts'
tags: [i18n, locales, initialization, tests]
---

# Package translations resolve only once registered

Translation keys live in the locale file of the package that renders them (`packages/databases/src/locales`, `features/properties/src/locales`), not in the global `packages/i18n` file. A package's keys exist only after its initializer calls `I18n.registerTranslations` (`Databases.initialize`, `initializeDatabasesUi`, a content view type's `locales` via `ContentViewTypes.register`). Until then `t()` returns the key itself, which typechecks and renders without an error.

- **In the app**, a new package locale file needs its initializer called by every host that renders it (`initializeDesktopApp`). Forgetting it shows raw keys in the UI and nothing fails.
- **In tests**, the `@minddrop/test-utils` text queries translate a key matcher only if the key is registered, so a test querying by key passes either way, while a test querying by English text fails. Register the translations a test renders in the package's test setup. Importing a core package's test-utils (`@minddrop/databases/test-utils`, `@minddrop/content-views/test-utils`) registers that package's translations as a side effect of its setup module.
- **Order**: `registerTranslations` before the first `initializeI18n()` throws (`addResourceBundle is not a function`), since i18next creates its store on init. Later `initializeI18n()` calls keep registered translations.
- Implicit metadata property names come from the `properties` translations, so `Properties.initialize` must run before databases load (see the databases translated identifiers gotcha).
