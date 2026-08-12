import { ThemeStore } from '../ThemeStore';
import { ImageDimming } from '../types';

/**
 * Returns the current image dimming setting.
 *
 * @returns The image dimming setting.
 */
export function getImageDimming(): ImageDimming {
  return ThemeStore.get('imageDimming');
}
