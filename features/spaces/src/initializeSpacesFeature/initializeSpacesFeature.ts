import { I18n } from '@minddrop/i18n';
import { locales } from '../locales';

/**
 * Initializes the spaces feature by registering
 * translations.
 */
export function initializeSpacesFeature(): void {
  // Register spaces translations
  I18n.registerTranslations(locales);
}
