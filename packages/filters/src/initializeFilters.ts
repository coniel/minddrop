import { I18n } from '@minddrop/i18n';
import { locales } from './locales';

/**
 * Initializes filters by registering their translations.
 */
export function initializeFilters(): void {
  // Register the filter translations
  I18n.registerTranslations(locales);
}
