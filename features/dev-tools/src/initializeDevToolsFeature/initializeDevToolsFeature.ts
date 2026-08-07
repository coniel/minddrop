import { I18n } from '@minddrop/i18n';
import { DevToolsUiState } from '../DevToolsUiState';
import { EventsPanel } from '../EventsPanel';
import { LogsPanel } from '../LogsPanel';
import { StatePanel } from '../StatePanel';
import { StoriesPanel } from '../StoriesPanel';
import { locales } from '../locales';
import { registerDevToolsPanel } from '../registerDevToolsPanel';
import { startConsoleLogCapture } from '../startConsoleLogCapture';
import { startEventCapture } from '../startEventCapture';

/**
 * Initializes the dev tools feature by registering translations
 * and the built in panels, capturing console output and events,
 * then hydrating the dev tools UI state.
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

  // Register the dispatched events panel
  registerDevToolsPanel({
    id: 'events',
    label: 'devTools.panels.events',
    icon: 'zap',
    shortcut: 'e',
    component: EventsPanel,
  });

  // Register the store contents panel
  registerDevToolsPanel({
    id: 'state',
    label: 'devTools.panels.state',
    icon: 'database',
    shortcut: 'i',
    component: StatePanel,
  });

  // Register the UI component stories panel
  registerDevToolsPanel({
    id: 'stories',
    label: 'devTools.panels.stories',
    icon: 'book-open',
    shortcut: 's',
    component: StoriesPanel,
  });

  // Capture console output and dispatched events from here on,
  // so that they can be inspected in their panels
  startConsoleLogCapture();
  startEventCapture();

  // Restore the panel and window state from the previous session
  await DevToolsUiState.hydrate();
}
