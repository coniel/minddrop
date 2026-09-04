import { AspectRatioToken } from '../../types';

/**
 * Resolves an aspect ratio token to its numeric width/height value.
 *
 * @param ratio - The aspect ratio token.
 * @returns The numeric ratio.
 */
export function resolveAspectRatioValue(ratio: AspectRatioToken): number {
  // Parse the width and height parts
  const [width, height] = ratio.split('/').map(Number);

  return width / height;
}
