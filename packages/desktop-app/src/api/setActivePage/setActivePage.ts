import { AppUiState } from '../../AppUiState';

/**
 * Sets the given path as the active page.
 *
 * @param path The path to set as the active page.
 */
export function setActivePage(path: string): void {
  AppUiState.set('view', 'page');
  AppUiState.set('path', path);
}
