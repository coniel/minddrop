---
title: 'Shrinking elements measure their capped wrapper on purpose'
package: ui/designs-next
summary: 'DesignRenderer reads offsetHeight for every content fit, shrink included: the max-height cap is the height a shrinking element takes, so scrollHeight or an inner node would only add cost.'
paths:
  - 'ui/designs-next/src/DesignRenderer/DesignRenderer.tsx'
  - 'ui/designs-next/src/utils/resolveVerticalStyles/**'
tags: [content-fit, resize-observer, measurement, shrink]
---

# Shrinking elements measure their capped wrapper on purpose

`DesignRenderer` measures a content-fitted element by observing its wrapper and reading `offsetHeight`. A shrinking element's wrapper carries `max-height` at its block height, so `offsetHeight` reports the clamped value and the `ResizeObserver` stays silent while content grows behind the clamp. That looks like a bug and is not: shrink caps at the block height, so the clamped height is exactly the height the element takes, and content growing behind the cap cannot change the layout. The observer fires again as soon as the content drops below the cap, because the border box changes.

Grow reads its true content height because `min-height` never clips, and natural has no bound at all, so one `offsetHeight` read serves all four fits. Reaching for `scrollHeight` or an unclamped inner node would report a height the layout never uses and, in the inner-node case, add a DOM element per fitted element in every rendered design.
