import { initializeI18n } from '@minddrop/i18n';
import { DevToolsUiState } from '../DevToolsUiState';

initializeI18n();

export function setup() {}

export function cleanup() {
  DevToolsUiState.reset();
}
