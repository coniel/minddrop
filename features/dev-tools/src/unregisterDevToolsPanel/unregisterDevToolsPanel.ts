import { DevToolsPanelsStore } from '../DevToolsPanelsStore';

/**
 * Unregisters a dev tools panel, removing its tab from the
 * dev tools shell.
 *
 * @param id - The ID of the panel to unregister.
 */
export function unregisterDevToolsPanel(id: string): void {
  DevToolsPanelsStore.remove(id);
}
