/**
 * Formats a span in grid units as a count of snap units, rounded to
 * a tenth. Resizes step by the element type's line height rather
 * than the snap resolution, so a span can land between squares.
 *
 * @param span - The span in grid units.
 * @param snap - The snap resolution in grid units.
 * @returns The span in snap units.
 */
export function formatSnapUnits(span: number, snap: number): string {
  return String(Math.round((span / snap) * 10) / 10);
}
