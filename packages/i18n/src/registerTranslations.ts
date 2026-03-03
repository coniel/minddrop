import i18n from 'i18next';
import { LanguageKey, Translations } from './i18n.types';

/**
 * Registers translations for a given set of locales by deep-merging
 * them into the 'core' namespace.
 */
export function registerTranslations(
  locales: Partial<Record<LanguageKey, Translations>>,
): void {
  Object.entries(locales).forEach(([language, translations]) => {
    i18n.addResourceBundle(language, 'core', translations, true, true);
  });
}
