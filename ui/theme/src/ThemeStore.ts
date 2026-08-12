import { createKeyValueStore } from '@minddrop/stores';
import { ImageDimmingOff, ThemeSystem } from './constants';
import { ImageDimming, ThemeVariant } from './types';

export interface ThemeStoreValues {
  /**
   * The theme variant setting.
   */
  variant: ThemeVariant;

  /**
   * The image dimming setting.
   */
  imageDimming: ImageDimming;

  /**
   * Whether images with a light background are inverted while the
   * dark theme is active.
   */
  invertLightImages: boolean;
}

export const ThemeStore = createKeyValueStore<ThemeStoreValues>(
  'Theme:Theme',
  {
    variant: ThemeSystem,
    imageDimming: ImageDimmingOff,
    invertLightImages: false,
  },
  {
    persistTo: 'app-config',
    namespace: 'theme',
  },
);
