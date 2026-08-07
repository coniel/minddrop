import { createArrayStore } from '@minddrop/stores';
import { DevToolsLogEntry } from './types';

export const DevToolsLogsStore = createArrayStore<DevToolsLogEntry>(
  'DevTools:Logs',
  'id',
);

/**
 * Retrieves the captured log entries, oldest first.
 *
 * @returns An array of all captured log entries.
 */
export const useDevToolsLogs = (): DevToolsLogEntry[] =>
  DevToolsLogsStore.useAllItems();
