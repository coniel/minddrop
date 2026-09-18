import { LayoutAxis, LayoutRegion } from '../../types';
import { resolveAxisExtent } from '../resolveAxisExtent';

/**
 * Slices a region at grid lines along an axis. Horizontal lines
 * slice it into bands, vertical lines into column regions. Each
 * slice keeps the region's full extent along the other axis.
 *
 * @param region - The region to slice.
 * @param lines - The lines to slice at, inside the region and in ascending order.
 * @param axis - The axis the lines cut across.
 * @returns The slices, in ascending order.
 */
export function sliceRegion(
  region: LayoutRegion,
  lines: number[],
  axis: LayoutAxis,
): LayoutRegion[] {
  // The region's extent along the axis
  const { start, end } = resolveAxisExtent(region, axis);
  // The slice boundaries, the region's edges included
  const boundaries = [start, ...lines, end];

  // Build a slice between each pair of consecutive boundaries
  return boundaries.slice(0, -1).map((sliceStart, index) => {
    // The slice's span up to the next boundary
    const span = boundaries[index + 1] - sliceStart;

    // Slice the rows
    if (axis === 'rows') {
      return { ...region, row: sliceStart, rowSpan: span };
    }

    // Slice the columns
    return { ...region, column: sliceStart, columnSpan: span };
  });
}
