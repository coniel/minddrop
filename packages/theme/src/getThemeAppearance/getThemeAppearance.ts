import { ThemeAppearance } from '../types';
import { useThemeStore } from '../useThemeStore';

/**
 * Returns the current theme appearance.
 *
 * @returns The current theme appearance.
 */
export function getThemeAppearance(): ThemeAppearance {
  // Return the current theme appearance from the
  // theme store.
  return useThemeStore.getState().appearance;
}
