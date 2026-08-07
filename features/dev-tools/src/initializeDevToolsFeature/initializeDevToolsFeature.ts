import { I18n } from '@minddrop/i18n';
import { DevToolsUiState } from '../DevToolsUiState';
import { StoriesPanel } from '../StoriesPanel';
import { locales } from '../locales';
import { registerDevToolsPanel } from '../registerDevToolsPanel';

/**
 * Initializes the dev tools feature by registering translations
 * and the built in panels, then hydrating the dev tools UI state.
 */
export async function initializeDevToolsFeature(): Promise<void> {
  // Register dev tools translations
  I18n.registerTranslations(locales);

  // Register the UI component stories panel
  registerDevToolsPanel({
    id: 'stories',
    label: 'devTools.panels.stories',
    icon: 'book-open',
    shortcut: 's',
    component: StoriesPanel,
  });

  // Restore the panel and window state from the previous session
  await DevToolsUiState.hydrate();
}
