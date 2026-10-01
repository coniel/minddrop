/**
 * Orders a rect's corners so its first point is the lower left and
 * its second the upper right, the PDF Rect convention.
 *
 * @param rect - The rect, with its corners in any order.
 * @returns The normalised rect.
 */
export function normalizeRect(
  rect: number[],
): [number, number, number, number] {
  // The corners in the given order
  const [x1, y1, x2, y2] = rect;

  // Take the smaller coordinates as the first point and the larger
  // as the second.
  return [
    Math.min(x1, x2),
    Math.min(y1, y2),
    Math.max(x1, x2),
    Math.max(y1, y2),
  ];
}
