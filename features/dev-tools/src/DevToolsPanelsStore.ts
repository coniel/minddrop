import { createObjectStore } from '@minddrop/stores';
import { DevToolsPanelConfig } from './types';

export const DevToolsPanelsStore = createObjectStore<DevToolsPanelConfig>(
  'DevTools:Panels',
  'id',
);

/**
 * Retrieves a registered dev tools panel by ID.
 *
 * @param id - The ID of the panel to retrieve.
 * @returns The panel or null if it isn't registered.
 */
export const useDevToolsPanel = (
  id: string | null,
): DevToolsPanelConfig | null => DevToolsPanelsStore.useItem(id ?? '');

/**
 * Retrieves all registered dev tools panels in registration order.
 *
 * @returns An array of all registered panels.
 */
export const useDevToolsPanels = (): DevToolsPanelConfig[] =>
  DevToolsPanelsStore.useAllItemsArray();
