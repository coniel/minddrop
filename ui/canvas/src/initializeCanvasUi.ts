import { I18n } from '@minddrop/i18n';
import { locales } from './locales';

/**
 * Initializes the canvas UI package by registering its translations.
 */
export function initializeCanvasUi(): void {
  I18n.registerTranslations(locales);
}
