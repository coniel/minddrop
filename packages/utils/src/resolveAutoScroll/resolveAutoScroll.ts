import { canScrollBy } from '../canScrollBy';
import { EdgeScrollOptions, resolveEdgeVelocity } from '../resolveEdgeVelocity';

export interface AxisScroll {
  /**
   * The element to scroll.
   */
  element: HTMLElement;

  /**
   * The distance to scroll it per frame.
   */
  velocity: number;
}

export interface AutoScroll {
  /**
   * The horizontal scroll, null when nothing scrolls horizontally.
   */
  x: AxisScroll | null;

  /**
   * The vertical scroll, null when nothing scrolls vertically.
   */
  y: AxisScroll | null;
}

/**
 * Resolves what a pointer near the edges of scrollable elements
 * scrolls, and how fast, from its depth into their edge zones. Along
 * each axis, the innermost element which can still scroll in the
 * pointer's direction is the one scrolled. An element scrolls along
 * an axis however far the pointer has overshot its edge, as long as
 * the pointer is within the element's span on the other axis.
 *
 * @param scrollables - The scrollable elements, innermost first.
 * @param clientX - The horizontal position of the pointer in the viewport.
 * @param clientY - The vertical position of the pointer in the viewport.
 * @param options - The edge zones' width and top speed.
 * @returns The scroll to apply along each axis.
 */
export function resolveAutoScroll(
  scrollables: HTMLElement[],
  clientX: number,
  clientY: number,
  options: EdgeScrollOptions,
): AutoScroll {
  // The scroll along each axis
  let x: AxisScroll | null = null;
  let y: AxisScroll | null = null;

  // Take each axis from the innermost element which can still
  // scroll along it.
  for (const element of scrollables) {
    // Measure the element
    const rect = element.getBoundingClientRect();

    // Resolve whether the pointer is within the element's span on
    // each axis.
    const withinX = clientX >= rect.left && clientX <= rect.right;
    const withinY = clientY >= rect.top && clientY <= rect.bottom;

    // Check if nothing takes the horizontal scroll yet and the
    // pointer is within the element's vertical span. If so, try the
    // element.
    if (!x && withinY) {
      // Resolve the velocity from the pointer's depth into the
      // element's horizontal edge zones.
      const velocity = resolveEdgeVelocity(
        clientX,
        rect.left,
        rect.right,
        options,
      );

      // Check if the element can scroll by the velocity. If so, it
      // takes the horizontal scroll.
      if (
        canScrollBy(
          element.scrollLeft,
          element.scrollWidth - element.clientWidth,
          velocity,
        )
      ) {
        x = { element, velocity };
      }
    }

    // Check if nothing takes the vertical scroll yet and the pointer
    // is within the element's horizontal span. If so, try the
    // element.
    if (!y && withinX) {
      // Resolve the velocity from the pointer's depth into the
      // element's vertical edge zones.
      const velocity = resolveEdgeVelocity(
        clientY,
        rect.top,
        rect.bottom,
        options,
      );

      // Check if the element can scroll by the velocity. If so, it
      // takes the vertical scroll.
      if (
        canScrollBy(
          element.scrollTop,
          element.scrollHeight - element.clientHeight,
          velocity,
        )
      ) {
        y = { element, velocity };
      }
    }

    // Stop once both axes are taken
    if (x && y) {
      break;
    }
  }

  return { x, y };
}
