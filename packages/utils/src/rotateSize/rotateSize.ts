/**
 * Rotates a size, swapping its width and height when the rotation
 * turns it sideways.
 *
 * @param size - The size to rotate.
 * @param rotation - The rotation, in degrees.
 * @returns The size as rotated.
 */
export function rotateSize<TSize extends { width: number; height: number }>(
  size: TSize,
  rotation: number,
): TSize {
  // Leave an upright size as is
  if (rotation % 180 === 0) {
    return size;
  }

  // Swap the width and height
  return { ...size, width: size.height, height: size.width };
}
