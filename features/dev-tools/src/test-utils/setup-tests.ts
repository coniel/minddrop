import { Events } from '@minddrop/events';
import { initializeI18n } from '@minddrop/i18n';
import { DevToolsEventsStore } from '../DevToolsEventsStore';
import { DevToolsLogsStore } from '../DevToolsLogsStore';
import { DevToolsPanelsStore } from '../DevToolsPanelsStore';
import { DevToolsUiState } from '../DevToolsUiState';

initializeI18n();

export function setup() {}

export function cleanup() {
  DevToolsPanelsStore.clear();
  DevToolsLogsStore.clear();
  DevToolsEventsStore.clear();
  DevToolsUiState.reset();
  Events._clearAll();
}
