import { I18n } from '@minddrop/i18n';
import { locales } from './locales';

/**
 * Initializes the settings feature: registers its translations.
 */
export function initializeSettingsFeature(): void {
  I18n.registerTranslations(locales);
}
