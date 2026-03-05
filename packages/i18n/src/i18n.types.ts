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

/**
 * Extends a string suffix union to also include the numeric
 * literal forms of any purely numeric strings.
 * e.g. `'inherit' | '100'` becomes `'inherit' | '100' | 100`
 */
type WithNumericForms<S extends string> =
  | S
  | (S extends `${infer N extends number}` ? N : never);

/**
 * Creates a type-safe i18n key builder for a given prefix.
 * The returned function only accepts valid suffixes and
 * produces a full TranslationKey as its return type.
 *
 * Supports both flat keys and nested keys with a sub-key:
 * ```ts
 * const i18nKey = createI18nKeyBuilder('designs.typography.');
 * i18nKey('color');              // "designs.typography.color"
 * i18nKey('font-weight', 400);  // "designs.typography.font-weight.400"
 * i18nKey('invalid');            // type error
 * i18nKey('font-weight', 999);  // type error
 * ```
 */
export function createI18nKeyBuilder<Prefix extends string>(prefix: Prefix) {
  function builder<K extends TranslationKeySuffix<Prefix>>(
    key: K,
  ): `${Prefix}${K}`;
  function builder<
    K1 extends string,
    K2 extends WithNumericForms<TranslationKeySuffix<`${Prefix}${K1}.`>>,
  >(key: K1, subKey: K2): `${Prefix}${K1}.${K2}`;
  function builder(key: string, subKey?: string | number): string {
    if (subKey !== undefined) {
      return `${prefix}${key}.${subKey}`;
    }

    return `${prefix}${key}`;
  }

  return builder;
}

export type LanguageKey = 'en-GB' | 'en-US' | 'fr-FR';

export type Translations = {
  [key: string]: string | Translations;
};

export type Locales = Partial<Record<LanguageKey, Translations>>;
