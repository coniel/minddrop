import { Paths } from '@minddrop/utils';

/**
 * Returns the `src` of an image on the file system, or null if
 * the image does not exist.
 *
 * @param path - The path to the image file.
 * @returns The src of the image or null if it does not exist.
 */
export function useImageSrc(path: string | null): string | null {
  if (!path) {
    return null;
  }

  return `${Paths.httpServerHost}/files?path=${encodeURIComponent(path)}`;
}
