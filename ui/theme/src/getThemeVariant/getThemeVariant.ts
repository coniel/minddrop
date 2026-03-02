import { ThemeStore } from '../ThemeStore';
import { ThemeVariant } from '../types';

/**
 * Returns the current theme variant setting.
 *
 * @returns The theme variant.
 */
export function getThemeVariant(): ThemeVariant {
  // Return the variant from the theme config
  return ThemeStore.get('variant');
}
