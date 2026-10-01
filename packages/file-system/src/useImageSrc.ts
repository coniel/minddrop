import { bracketImageWidth } from '@minddrop/utils';
import { resolveFileSrc } from './resolveFileSrc';

/**
 * Returns the `src` of an image on the file system, or null if
 * the image does not exist.
 *
 * @param path - The path to the image file.
 * @param width - The width at which the image is displayed, requesting a downscaled variant.
 * @returns The src of the image or null if it does not exist.
 */
export function useImageSrc(
  path: string | null,
  width?: number,
): string | null {
  // Resolve the file's src
  const src = resolveFileSrc(path);

  if (!src) {
    return null;
  }

  // Bracket the width client side so that the URL is canonical
  // across renders and stays browser cacheable.
  const bracketedWidth = width ? bracketImageWidth(width) : null;

  if (!bracketedWidth) {
    return src;
  }

  return `${src}&width=${bracketedWidth}`;
}
