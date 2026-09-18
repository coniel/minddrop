import { UnitShare } from '../../types';

/**
 * Resolves how many of a run of grid units keep their unit size
 * and how many scale, from a scaling classification.
 *
 * @param scaling - A flag per unit, true when the unit scales.
 * @returns The unit counts.
 */
export function resolveUnitShare(scaling: boolean[]): UnitShare {
  // Count the scaling units
  const scalingCount = scaling.filter(Boolean).length;

  // The rest keep their unit size
  return { fixed: scaling.length - scalingCount, scaling: scalingCount };
}
