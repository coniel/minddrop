import { createObjectStore } from '@minddrop/stores';
import { DatabasesStore } from './DatabasesStore';
import { DatabaseEntryTemplate } from './types';
import { sortDatabaseEntryTemplates } from './utils';

export const DatabaseEntryTemplatesStore =
  createObjectStore<DatabaseEntryTemplate>(
    'Databases:DatabaseEntryTemplates',
    'id',
  );

/**
 * Retrieves entry templates filtered to a single database when an
 * ID is given. Each database's templates are sorted by its config's
 * template ID list.
 *
 * @param databaseId - The ID of the database whose templates to retrieve. All templates are returned when omitted.
 * @returns An array of entry templates.
 */
export const useDatabaseEntryTemplates = (
  databaseId?: string,
): DatabaseEntryTemplate[] => {
  // Get all templates and databases (for their template orders)
  const templates = DatabaseEntryTemplatesStore.useAllItemsArray();
  const databases = DatabasesStore.useAllItemsArray();

  // Group the requested templates by database
  const byDatabase = new Map<string, DatabaseEntryTemplate[]>();

  templates.forEach((template) => {
    if (databaseId && template.database !== databaseId) {
      return;
    }

    const databaseTemplates = byDatabase.get(template.database) ?? [];

    databaseTemplates.push(template);
    byDatabase.set(template.database, databaseTemplates);
  });

  // Sort each database's templates by its config's template ID list
  return [...byDatabase.entries()].flatMap(([database, databaseTemplates]) =>
    sortDatabaseEntryTemplates(
      databaseTemplates,
      databases.find(({ id }) => id === database)?.entryTemplates,
    ),
  );
};
