import { createPersistentConfig } from '@minddrop/core';
import { ThemeDark, ThemeLight, ThemeSystem } from './constants';

export const ThemeConfig = createPersistentConfig('minddrop:theme', {
  appearance: window.matchMedia('(prefers-color-scheme: dark)')
    ? ThemeDark
    : ThemeLight,
  appearanceSetting: ThemeSystem,
});
