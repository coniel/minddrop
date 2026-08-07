import { DevToolsUiState } from '../DevToolsUiState';

/**
 * Opens the dev tools, optionally activating a specific panel.
 *
 * @param panelId - The ID of the panel to activate.
 */
export function openDevTools(panelId?: string): void {
  // Activate the requested panel
  if (panelId) {
    DevToolsUiState.set('activePanelId', panelId);
  }

  DevToolsUiState.set('open', true);
}
