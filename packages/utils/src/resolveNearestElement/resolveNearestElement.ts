/**
 * Resolves the element whose centre is nearest a point in the
 * viewport, or null when given no elements.
 *
 * @param elements - The elements to choose from.
 * @param point - The point in the viewport.
 * @returns The nearest element.
 */
export function resolveNearestElement(
  elements: Element[],
  point: { x: number; y: number },
): Element | null {
  // The nearest element so far and its distance from the point
  let nearest: Element | null = null;
  let nearestDistance = Infinity;

  // Compare every element's centre with the point
  elements.forEach((element) => {
    // Measure the distance from the element's centre to the point
    const rect = element.getBoundingClientRect();
    const distance = Math.hypot(
      rect.left + rect.width / 2 - point.x,
      rect.top + rect.height / 2 - point.y,
    );

    // Check if the element is nearer than the nearest so far. If so,
    // take it.
    if (distance < nearestDistance) {
      nearest = element;
      nearestDistance = distance;
    }
  });

  return nearest;
}
