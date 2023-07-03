import { createPersistentConfig } from '@minddrop/core';

export interface AppUiState {
  /**
   * Current width of the sidebar in pixels.
   */
  sidebarWidth: number;
}

export const AppUiState = createPersistentConfig('app-ui', {
  sidebarWidth: 300,
});

export function useAppUiState<T extends keyof AppUiState>(
  key: keyof AppUiState,
): AppUiState[T] {
  const value = AppUiState.useValue<AppUiState[T]>(key);

  if (typeof value === 'undefined') {
    throw new Error(`Missing UI state value ${key}`);
  }

  return value;
}
