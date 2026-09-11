---
title: 'index.ts files with definitions predating the barrel-only rule'
package: repo
summary: 'These index.ts files still define values; split definitions into named sibling files when work next touches them'
paths:
  - 'packages/databases/src/index.ts'
  - 'packages/databases/src/automation-action-configs/index.ts'
  - 'packages/databases/src/database-templates/index.ts'
  - 'packages/databases/src/entry-serializers/index.ts'
  - 'packages/i18n/src/index.ts'
  - 'packages/properties/src/schemas/index.ts'
  - 'packages/utils/src/index.ts'
  - 'ui/primitives/src/test-utils/index.ts'
tags: [barrels, index, tech-debt]
---

# index.ts files with definitions predating the barrel-only rule

index.ts files are now strictly barrel exports (see CLAUDE.md, adopted 2026-08-19; `locales/index.ts` building the locales map is the one exception). The new designs packages comply, but older code still defines things in barrels. Known offenders to split when work next touches them:

- `packages/databases/src/index.ts` (`DatabaseFixtures` assembly)
- `packages/databases/src/automation-action-configs/index.ts` (`coreDatabaseAutomationActionConfigs`)
- `packages/databases/src/database-templates/index.ts` (`coreDatabaseTemplates`)
- `packages/databases/src/entry-serializers/index.ts` (`coreEntrySerializers`)
- `packages/i18n/src/index.ts` (`useTranslation`, `translateDynamic`, `I18n` facade, more)
- `packages/properties/src/schemas/index.ts` (`PropertySchemas`)
- `packages/utils/src/index.ts` (`YAML` facade)
- `ui/primitives/src/test-utils/index.ts` (`i18nTestString`)

App entry points (`apps/*/src/**/index.ts`) are not barrels and are fine as they are.
