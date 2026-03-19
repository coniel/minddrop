import { createObjectStore } from '@minddrop/stores';
import { DatabaseTemplate } from './types';

export const DatabaseTemplatesStore = createObjectStore<DatabaseTemplate>(
  'Databases:Templates',
  'name',
);

/**
 * Retrieves a database template by name or null if it doesn't exist.
 *
 * @param name - The name of the database template to retrieve.
 * @returns The database template or null if it doesn't exist.
 */
export const useDatabaseTemplate = (name: string): DatabaseTemplate | null => {
  return DatabaseTemplatesStore.useItem(name);
};

/**
 * Retrieves all database templates.
 *
 * @returns An array of all database templates.
 */
export const useDatabaseTemplates = (): DatabaseTemplate[] => {
  return DatabaseTemplatesStore.useAllItemsArray();
};
