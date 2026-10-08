---
title: 'Rendering an image in tests logs a refused file server connection'
package: packages/file-system
summary: "A test rendering ui-components' Image or ImageViewer with a path logs ECONNREFUSED on port 3000. The stats and treatment hooks fetch the file server. The server has no test mock. The test still passes; assert on the img, not the src."
paths:
  - 'packages/file-system/src/useImageStats.ts'
  - 'packages/file-system/src/useImageSrc.ts'
  - 'ui/components/src/Image/**'
  - 'ui/components/src/ImageViewer/**'
tags: [testing, images, file-server, noise]
---

# Rendering an image in tests logs a refused file server connection

`Fs.useImageStats` and `Theme.useImageTreatment` fetch the image from the file server at `Paths.httpServerHost` to analyse it. There is no test double for that server, so a test which renders `Image` or `ImageViewer` with a path logs `AggregateError: connect ECONNREFUSED 127.0.0.1:3000` and an `AbortError` on cleanup. The run still passes. The hooks resolve to no stats, and the image renders with no placeholder colour and no treatment class.

Assert on the presence of the `img` element, or on the box the component renders into, never on the `src` attribute. `Image` sets `src` only once the element has been measured. The test environment never measures it.

If the noise becomes a problem, the fix is a `Fs.tests` mock for the stats fetch in the file system package's test utils, not a mock in each consuming test.
