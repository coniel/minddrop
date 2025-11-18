import { createArrayStore } from '@minddrop/utils';
import { DatabaseTemplate } from './types';

export const DatabaseTemplatesStore = createArrayStore<DatabaseTemplate>('id');

/**
 * Retrieves a database template by ID or null if it doesn't exist.
 *
 * @param id - The ID of the database template to retrieve.
 * @returns The database template with the specified ID or null if it doesn't exist.
 */
export const useDatabaseTemplate = (id: string): DatabaseTemplate | null => {
  return (
    DatabaseTemplatesStore.useAllItems().find(
      (template) => template.id === id,
    ) || null
  );
};

/**
 * Retrieves all data base templates.
 *
 * @returns And array of all database templates.
 */
export const useDatabaseTemplates = (): DatabaseTemplate[] => {
  return DatabaseTemplatesStore.useAllItems();
};
