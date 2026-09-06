import { createKeyValueStore } from '@minddrop/stores';

/**
 * Emoji skin tone modifier, 0 being none and 1 to 5 the
 * light to dark Fitzpatrick tones.
 */
export type EmojiSkinTone = 0 | 1 | 2 | 3 | 4 | 5;

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

export const AppUiState = createKeyValueStore<AppUiState>(
  'App:UiState',
  defaultState,
  {
    persistTo: 'app-config',
    namespace: 'app-ui',
  },
);
