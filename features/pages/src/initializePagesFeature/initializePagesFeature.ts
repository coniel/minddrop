import { I18n } from '@minddrop/i18n';
import { locales } from '../locales';

/**
 * Initializes the pages feature by registering
 * translations.
 */
export function initializePagesFeature(): void {
  // Register pages translations
  I18n.registerTranslations(locales);
}
