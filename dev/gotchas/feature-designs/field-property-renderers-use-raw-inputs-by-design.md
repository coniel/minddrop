---
title: 'Field property renderers use raw inputs by design'
package: features/designs
summary: 'Design-surface field renderers use raw input/textarea on purpose so element CSS fully controls their look; no primitives'
paths:
  - 'features/designs/src/design-elements/property/FieldPropertyRenderer/**'
  - 'features/designs/src/design-elements/property/propertyRendererMap.ts'
tags: [property-renderers, primitives, styles, design-surface]
---

# Field property renderers use raw inputs by design

`TextFieldPropertyRenderer` and `MultilineFieldPropertyRenderer` render raw `<input>`/`<textarea>` elements instead of the ui-primitives field components. This is deliberate, not an oversight: design-surface fields take their entire appearance from the element's user-configured CSS (passed via `style={css}`), so a primitive's own styling, wrappers, and focus treatment would fight the design's. Don't "fix" them to use primitives; any future field renderer on the design surface should follow the same pattern.
