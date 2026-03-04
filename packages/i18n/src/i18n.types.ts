import type { ParseKeys } from 'i18next';

/**
 * A valid i18n translation key for the default namespace.
 */
export type TranslationKey = ParseKeys<'core'>;

export type LanguageKey = 'en-GB' | 'en-US' | 'fr-FR';

export type Translations = {
  [key: string]: string | Translations;
};

export type Locales = Partial<Record<LanguageKey, Translations>>;
