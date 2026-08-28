import { createKeyValueStore } from '@minddrop/stores';

export interface SettingsUiState {
  /**
   * Current width of the settings sidebar in pixels.
   */
  sidebarWidth: number;
}

const defaultState: SettingsUiState = {
  sidebarWidth: 300,
};

export const SettingsUiState = createKeyValueStore<SettingsUiState>(
  'Settings:UiState',
  defaultState,
  {
    persistTo: 'app-config',
    namespace: 'settings-ui',
  },
);
