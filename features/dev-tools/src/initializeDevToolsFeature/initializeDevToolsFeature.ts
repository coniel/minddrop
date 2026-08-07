import { I18n } from '@minddrop/i18n';
import { DevToolsUiState } from '../DevToolsUiState';
import { LogsPanel } from '../LogsPanel';
import { StoriesPanel } from '../StoriesPanel';
import { locales } from '../locales';
import { registerDevToolsPanel } from '../registerDevToolsPanel';
import { startConsoleLogCapture } from '../startConsoleLogCapture';

/**
 * Initializes the dev tools feature by registering translations
 * and the built in panels, capturing console output, then
 * hydrating the dev tools UI state.
 */
export async function initializeDevToolsFeature(): Promise<void> {
  // Register dev tools translations
  I18n.registerTranslations(locales);

  // Register the console output panel
  registerDevToolsPanel({
    id: 'logs',
    label: 'devTools.panels.logs',
    icon: 'terminal',
    shortcut: 'l',
    component: LogsPanel,
  });

  // Register the UI component stories panel
  registerDevToolsPanel({
    id: 'stories',
    label: 'devTools.panels.stories',
    icon: 'book-open',
    shortcut: 's',
    component: StoriesPanel,
  });

  // Capture console output from here on, so that it can be
  // inspected in the logs panel
  startConsoleLogCapture();

  // Restore the panel and window state from the previous session
  await DevToolsUiState.hydrate();
}
