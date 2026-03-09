import type { ParseKeys } from 'i18next';

/**
 * A valid i18n translation key for the default namespace.
 */
export type TranslationKey = ParseKeys<'core'>;

/**
 * Extracts the valid suffixes that follow a given prefix
 * in the TranslationKey union.
 *
 * Example: `TranslationKeySuffix<'designs.typography.'>` yields
 * `'font-family.inherit' | 'font-family.sans' | ...`
 */
export type TranslationKeySuffix<Prefix extends string> =
  Extract<TranslationKey, `${Prefix}${string}`> extends `${Prefix}${infer S}`
    ? S
    : never;

export type LanguageKey = 'en-GB' | 'en-US' | 'fr-FR';

export type Translations = {
  [key: string]: string | Translations;
};

export type Locales = Partial<Record<LanguageKey, Translations>>;
