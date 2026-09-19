/**
 * Creates the bounds of an element, for tests in an environment
 * which lays nothing out.
 *
 * @param x - The distance from the left of the viewport.
 * @param y - The distance from the top of the viewport.
 * @param width - The width.
 * @param height - The height.
 * @returns The bounds.
 */
export function createDomRect(
  x: number,
  y: number,
  width: number,
  height: number,
): DOMRect {
  // Build the bounds
  return {
    // The position and size
    x,
    y,
    width,
    height,
    // The edges
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    // The serialization the DOMRect type requires
    toJSON: () => ({}),
  };
}
