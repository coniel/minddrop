import { I18n } from '@minddrop/i18n';
import { locales } from './locales';

/**
 * Initializes the databases feature by registering its translations.
 */
export function initializeDatabasesFeature(): void {
  I18n.registerTranslations(locales);
}
