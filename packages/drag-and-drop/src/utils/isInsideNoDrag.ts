/**
 * Returns whether a pressed element sits inside an element opted
 * out of starting drags with the `data-no-drag` attribute.
 *
 * @param target - The pressed element.
 * @returns Whether the element is inside an opted out element.
 */
export function isInsideNoDrag(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest('[data-no-drag]') !== null;
}
