import { AppUiState } from '../../AppUiState';

/**
 * Sets the given path as the active document.
 *
 * @param path The path to set as the active document.
 */
export function setActiveDocument(path: string): void {
  AppUiState.set('view', 'document');
  AppUiState.set('path', path);
}
