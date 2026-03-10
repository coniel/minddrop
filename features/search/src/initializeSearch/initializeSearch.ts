import { I18n } from '@minddrop/i18n';
import { locales } from '../locales';

/**
 * Initializes the search feature by registering
 * translations.
 */
export function initializeSearch(): void {
  // Register search translations
  I18n.registerTranslations(locales);
}
