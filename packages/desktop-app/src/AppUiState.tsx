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
   * The ID of the currently open document.
   */
  activeDocumentId: string | null;

  /**
   * The default skin tone to use in emoji pickers.
   */
  defaultEmojiSkinTone: EmojiSkinTone;
}

const defaultState: AppUiState = {
  sidebarWidth: 300,
  view: null,
  activeDocumentId: null,
  defaultEmojiSkinTone: 0,
};

export const AppUiState = createPersistentConfig('app-ui', defaultState);

export const useCurrentView = () =>
  AppUiState.useValue('view') as string | null;

export const useCurrentDocumentId = () =>
  AppUiState.useValue('activeDocumentId') as string | null;

export const useSidebarWidth = () =>
  AppUiState.useValue('sidebarWidth') as number;

export const useDefaultEmojiSkinTone = () =>
  AppUiState.useValue('defaultEmojiSkinTone') as EmojiSkinTone;
