import { DatabaseEntryTemplatesStore } from '../DatabaseEntryTemplatesStore';
import { getDatabase } from '../getDatabase';
import { DatabaseEntryTemplate } from '../types';
import { sortDatabaseEntryTemplates } from '../utils';

/**
 * Retrieves a database's entry templates, sorted by the config's
 * template ID list.
 *
 * @param databaseId - The ID of the database whose templates to retrieve.
 * @returns An array of the database's entry templates.
 */
export function getDatabaseEntryTemplates(
  databaseId: string,
): DatabaseEntryTemplate[] {
  // Filter the store to the database's templates
  const templates = DatabaseEntryTemplatesStore.getAllArray().filter(
    (template) => template.database === databaseId,
  );

  // Sort by the config's template ID list
  return sortDatabaseEntryTemplates(
    templates,
    getDatabase(databaseId, false)?.entryTemplates,
  );
}
