import { useThemeStore } from '../useThemeStore';
import { ThemeAppearanceSetting } from '../types';

/**
 * Returns the theme appearance setting.
 *
 * @returns The theme appearance setting.
 */
export function useThemeAppearanceSetting(): ThemeAppearanceSetting {
  return useThemeStore().appearanceSetting;
}
