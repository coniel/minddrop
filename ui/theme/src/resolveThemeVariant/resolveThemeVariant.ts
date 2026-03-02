import { ThemeDark, ThemeLight } from '../constants';
import { ResolvedThemeVariant, ThemeVariant } from '../types';

/**
 * Resolves a theme variant to a concrete appearance value
 * ('light' or 'dark'). When the variant is 'system', checks
 * the OS dark mode preference.
 *
 * @param variant - The theme variant to resolve.
 * @returns The resolved appearance: 'light' or 'dark'.
 */
export function resolveThemeVariant(
  variant: ThemeVariant,
): ResolvedThemeVariant {
  if (variant === 'system') {
    // Check the OS dark mode preference
    const prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    return prefersDark ? ThemeDark : ThemeLight;
  }

  return variant;
}
