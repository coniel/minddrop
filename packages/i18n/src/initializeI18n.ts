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
      ns: ['core'],
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
    i18n.addResourceBundle(lang[0], 'core', lang[1], true, true);
  });
}

export function isUntitled(title?: string): boolean {
  // If there is no title, it's not an "Untitled" string
  // rather a missing title.
  if (!title) {
    return false;
  }

  // Check if the string starts with "Untitled"
  if (!title.startsWith(i18n.t('labels.untitled'))) {
    return false;
  }

  // Extract the part after "Untitled"
  const suffix = title.slice(8).trim();

  // If there's no suffix, it's a valid "Untitled" string
  if (suffix === '') {
    return true;
  }

  // Check if the suffix is a positive integer
  const number = Number(suffix);

  return Number.isInteger(number) && number > 0;
}

export { i18n };
