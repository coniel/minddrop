import { AspectRatioToken } from '../../types';
import { resolveAspectRatioValue } from '../resolveAspectRatioValue';

/**
 * Resolves an aspect-locked design's height in grid units from its
 * width and aspect ratio.
 *
 * @param columns - The design's width in grid units.
 * @param ratio - The design's aspect ratio.
 * @returns The design's height in grid units.
 */
export function resolveAspectRows(
  columns: number,
  ratio: AspectRatioToken,
): number {
  return Math.round(columns / resolveAspectRatioValue(ratio));
}
