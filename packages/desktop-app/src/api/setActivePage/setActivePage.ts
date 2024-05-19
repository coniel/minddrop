import { AppUiState } from '../../AppUiState';

/**
 * Does something useful.
 */
export function setActivePage(path: string): void {
  AppUiState.set('view', 'page');
  AppUiState.set('path', path);
}
