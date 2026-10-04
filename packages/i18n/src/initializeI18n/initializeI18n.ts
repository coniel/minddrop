import i18n from 'i18next';
import intervalPlural from 'i18next-intervalplural-postprocessor';
import { initReactI18next } from 'react-i18next';
import enGB from '../locales/en-GB.json';
import enUS from '../locales/en-US.json';
import frFR from '../locales/fr-FR.json';

const languages = [
  ['en-GB', enGB],
  ['en-US', enUS],
  ['fr-FR', frFR],
] as const;

export type Language = (typeof languages)[number];

// Whether i18next has been initialized. Set on the call rather than
// read from i18next, which flags itself initialized asynchronously.
let initialized = false;

/**
 * Initializes i18n and registers the bundled locales. Initializes
 * only once, so translations registered before a repeat call are
 * kept.
 *
 * @param debug - Whether to log i18n debug output.
 */
export function initializeI18n(debug = false) {
  if (!initialized) {
    initialized = true;

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
  }

  languages.forEach((lang) => {
    i18n.addResourceBundle(lang[0], 'core', lang[1], true, true);
  });
}

export { i18n };
