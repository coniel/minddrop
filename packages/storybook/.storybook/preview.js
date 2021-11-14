import React from 'react';
import '../../theme/reset.css';
import '../../theme/light.css';
import '../../theme/dark.css';
import '../../theme/base.css';
import '../../theme/animations.css';
import { initializeI18n } from '../../i18n';
import { IconsProvider } from '../../icons';

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
      <Story />
    </IconsProvider>
  ),
];
