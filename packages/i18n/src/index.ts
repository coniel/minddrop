/// <reference path="./i18n-resources.d.ts" />
import type { KeyPrefix } from 'i18next';
import { useTranslation as baseUseTranslation } from 'react-i18next';
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

/**
 * I18n API for packages to register their translations.
 */
export const I18n = {
  registerTranslations,
};

export * from './initializeI18n';
export * from './createI18nKeyBuilder';
export * from './i18n.types';
