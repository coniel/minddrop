import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const languages = ['en-GB', 'en-US', 'fr-FR'] as const;

export type Language = typeof languages[number];

export function initializeI18n(debug = false) {
  i18n.use(initReactI18next).init({
    fallbackLng: 'en-GB',
    debug,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

  languages.forEach((lang) => {
    i18n.addResources(
      lang,
      'translation',
      // eslint-disable-next-line global-require
      require(`./locales/${lang}.json`),
    );
  });
}

export { i18n };
