---
title: 'UI icons never render in jsdom tests'
package: ui/icons
summary: 'Icon renders lucide-react DynamicIcon, which lazy loads and never resolves under vitest, so no test can assert on a UI icon'
paths:
  - 'ui/icons/src/IconsProvider.tsx'
  - 'ui/primitives/src/Icon/Icon.tsx'
tags: [icons, testing, jsdom, lucide]
---

# UI icons never render in jsdom tests

`IconsProvider` supplies `DynamicIcon` from `lucide-react/dynamic` as the `UiIcon`, which imports its icon on first render. The import never resolves within a test, so `<Icon />` renders nothing at all: no `svg`, and no element carrying its `data-testid="icon"`. It is the same in every test using `@minddrop/test-utils`, whose render wraps the tree in the provider.

Anything expressed only as a UI icon is therefore invisible to a test: a menu item's check, a submenu's chevron, an icon-only button's glyph. Assert on what else the markup carries (`aria-checked`, a class, the accessible label) or leave the state to an e2e test. `ContentIcon` is a different path and does render.
