import { I18n } from '@minddrop/i18n';
import { locales } from './locales';

/**
 * Initializes the editor by registering its translations.
 */
export function initializeEditor(): void {
  I18n.registerTranslations(locales);
}
