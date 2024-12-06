import { useTranslation as baseUseTranslation } from 'react-i18next';
export { Trans } from 'react-i18next';
export type { TransProps } from 'react-i18next';

export const useTranslation = (keyPrefix?: string) =>
  baseUseTranslation('translation', { keyPrefix });

export * from './initializeI18n';
