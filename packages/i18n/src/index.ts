import { useTranslation as baseUseTranslation } from 'react-i18next';

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

export * from './initializeI18n';
export * from './i18n.types';
