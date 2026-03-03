import { useTranslation as baseUseTranslation } from 'react-i18next';
import { registerTranslations } from './registerTranslations';

export { Trans } from 'react-i18next';
export type { TransProps } from 'react-i18next';

/**
 * Returns a translation function, with an optional namespace and key prefix.
 */
export const useTranslation = ({
  namespace,
  keyPrefix,
}: {
  namespace?: string;
  keyPrefix?: string;
} = {}) => baseUseTranslation(namespace || 'core', { keyPrefix });

/**
 * I18n API for packages to register their translations.
 */
export const I18n = {
  registerTranslations,
};

export * from './initializeI18n';
export * from './i18n.types';
