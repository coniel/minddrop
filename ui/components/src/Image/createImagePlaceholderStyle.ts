import { CSSProperties } from 'react';
import { ImageStats } from '@minddrop/file-system';

/**
 * Returns the styles which hold an image's space and fill it with the
 * image's own average colour until it has loaded.
 *
 * The aspect ratio is applied even once loaded, as it only takes
 * effect while one of the element's dimensions is auto.
 *
 * @param stats - The image's stats, if known.
 * @param isLoaded - Whether the image has finished loading.
 * @returns The placeholder styles.
 */
export function createImagePlaceholderStyle(
  stats: ImageStats | null | undefined,
  isLoaded: boolean,
): CSSProperties {
  // Nothing is known about the image yet
  if (!stats) {
    return {};
  }

  const style: CSSProperties = {};

  // Reserve the space the image will occupy, so that it does not
  // shift the layout when it loads
  if (stats.width && stats.height) {
    style.aspectRatio = `${stats.width} / ${stats.height}`;
  }

  // Fill that space with the image's average colour. Dropped once
  // loaded, as it would otherwise show through a transparent image.
  if (!isLoaded) {
    style.backgroundColor = stats.averageColor;
  }

  return style;
}
