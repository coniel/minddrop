import { DevToolsUiState } from '../DevToolsUiState';

/**
 * Toggles the dev tools between the fullscreen overlay and the
 * floating window.
 */
export function toggleDevToolsWindowed(): void {
  DevToolsUiState.set('windowed', !DevToolsUiState.get('windowed'));
}
