import { ThemeStore } from '../ThemeStore';

/**
 * Returns whether images with a light background are inverted,
 * reactively.
 *
 * @returns The invert light images setting.
 */
export function useInvertLightImages(): boolean {
  return ThemeStore.useValue('invertLightImages');
}
