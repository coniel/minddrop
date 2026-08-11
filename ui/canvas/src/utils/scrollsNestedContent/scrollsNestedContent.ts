/**
 * Checks whether a wheel event can be consumed by a scrollable
 * element between its target and the canvas viewport, in the
 * direction of the scroll.
 *
 * @param event - The wheel event.
 * @param viewport - The canvas viewport element.
 * @returns Whether nested content scrolls under the event.
 */
export function scrollsNestedContent(
  event: WheelEvent,
  viewport: HTMLElement,
): boolean {
  let element = event.target instanceof HTMLElement ? event.target : null;

  // Walk up from the target to the canvas viewport
  while (element && element !== viewport) {
    const { overflowX, overflowY } = getComputedStyle(element);

    // The element scrolls vertically under the wheel's vertical
    // delta
    if (
      event.deltaY !== 0 &&
      (overflowY === 'auto' || overflowY === 'scroll') &&
      element.scrollHeight > element.clientHeight
    ) {
      return true;
    }

    // The element scrolls horizontally under the wheel's
    // horizontal delta
    if (
      event.deltaX !== 0 &&
      (overflowX === 'auto' || overflowX === 'scroll') &&
      element.scrollWidth > element.clientWidth
    ) {
      return true;
    }

    element = element.parentElement;
  }

  return false;
}
