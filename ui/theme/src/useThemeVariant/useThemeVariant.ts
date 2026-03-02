import { ThemeStore } from '../ThemeStore';
import { ThemeVariant } from '../types';

/**
 * Returns the current theme variant setting reactively.
 *
 * @returns The theme variant.
 */
export function useThemeVariant(): ThemeVariant {
  return ThemeStore.useValue('variant');
}
