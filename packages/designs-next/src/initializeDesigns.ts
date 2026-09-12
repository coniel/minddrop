import { I18n } from '@minddrop/i18n';
import { locales } from './locales';

/**
 * Initializes designs by registering the package's translations.
 */
export function initializeDesigns(): void {
  I18n.registerTranslations(locales);
}
