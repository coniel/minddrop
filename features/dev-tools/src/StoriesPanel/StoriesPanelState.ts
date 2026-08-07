import { createKeyValueStore } from '@minddrop/stores';

export interface StoriesPanelState {
  /**
   * ID of the story being previewed.
   */
  activeStoryId: string | null;
}

const defaultState: StoriesPanelState = {
  activeStoryId: null,
};

export const StoriesPanelState = createKeyValueStore<StoriesPanelState>(
  'DevTools:StoriesPanel',
  defaultState,
);
