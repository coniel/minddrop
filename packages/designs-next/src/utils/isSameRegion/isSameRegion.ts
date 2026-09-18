import { LayoutRegion } from '../../types';

/**
 * Checks whether two regions of the grid cover the same rectangle.
 *
 * @param a - The first region.
 * @param b - The second region.
 * @returns True when the regions share their edges.
 */
export function isSameRegion(a: LayoutRegion, b: LayoutRegion): boolean {
  return (
    a.column === b.column &&
    a.row === b.row &&
    a.columnSpan === b.columnSpan &&
    a.rowSpan === b.rowSpan
  );
}
