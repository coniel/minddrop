// A press fires its pointerdown and mousedown within a few
// milliseconds of each other, so a mousedown further from the last
// pointerdown than this belongs to a press which had none.
const PRESS_PAIRING_WINDOW_MS = 100;

/**
 * Dispatches the `pointerdown` WebKit withholds from the first press
 * after a native drag, reconstructed from that press's `mousedown`,
 * so components reading the press from pointer events see a whole
 * one.
 *
 * Returns a cleanup function which removes the listeners.
 */
export function initializePointerDownRecovery(): VoidFunction {
  // When the last pointerdown arrived, which tells a press that had
  // one from a press that did not.
  let lastPointerDownAt = -Infinity;

  function handlePointerDown(): void {
    lastPointerDownAt = performance.now();
  }

  function handleMouseDown(event: MouseEvent): void {
    // The press brought its own pointerdown
    if (performance.now() - lastPointerDownAt < PRESS_PAIRING_WINDOW_MS) {
      return;
    }

    // Element rather than HTMLElement: presses commonly land on the
    // shapes inside an icon's SVG.
    if (!(event.target instanceof Element)) {
      return;
    }

    event.target.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        composed: true,
        clientX: event.clientX,
        clientY: event.clientY,
        screenX: event.screenX,
        screenY: event.screenY,
        button: event.button,
        buttons: event.buttons || 1,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        metaKey: event.metaKey,
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: true,
      }),
    );
  }

  // Listen in the capture phase so the pointerdown is dispatched
  // before the mousedown reaches the element it belongs to.
  document.addEventListener('pointerdown', handlePointerDown, true);
  document.addEventListener('mousedown', handleMouseDown, true);

  return () => {
    document.removeEventListener('pointerdown', handlePointerDown, true);
    document.removeEventListener('mousedown', handleMouseDown, true);
  };
}
