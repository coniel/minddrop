import { createObjectStore } from '@minddrop/stores';
import { ThemeLight, ThemeSystem } from './constants';
import { ThemeAppearance, ThemeAppearanceSetting } from './types';

export interface ThemeConfigItem {
  /**
   * The config item identifier.
   */
  id: string;

  /**
   * The currently active theme appearance.
   */
  appearance: ThemeAppearance;

  /**
   * The theme appearance setting.
   */
  appearanceSetting: ThemeAppearanceSetting;
}

export const ThemeConfig = createObjectStore<ThemeConfigItem>('id', {
  persistTo: 'app-config',
  namespace: 'theme',
});

// Initialize with default values
ThemeConfig.set({
  id: 'config',
  appearance: ThemeLight,
  appearanceSetting: ThemeSystem,
});
