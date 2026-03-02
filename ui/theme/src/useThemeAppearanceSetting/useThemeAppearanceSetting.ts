import { ThemeConfig } from '../ThemeConfig';
import { ThemeSystem } from '../constants';
import { ThemeAppearanceSetting } from '../types';

/**
 * Returns the theme appearance setting.
 *
 * @returns The theme appearance setting.
 */
export function useThemeAppearanceSetting(): ThemeAppearanceSetting {
  return ThemeConfig.useValue('appearanceSetting', ThemeSystem);
}
