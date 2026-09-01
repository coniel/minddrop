import { Anchor } from '../../types';

/**
 * Returns a virtual anchor frozen at the element's current
 * position, keeping a floating element in place after the element
 * it was opened from is gone, as hover revealed action buttons are
 * once the pointer leaves.
 *
 * @param element - The element to anchor at.
 * @returns A virtual anchor element, or null when given no element.
 */
export function resolveElementAnchor(element: Element | null): Anchor | null {
  if (!element) {
    return null;
  }

  const { x, y, top, bottom, left, right, width, height } =
    element.getBoundingClientRect();

  return {
    getBoundingClientRect: () => ({
      x,
      y,
      top,
      bottom,
      left,
      right,
      width,
      height,
    }),
  };
}
