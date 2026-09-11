---
title: "Don't gate window keydown shortcuts on defaultPrevented"
package: features/designs
summary: 'Window keydown shortcut handlers must not skip on event.defaultPrevented; initializeSelection pre-prevents Delete/Backspace'
paths:
  - 'features/desktop-app/src/initializeDesktopApp/initializeSelection.ts'
  - 'features/designs/src/initializeDesignsFeature/**'
  - 'features/designs/src/DesignStudio/**'
tags: [keyboard, shortcuts, events, selection]
---

# Don't gate window keydown shortcuts on `defaultPrevented`

`initializeSelection` registers a window keydown handler that calls `event.preventDefault()` for Delete/Backspace whenever focus is outside an input (even with an empty selection), and Escape can arrive pre-prevented too. Feature-level shortcut handlers registered later must therefore NOT skip on `event.defaultPrevented`. Open popovers are not a concern: base-ui dismissal `stopPropagation()`s Escape, so it never reaches window handlers while a popup consumes it.
