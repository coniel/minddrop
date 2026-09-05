import { ContentCaptureGapMs, ContentCaptureSizeBands } from '../../constants';

/**
 * Returns how long must pass between two content captures of an entry
 * of the given size. Large entries capture less often, since copying
 * one costs the most and editing one tends to change the least.
 *
 * @param sizeBytes - The size of the entry's content in bytes.
 * @returns The capture gap in milliseconds.
 */
export function resolveContentCaptureGap(sizeBytes: number): number {
  // Find the narrowest band the size falls into. Bands are ordered
  // largest first, so the first match is the narrowest.
  const band = ContentCaptureSizeBands.find(
    ({ minBytes }) => sizeBytes >= minBytes,
  );

  // Entries below every band capture at the base gap
  if (!band) {
    return ContentCaptureGapMs;
  }

  return ContentCaptureGapMs * band.multiplier;
}
