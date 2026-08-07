import { initializeI18n } from '@minddrop/i18n';
import { DevToolsPanelsStore } from '../DevToolsPanelsStore';
import { DevToolsUiState } from '../DevToolsUiState';

initializeI18n();

export function setup() {}

export function cleanup() {
  DevToolsPanelsStore.clear();
  DevToolsUiState.reset();
}
