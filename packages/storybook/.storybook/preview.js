import '../../theme/reset.css';
import '../../theme/base.css';
import '../../theme/light.css';
import '../../theme/dark.css';
import { initializeI18n, i18n } from '../../i18n';

initializeI18n();

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  i18n,
  locale: 'en-GB',
  locales: {
    'en-GB': 'English (GB)',
    'en-US': 'English (US)',
    'fr-FR': 'Français (FR)',
  },
  darkMode: {
    stylePreview: true,
  },
};
