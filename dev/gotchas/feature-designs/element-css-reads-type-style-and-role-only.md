---
title: 'Element CSS reads type, style and role only'
package: features/designs
summary: 'Keep createElementCssStyle/resolveElementStyle typed on DesignElementStyleSource; do not revert to DesignElement or widen it'
paths:
  - 'packages/designs/src/createElementCssStyle/**'
  - 'packages/designs/src/utils/resolveElementStyle/**'
  - 'packages/designs/src/design-element-configs/DesignElement.types.ts'
  - 'features/designs/src/useElementCssStyle.ts'
tags: [styles, types, design-elements, studio]
---

# Element CSS reads type, style and role only

`createElementCssStyle`/`resolveElementStyle` take `DesignElementStyleSource` (a distributive `Omit<'children'>` over the element union), so the studio's flattened elements (children stored as ID references) resolve styles without a cast. Do not "fix" this back to `DesignElement`, and do not widen it to `{ type: string; style: unknown }` the way legacy did: the union narrowing is what removed legacy's eight `as never` casts.
