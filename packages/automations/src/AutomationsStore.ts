import { createObjectStore } from '@minddrop/stores';
import { Automation } from './types';

export const AutomationsStore = createObjectStore<Automation>(
  'Automations:Automations',
  'id',
);

/**
 * Retrieves an automation by ID or null if it doesn't exist.
 *
 * @param id - The ID of the automation to retrieve.
 * @returns The automation or null if it doesn't exist.
 */
export const useAutomation = (id: string): Automation | null => {
  return AutomationsStore.useItem(id);
};

/**
 * Retrieves all automations.
 *
 * @returns An array of all automations.
 */
export const useAutomations = (): Automation[] => {
  return AutomationsStore.useAllItemsArray();
};
