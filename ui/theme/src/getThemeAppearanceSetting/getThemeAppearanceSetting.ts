import { ThemeConfig } from '../ThemeConfig';
import { ThemeSystem } from '../constants';
import { ThemeAppearanceSetting } from '../types';

/**
 * Returns the theme appearance setting.
 *
 * @returns The theme appearance setting.
 */
export function getThemeAppearanceSetting(): ThemeAppearanceSetting {
  // Return the appearance setting from the theme config
  // or 'system' if no value is set.
  return ThemeConfig.get('appearanceSetting', ThemeSystem);
}
