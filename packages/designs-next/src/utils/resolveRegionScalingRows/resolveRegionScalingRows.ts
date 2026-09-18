import { DesignElement, LayoutRegion } from '../../types';
import { resolveScalingRows } from '../resolveScalingRows';

/**
 * Resolves which rows of a region scale when the region's height
 * changes, classified against the given elements.
 *
 * @param elements - The elements inside the region.
 * @param region - The region.
 * @returns A flag per row of the region, true when the row scales.
 */
export function resolveRegionScalingRows(
  elements: DesignElement[],
  region: LayoutRegion,
): boolean[] {
  // Classify the rows down to the region's bottom edge, then drop
  // those above its top edge.
  return resolveScalingRows(elements, region.row + region.rowSpan).slice(
    region.row,
  );
}
