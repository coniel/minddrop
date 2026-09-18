/**
 * A count of grid units split into those keeping their unit size
 * and those scaling with the region.
 */
export interface UnitShare {
  /**
   * The units keeping their unit size.
   */
  fixed: number;

  /**
   * The units scaling with the region.
   */
  scaling: number;
}

/**
 * An extent along one axis of a region, as unit counts split by
 * whether they scale with the region.
 */
export interface AxisUnits {
  /**
   * The units between the region's start and the extent's start.
   */
  before: UnitShare;

  /**
   * The units the extent spans.
   */
  span: UnitShare;

  /**
   * The units the region spans.
   */
  total: UnitShare;
}

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
  return {
    before: countUnits(scaling.slice(0, start)),
    span: countUnits(scaling.slice(start, start + span)),
    total: countUnits(scaling),
  };
}

/**
 * Counts the fixed and scaling units among a run of flags.
 *
 * @param flags - A flag per unit, true when the unit scales.
 * @returns The unit counts.
 */
function countUnits(flags: boolean[]): UnitShare {
  const scaling = flags.filter(Boolean).length;

  return { fixed: flags.length - scaling, scaling };
}
