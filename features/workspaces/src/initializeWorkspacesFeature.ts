import { I18n } from '@minddrop/i18n';
import { initializeWorkspacesUi } from '@minddrop/ui-workspaces';
import { locales } from './locales';

/**
 * Initializes the workspaces feature by registering its translations
 * along with those of the workspaces UI components it renders.
 */
export function initializeWorkspacesFeature(): void {
  // Register the feature's translations
  I18n.registerTranslations(locales);

  // Register the workspaces UI translations
  initializeWorkspacesUi();
}
