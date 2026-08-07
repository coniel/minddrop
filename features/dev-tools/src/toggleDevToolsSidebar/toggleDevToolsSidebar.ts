import { DevToolsUiState } from '../DevToolsUiState';

/**
 * Toggles the active panel's sidebar.
 */
export function toggleDevToolsSidebar(): void {
  DevToolsUiState.set('sidebarOpen', !DevToolsUiState.get('sidebarOpen'));
}
