// The overflow values under which an element scrolls its content
const SCROLLING_OVERFLOWS = new Set(['auto', 'scroll']);

/**
 * Resolves the scroll containers around a point in an element: the
 * element itself and its ancestors which scroll their content,
 * innermost first.
 *
 * @param element - The element to resolve the scroll containers of.
 * @returns The scroll containers, innermost first.
 */
export function resolveScrollContainers(element: Element): HTMLElement[] {
  // The scroll containers, innermost first
  const scrollables: HTMLElement[] = [];

  // Start from the element itself, which scrolls when the point is
  // over its own empty area.
  let ancestor: Element | null = element;

  // Walk up the ancestors, keeping those with content to scroll
  while (ancestor instanceof HTMLElement) {
    // Read the ancestor's computed style
    const style = window.getComputedStyle(ancestor);

    // Resolve whether the ancestor scrolls along each axis
    const scrollsX =
      SCROLLING_OVERFLOWS.has(style.overflowX) &&
      ancestor.scrollWidth > ancestor.clientWidth;
    const scrollsY =
      SCROLLING_OVERFLOWS.has(style.overflowY) &&
      ancestor.scrollHeight > ancestor.clientHeight;

    // Check if the ancestor scrolls. If so, add it.
    if (scrollsX || scrollsY) {
      scrollables.push(ancestor);
    }

    // Move up to the next ancestor
    ancestor = ancestor.parentElement;
  }

  return scrollables;
}
