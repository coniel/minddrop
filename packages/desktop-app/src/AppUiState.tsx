import { createPersistentConfig } from '@minddrop/core';

export interface AppUiState {
  /**
   * Current width of the sidebar in pixels.
   */
  sidebarWidth: number;

  /**
   * The currently open view.
   */
  view: string | null;
}

export const AppUiState = createPersistentConfig('app-ui', {
  sidebarWidth: 300,
  view: null,
});

export const useCurrentView = () =>
  AppUiState.useValue('view') as string | null;

export const useSidebarWidth = () =>
  AppUiState.useValue('sidebarWidth') as number;
