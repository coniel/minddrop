import { I18n } from '@minddrop/i18n';
import { locales } from './locales';

/**
 * Initializes the workspaces UI package by registering its
 * translations.
 */
export function initializeWorkspacesUi(): void {
  I18n.registerTranslations(locales);
}
