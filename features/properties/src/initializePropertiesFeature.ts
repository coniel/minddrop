import { I18n } from '@minddrop/i18n';
import { locales } from './locales';

/**
 * Initializes the properties feature by registering its translations.
 */
export function initializePropertiesFeature(): void {
  I18n.registerTranslations(locales);
}
