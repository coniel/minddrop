import { DevToolsUiState } from '../DevToolsUiState';
import { DevToolsWindowRect } from '../types';

/**
 * Sets the position and size of the floating dev tools window.
 *
 * @param rect - The window rect to apply.
 */
export function setDevToolsWindowRect(rect: DevToolsWindowRect): void {
  DevToolsUiState.set('windowX', rect.x);
  DevToolsUiState.set('windowY', rect.y);
  DevToolsUiState.set('windowWidth', rect.width);
  DevToolsUiState.set('windowHeight', rect.height);
}
