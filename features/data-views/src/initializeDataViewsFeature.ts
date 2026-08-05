import { I18n } from '@minddrop/i18n';
import { locales } from './locales';

/**
 * Initializes the data views feature.
 */
export function initializeDataViewsFeature(): void {
  // Register the feature's translations
  I18n.registerTranslations(locales);
}
