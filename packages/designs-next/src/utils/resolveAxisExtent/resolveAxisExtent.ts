import { LayoutAxis, LayoutRegion } from '../../types';

export interface AxisExtent {
  /**
   * The grid line the region starts at.
   */
  start: number;

  /**
   * The grid line the region ends at, exclusive.
   */
  end: number;
}

/**
 * Resolves the grid lines a region starts and ends at along an axis.
 *
 * @param region - The region.
 * @param axis - The axis to read the extent along.
 * @returns The region's extent along the axis.
 */
export function resolveAxisExtent(
  region: LayoutRegion,
  axis: LayoutAxis,
): AxisExtent {
  // Read the row extent
  if (axis === 'rows') {
    return { start: region.row, end: region.row + region.rowSpan };
  }

  // Read the column extent
  return { start: region.column, end: region.column + region.columnSpan };
}
