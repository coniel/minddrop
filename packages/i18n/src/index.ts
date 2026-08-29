// The generated resources file augments i18next's module declaration, which
// is what gives TranslationKey its value. It exports nothing, so an import
// would be elided and the augmentation lost.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./i18n-resources.d.ts" />
import type { KeyPrefix } from 'i18next';
import { useTranslation as baseUseTranslation } from 'react-i18next';
import { TranslationKey } from './i18n.types';
import { i18n } from './initializeI18n';
import { registerTranslations } from './registerTranslations';

export { Trans } from 'react-i18next';
export type { TransProps } from 'react-i18next';

/**
 * Returns a translation function, with an optional namespace and key prefix.
 */
export const useTranslation = <KPrefix extends KeyPrefix<'core'> = undefined>({
  namespace,
  keyPrefix,
}: {
  namespace?: string;
  keyPrefix?: KPrefix;
} = {}) => baseUseTranslation((namespace || 'core') as 'core', { keyPrefix });

export interface DynamicTranslationOptions {
  /**
   * The namespace to translate from. Defaults to the core namespace.
   */
  namespace?: string;

  /**
   * A prefix prepended to translation keys.
   */
  keyPrefix?: string;
}

/**
 * Translates a key from a namespace registered at runtime.
 *
 * Namespaces registered by extensions are not part of the compile-time
 * key union, so their keys and prefixes are accepted as plain strings.
 */
export const translateDynamic = (
  key: string,
  { namespace, keyPrefix }: DynamicTranslationOptions = {},
): string =>
  i18n.t(key as TranslationKey, {
    ns: (namespace || 'core') as 'core',
    keyPrefix: keyPrefix as KeyPrefix<'core'>,
  });

/**
 * Returns a translation function for a namespace registered at runtime.
 *
 * Namespaces registered by extensions are not part of the compile-time
 * key union, so their keys and prefixes are accepted as plain strings.
 */
export const useDynamicTranslation = ({
  namespace,
  keyPrefix,
}: DynamicTranslationOptions = {}) =>
  baseUseTranslation((namespace || 'core') as 'core', {
    keyPrefix: keyPrefix as KeyPrefix<'core'>,
  });

/**
 * I18n API for packages to register their translations.
 */
export const I18n = {
  registerTranslations,
};

export * from './initializeI18n';
export * from './createI18nKeyBuilder';
export * from './translateAll';
export * from './i18n.types';
