import { I18n } from '@minddrop/i18n';
import { locales } from './locales';

/**
 * Initializes tags by registering the package's translations.
 */
export function initializeTags(): void {
  I18n.registerTranslations(locales);
}
