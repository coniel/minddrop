import { createArrayStore } from '@minddrop/stores';
import { DevToolsEventEntry } from './types';

export const DevToolsEventsStore = createArrayStore<DevToolsEventEntry>(
  'DevTools:Events',
  'id',
);

/**
 * Retrieves the captured events, oldest first.
 *
 * @returns An array of all captured events.
 */
export const useDevToolsEvents = (): DevToolsEventEntry[] =>
  DevToolsEventsStore.useAllItems();
