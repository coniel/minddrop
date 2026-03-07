import { createKeyValueStore } from '@minddrop/stores';
import { ThemeSystem } from './constants';
import { ThemeVariant } from './types';

export interface ThemeStoreValues {
  /**
   * The theme variant setting.
   */
  variant: ThemeVariant;
}

export const ThemeStore = createKeyValueStore<ThemeStoreValues>(
  'Theme:Theme',
  { variant: ThemeSystem },
  {
    persistTo: 'app-config',
    namespace: 'theme',
  },
);
