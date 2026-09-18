import { DesignElement, LayoutRegion } from '../../types';
import { resolveScalingColumns } from '../resolveScalingColumns';

/**
 * Resolves which columns of a region scale when the region resizes,
 * classified against the given elements.
 *
 * @param elements - The elements inside the region.
 * @param region - The region.
 * @returns A flag per column of the region, true when the column scales.
 */
export function resolveRegionScalingColumns(
  elements: DesignElement[],
  region: LayoutRegion,
): boolean[] {
  // Classify the columns up to the region's right edge, then drop
  // those before its left edge.
  return resolveScalingColumns(
    elements,
    region.column + region.columnSpan,
  ).slice(region.column);
}
