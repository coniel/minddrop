import { ThemeAppearanceSetting } from '../types';
import { useThemeStore } from '../useThemeStore';

/**
 * Returns the theme appearance setting.
 *
 * @returns The theme appearance setting.
 */
export function getThemeAppearanceSetting(): ThemeAppearanceSetting {
  // Return the appearance setting from the theme store
  return useThemeStore.getState().appearanceSetting;
}
