import { LayoutRegion } from '../../types';

/**
 * Checks whether two regions of the grid, such as elements, overlap
 * horizontally.
 *
 * @param a - The first region.
 * @param b - The second region.
 * @returns True when the regions share at least one column.
 */
export function columnsOverlap(a: LayoutRegion, b: LayoutRegion): boolean {
  return (
    a.column < b.column + b.columnSpan && b.column < a.column + a.columnSpan
  );
}
