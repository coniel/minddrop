import { DevToolsPanelsStore } from '../DevToolsPanelsStore';
import { DevToolsPanelConfig } from '../types';

/**
 * Registers a dev tools panel, adding a tab for it to the
 * dev tools shell.
 *
 * @param panel - The panel to register.
 */
export function registerDevToolsPanel(panel: DevToolsPanelConfig): void {
  DevToolsPanelsStore.set(panel);
}
