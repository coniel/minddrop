import i18n from 'i18next';
import intervalPlural from 'i18next-intervalplural-postprocessor';
import { initReactI18next } from 'react-i18next';
import enGB from './locales/en-GB.json';
import enUS from './locales/en-US.json';
import frFR from './locales/fr-FR.json';

const languages = [
  ['en-GB', enGB],
  ['en-US', enUS],
  ['fr-FR', frFR],
] as const;

export type Language = (typeof languages)[number];

export function initializeI18n(debug = false) {
  i18n
    .use(intervalPlural)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en-GB',
      keySeparator: '.',
      debug,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });

  languages.forEach((lang) => {
    i18n.addResourceBundle(lang[0], 'translation', lang[1], true, true);
  });
}

export { i18n };
