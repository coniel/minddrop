import { DevToolsUiState } from '../DevToolsUiState';

/**
 * Toggles the dev tools open and closed.
 */
export function toggleDevTools(): void {
  DevToolsUiState.set('open', !DevToolsUiState.get('open'));
}
