import { createPersistentConfig } from '@minddrop/core';
import { ThemeDark, ThemeLight, ThemeSystem } from './constants';
import { ThemeState } from './types';

export const ThemeConfig = createPersistentConfig<ThemeState>(
  'minddrop:theme',
  {
    appearance: window.matchMedia('(prefers-color-scheme: dark)')
      ? ThemeDark
      : ThemeLight,
    appearanceSetting: ThemeSystem,
  },
);
