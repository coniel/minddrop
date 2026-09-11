import { I18n } from '@minddrop/i18n';
import { locales } from './locales';

/**
 * Initializes the entity groups UI package by registering its
 * translations.
 */
export function initializeEntityGroupsUi(): void {
  I18n.registerTranslations(locales);
}
