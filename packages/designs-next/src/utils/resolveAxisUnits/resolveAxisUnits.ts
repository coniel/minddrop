import { AxisUnits } from '../../types';
import { resolveUnitShare } from '../resolveUnitShare';

/**
 * Resolves an extent along an axis of a region as unit counts split
 * by whether they scale with the region, from the region's scaling
 * classification along that axis.
 *
 * @param scaling - A flag per unit of the region, true when the unit scales.
 * @param start - The extent's start, relative to the region.
 * @param span - The number of units the extent spans.
 * @returns The extent's unit counts.
 */
export function resolveAxisUnits(
  scaling: boolean[],
  start: number,
  span: number,
): AxisUnits {
  // Count the units before the extent, inside it and in the region
  return {
    before: resolveUnitShare(scaling.slice(0, start)),
    span: resolveUnitShare(scaling.slice(start, start + span)),
    total: resolveUnitShare(scaling),
  };
}
