import { I18n } from '@minddrop/i18n';
import { locales } from './locales';

/**
 * Initializes properties by registering their translations.
 */
export function initializeProperties(): void {
  I18n.registerTranslations(locales);
}
