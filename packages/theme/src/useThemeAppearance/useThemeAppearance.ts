import { ThemeConfig } from '../ThemeConfig';
import { ThemeLight } from '../constants';
import { ThemeAppearance } from '../types';

/**
 * Returns the current theme appearance.
 *
 * @returns The current theme appearance.
 */
export function useThemeAppearance(): ThemeAppearance {
  return ThemeConfig.useValue<ThemeAppearance>('appearance', ThemeLight);
}
