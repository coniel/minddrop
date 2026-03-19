import { createObjectStore } from '@minddrop/stores';
import {
  DatabaseAutomationActionConfig,
  DatabaseAutomationUpdatePropertyActionConfig,
} from './types';

export const DatabaseAutomationActionConfigsStore = createObjectStore<
  DatabaseAutomationActionConfig | DatabaseAutomationUpdatePropertyActionConfig
>('Databases:AutomationActionConfigs', 'type');

/**
 * Retrieves an automation action config by type or null if it doesn't exist.
 *
 * @param type - The type of the automation action config to retrieve.
 * @returns The automation action config or null if it doesn't exist.
 */
export const useDatabaseAutomation = (
  type: string,
):
  | DatabaseAutomationActionConfig
  | DatabaseAutomationUpdatePropertyActionConfig
  | null => {
  return DatabaseAutomationActionConfigsStore.useItem(type);
};

/**
 * Retrieves all automation action configs for a given database.
 *
 * @returns And array of automation action configs.
 */
export const useDatabaseAutomations = (): (
  | DatabaseAutomationActionConfig
  | DatabaseAutomationUpdatePropertyActionConfig
)[] => {
  return DatabaseAutomationActionConfigsStore.useAllItemsArray();
};
