import i18n from 'i18next';
import { TranslationKey } from '../i18n.types';

/**
 * Translates a key in every language with registered translations.
 *
 * @param key - The translation key to translate.
 * @returns The key's unique translations across all languages.
 */
export function translateAll(key: TranslationKey): string[] {
  // The languages with registered resource bundles
  const languages = Object.keys(i18n.services.resourceStore.data);

  // Translate the key in each language
  const translations = languages.map((language) =>
    i18n.t(key, { lng: language }),
  );

  // Drop duplicate translations shared between languages
  return [...new Set(translations)];
}
