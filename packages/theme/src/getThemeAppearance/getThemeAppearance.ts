import { ThemeAppearance } from '../types';
import { ThemeConfig } from '../ThemeConfig';

/**
 * Returns the current theme appearance.
 *
 * @returns The current theme appearance.
 */
export function getThemeAppearance(): ThemeAppearance {
  // Return the current theme appearance from the theme
  // config, or 'light' if no appearance is set.
  return ThemeConfig.get<ThemeAppearance>('appearance', 'light');
}
