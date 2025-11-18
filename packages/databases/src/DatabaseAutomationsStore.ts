import { createArrayStore } from '@minddrop/utils';
import { DatabaseAutomation } from './types';

export const DatabaseAutomationsStore =
  createArrayStore<DatabaseAutomation>('id');

/**
 * Retrieves an automation by ID or null if it doesn't exist.
 *
 * @param id - The ID of the automation to retrieve.
 * @returns The automation or null if it doesn't exist.
 */
export const useDatabaseAutomation = (
  id: string,
): DatabaseAutomation | null => {
  return (
    DatabaseAutomationsStore.useAllItems().find((config) => config.id === id) ||
    null
  );
};

/**
 * Retrieves all automations for a given database.
 *
 * @returns And array of the database's automations.
 */
export const useDatabaseAutomations = (
  database: string,
): DatabaseAutomation[] => {
  return DatabaseAutomationsStore.useAllItems().filter(
    (config) => config.database === database,
  );
};
