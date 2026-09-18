import { LayoutRegion } from '../../types';

/**
 * Checks whether two regions of the grid overlap vertically.
 *
 * @param a - The first region.
 * @param b - The second region.
 * @returns True when the regions share at least one row.
 */
export function rowsOverlap(a: LayoutRegion, b: LayoutRegion): boolean {
  return a.row < b.row + b.rowSpan && b.row < a.row + a.rowSpan;
}
