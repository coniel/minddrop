import React from 'react';
import '../../theme/src/reset.css';
import '../../theme/src/light.css';
import '../../theme/src/dark.css';
import '../../theme/src/base.css';
import '../../theme/src/animations.css';
import { initializeI18n } from '../../i18n';
import { IconsProvider } from '../../icons';
import { CoreProvider } from '../../core';

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
      <CoreProvider>
        <Story />
      </CoreProvider>
    </IconsProvider>
  ),
];
