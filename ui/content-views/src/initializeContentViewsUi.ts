import { I18n } from '@minddrop/i18n';
import { locales } from './locales';

/**
 * Initializes the content views UI package by registering its translations.
 */
export function initializeContentViewsUi(): void {
  I18n.registerTranslations(locales);
}
