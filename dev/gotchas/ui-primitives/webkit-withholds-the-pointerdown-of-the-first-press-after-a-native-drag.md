---
title: 'WebKit withholds the pointerdown of the first press after a native drag'
package: ui/primitives
summary: 'The first press after an HTML5 drag arrives without its pointerdown, which closes any popup it opens; initializePointerDownRecovery dispatches the missing event'
paths:
  - 'ui/primitives/src/initializePointerDownRecovery/**'
  - 'features/desktop-app/src/initializeDesktopApp/initializeDesktopApp.ts'
tags: [base-ui, pointer-events, drag-and-drop, webkit, menus]
---

# WebKit withholds the pointerdown of the first press after a native drag

In the Electrobun webview, the first press after a native HTML5 drag-and-drop delivers `mousedown`, `pointerup`, `mouseup` and `click`, but **no `pointerdown`**. The press that follows it is normal. A native drag also ends without a `pointerup`, so state machines pairing a press's down and up events cannot rely on either half arriving.

That broke every Base UI popup opened by the first press after a drop: dropping a card onto a board or canvas and then pressing an entry card's options menu flashed the menu open and shut. `MenuTrigger` uses `useClick` with `event: 'mousedown'`, which opens the menu on `mousedown` and then discards the `click` ending that same press — but only because `onPointerDown` recorded a `pointerType`:

```js
onPointerDown(event) { pointerTypeRef.current = event.pointerType; },
onClick(event) {
  if (eventOption === 'mousedown' && pointerTypeRef.current) { return; }
  // otherwise toggles, closing the menu the mousedown just opened
}
```

With no `pointerdown`, the ref stays unset, the guard does not fire, and the click closes the popup. The symptom is distinctive: the popup stays open for as long as the button is held and closes on release, and a second press works.

`initializePointerDownRecovery` (called from `initializeDesktopApp`) restores the missing event, dispatching a reconstructed `pointerdown` on the target of any `mousedown` that arrives more than 100ms after the last real one. Pair the two by timestamp rather than by a flag: a flag set on `pointerdown` is left stranded by a drag, which never releases.

Presses commonly land on the shapes inside an icon's SVG, so anything inspecting a press target must test `instanceof Element`, not `instanceof HTMLElement`.

The whole workaround is native drag's alone. A pointer-based drag never hands the session to the OS, so switching to one (the "Custom drag and drop" plan) makes it redundant: delete the initializer, its tests, its call in `initializeDesktopApp`, and this gotcha along with them.
