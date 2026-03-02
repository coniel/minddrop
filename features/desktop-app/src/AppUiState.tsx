import { createPersistentConfig } from '@minddrop/core';
import { EmojiSkinTone } from '@minddrop/icons';

export interface AppUiState {
  /**
   * Current width of the sidebar in pixels.
   */
  sidebarWidth: number;

  /**
   * The currently open view.
   */
  view: string | null;

  /**
   * The default skin tone to use in emoji pickers.
   */
  defaultEmojiSkinTone: EmojiSkinTone;
}

const defaultState: AppUiState = {
  sidebarWidth: 300,
  view: null,
  defaultEmojiSkinTone: 0,
};

export const AppUiState = createPersistentConfig<AppUiState>(
  'app-ui',
  defaultState,
);

export const useCurrentView = () => AppUiState.useValue('view', null);

export const useSidebarWidth = () =>
  AppUiState.useValue('sidebarWidth', defaultState.sidebarWidth);

export const useDefaultEmojiSkinTone = () =>
  AppUiState.useValue(
    'defaultEmojiSkinTone',
    defaultState.defaultEmojiSkinTone,
  );
