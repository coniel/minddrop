import { IMAGE_WIDTH_BRACKET, MAX_IMAGE_RESIZE_WIDTH } from '../constants';

/**
 * Rounds a requested image display width up to the nearest resize
 * bracket, bounding the number of variants generated per image.
 *
 * @param width - The requested display width in pixels.
 * @returns The bracketed width, or null if the original image should be used.
 */
export function bracketImageWidth(width: number): number | null {
  // Non-finite or non-positive widths carry no useful intent
  if (!Number.isFinite(width) || width <= 0) {
    return null;
  }

  // Round up to the next bracket, never below a single bracket
  const bracketed =
    Math.max(1, Math.ceil(width / IMAGE_WIDTH_BRACKET)) * IMAGE_WIDTH_BRACKET;

  // Beyond the cap, resizing is not worth it, use the original
  if (bracketed > MAX_IMAGE_RESIZE_WIDTH) {
    return null;
  }

  return bracketed;
}
