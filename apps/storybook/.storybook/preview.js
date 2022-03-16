import React from 'react';
import '../../../packages/theme/src/reset.css';
import '../../../packages/theme/src/light.css';
import '../../../packages/theme/src/dark.css';
import '../../../packages/theme/src/base.css';
import '../../../packages/theme/src/animations.css';
import { initializeI18n } from '../../../packages/i18n';
import { IconsProvider } from '../../../packages/icons';
import { CoreProvider } from '../../../packages/core';

initializeI18n(true);

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    stylePreview: true,
    lightClass: 'light-theme',
    darkClass: 'dark-theme',
  },
};

export const decorators = [
  (Story) => (
    <IconsProvider>
      <CoreProvider appId="app">
        <Story />
      </CoreProvider>
    </IconsProvider>
  ),
];
