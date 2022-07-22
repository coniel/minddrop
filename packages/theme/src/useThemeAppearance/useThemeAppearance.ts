import { useThemeStore } from '../useThemeStore';
import { ThemeAppearance } from '../types';

/**
 * Returns the current theme appearance.
 *
 * @returns The current theme appearance.
 */
export function useThemeAppearance(): ThemeAppearance {
  return useThemeStore().appearance;
}
