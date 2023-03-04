import { ThemeConfig } from '../ThemeConfig';
import { ThemeAppearanceSetting } from '../types';

/**
 * Returns the theme appearance setting.
 *
 * @returns The theme appearance setting.
 */
export function useThemeAppearanceSetting(): ThemeAppearanceSetting {
  return ThemeConfig.useValue('appearanceSetting', 'system');
}
