import { DevToolsUiState } from '../DevToolsUiState';

/**
 * Closes the dev tools.
 */
export function closeDevTools(): void {
  DevToolsUiState.set('open', false);
}
