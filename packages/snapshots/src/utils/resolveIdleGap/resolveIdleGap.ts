import { IdleGapMs, IdleGapSizeBands } from '../../constants';

/**
 * Returns the time which must pass between two captures of a subject
 * of the given size. Large subjects capture less often, since copying
 * one costs the most and editing one tends to change the least.
 *
 * @param sizeBytes - The size of the subject's contents in bytes.
 * @returns The idle gap in milliseconds.
 */
export function resolveIdleGap(sizeBytes: number): number {
  // Bands are ordered largest first, so the first match is the
  // narrowest band the size falls into
  const band = IdleGapSizeBands.find(({ minBytes }) => sizeBytes >= minBytes);

  // Subjects below every band capture at the base gap
  if (!band) {
    return IdleGapMs;
  }

  return IdleGapMs * band.multiplier;
}
