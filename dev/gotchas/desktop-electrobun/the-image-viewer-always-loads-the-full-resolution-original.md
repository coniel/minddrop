---
title: 'The image viewer always loads the full resolution original'
package: apps/desktop-electrobun
summary: 'The image viewer skips useImageSrc width bracketing and downloads the original; load the variant first if large photos lag'
paths:
  - 'ui/components/src/ImageViewer/ImageViewer.tsx'
  - 'features/designs/src/design-elements/property/ImageViewerPropertyRenderer.tsx'
  - 'packages/file-system/src/useImageSrc.ts'
tags: [images, image-viewer, performance, cache]
---

# The image viewer always loads the full resolution original

Every other image consumer passes a measured width to `useImageSrc` and gets a bracketed downscaled variant. `ImageViewerDesignElement` passes none, so the viewer always fetches the original — a different URL from the variant a card already loaded, so opening an image from a card starts a fresh download rather than hitting the browser cache.

This was masked as of the dark-mode-image-dimming work: the viewer now lays out from the intrinsic dimensions in the image stats index and fills the space with the image's average colour, so there is no longer a flash of empty container. Only tested against ~300 KB images though, where the download is negligible. Larger photos will spend real time in decode with the placeholder showing.

If it needs fixing, the shape is: load the bracketed variant first (often already browser cached from the card), then swap to the original once the user zooms past the variant's resolution. The thing that used to block this is already solved — the viewer's zoom percentages read `naturalSize`, which now comes from the stats index rather than `img.naturalWidth`, so they stay correct against the original while a downscaled variant is on screen.
