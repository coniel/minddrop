---
title: 'Dark mode image dimming thresholds are provisional'
package: ui/theme
summary: 'classifyImageBrightness thresholds (bright area 0.06, near-white 0.4) were calibrated on one image; err toward dimming'
paths:
  - 'ui/theme/src/utils/classifyImageBrightness/**'
  - 'ui/theme/src/useImageTreatment.ts'
  - 'apps/desktop-electrobun/src/bun/images/imageStats.ts'
tags: [dark-mode, images, brightness, thresholds]
---

# Dark mode image dimming thresholds are provisional

`classifyImageBrightness` decides which images the dark mode treatments apply to, using two fractions measured server side by `apps/desktop-electrobun/src/bun/images/imageStats.ts`: `brightFraction` (share of pixels above luminance 0.7, threshold 0.06) and `nearWhiteFraction` (above 0.85, threshold 0.4).

`brightFraction` deliberately measures bright _area_ rather than average luminance. An earlier mean-luminance rule missed obviously glaring photos, because a bright subject against dark surroundings averages out to a middling value: a sunlit photo that reads as bright measured a mean of 0.45 while having 23% of its pixels above 0.7. The feature exists to stop a bright image hurting in dark mode, so a dark image with a bright patch should still be dimmed.

The 0.06 threshold was calibrated against a single image and is expected to need revisiting once there is more variety to test with. False positives are cheap here (a slightly dimmed image), false negatives are the actual failure, so err low. To re-measure, run the analysis from `imageStats.ts` over sample images from within `apps/desktop-electrobun` (sharp resolves there).

Note also that dimming is a whole-image `brightness()` multiply, so a mostly-dark image tripping the threshold on one bright patch has its shadows darkened too. Only-touch-the-highlights needs a tone curve, which means an SVG filter, which is too slow (see below).
