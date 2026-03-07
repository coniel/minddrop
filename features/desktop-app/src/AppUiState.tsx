import { createKeyValueStore } from '@minddrop/stores';
import { EmojiSkinTone } from '@minddrop/ui-icons';

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
