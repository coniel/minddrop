import { I18n } from '@minddrop/i18n';
import { locales } from './locales';

/**
 * Initializes the databases UI package by registering its translations.
 */
export function initializeDatabasesUi(): void {
  I18n.registerTranslations(locales);
}
