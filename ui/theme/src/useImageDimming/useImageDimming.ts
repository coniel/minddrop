import { ThemeStore } from '../ThemeStore';
import { ImageDimming } from '../types';

/**
 * Returns the current image dimming setting reactively.
 *
 * @returns The image dimming setting.
 */
export function useImageDimming(): ImageDimming {
  return ThemeStore.useValue('imageDimming');
}
