import { createPersistentConfig } from '@minddrop/core';

export const ThemeConfig = createPersistentConfig('minddrop:theme', {
  appearance: window.matchMedia('(prefers-color-scheme: dark)')
    ? 'dark'
    : 'light',
  appearanceSetting: 'system',
});
