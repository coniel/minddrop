import { I18n } from '@minddrop/i18n';
import { locales } from './locales';

/**
 * Initializes the views feature by registering translations. Called
 * once on app init.
 */
export function initializeViewsFeature(): void {
  I18n.registerTranslations(locales);
}
