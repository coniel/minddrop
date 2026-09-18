import { DesignElement, LayoutAxis, LayoutRegion } from '../../types';
import { resolveAxisExtent } from '../resolveAxisExtent';

/**
 * Resolves the grid lines a region can be cut at along an axis: the
 * horizontal lines for rows, the vertical lines for columns. A line
 * is cut at when it lies on an element's edge and no element crosses
 * it, so a gap is cut off at its edges rather than at every line
 * inside it. The region's own edges are left out.
 *
 * @param elements - The elements inside the region.
 * @param region - The region.
 * @param axis - The axis the lines cut across.
 * @returns The cut lines, in ascending order.
 */
export function resolveCutLines(
  elements: DesignElement[],
  region: LayoutRegion,
  axis: LayoutAxis,
): number[] {
  // The region's extent along the axis
  const { start, end } = resolveAxisExtent(region, axis);
  // The extent of each element along the axis
  const extents = elements.map((element) => resolveAxisExtent(element, axis));
  // The cut lines
  const lines: number[] = [];

  // Check every line inside the region
  for (let line = start + 1; line < end; line += 1) {
    // Check whether the line lies on an element's edge
    const onEdge = extents.some(
      (extent) => extent.start === line || extent.end === line,
    );
    // Check whether an element straddles the line
    const straddled = extents.some(
      (extent) => extent.start < line && line < extent.end,
    );

    // Keep the line when it is an edge nothing crosses
    if (onEdge && !straddled) {
      lines.push(line);
    }
  }

  return lines;
}
