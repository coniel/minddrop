import { ThemeStore } from '../ThemeStore';

/**
 * Returns whether images with a light background are inverted.
 *
 * @returns The invert light images setting.
 */
export function getInvertLightImages(): boolean {
  return ThemeStore.get('invertLightImages');
}
