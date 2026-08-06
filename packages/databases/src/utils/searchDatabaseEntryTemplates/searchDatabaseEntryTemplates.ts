import { fuzzySearch } from '@minddrop/utils';
import { DatabasesStore } from '../../DatabasesStore';
import { Database, DatabaseEntryTemplate } from '../../types';

export interface DatabaseEntryTemplateSearchResult {
  /**
   * The database the matched template belongs to.
   */
  database: Database;

  /**
   * The matched entry template.
   */
  template: DatabaseEntryTemplate;
}

/**
 * Performs a fuzzy search on database entry template names.
 *
 * @param query - The search query.
 * @param databases - IDs of the databases to include. All databases are included when omitted.
 * @returns The matched templates paired with their database, ranked by match quality.
 */
export function searchDatabaseEntryTemplates(
  query: string,
  databases?: string[],
): DatabaseEntryTemplateSearchResult[] {
  const allDatabases = DatabasesStore.getAllArray();

  // Filter databases to the given IDs when provided
  const searchedDatabases = databases
    ? allDatabases.filter((database) => databases.includes(database.id))
    : allDatabases;

  // Map each template name to its results. A name can be used by
  // templates in several databases so each maps to a list.
  const resultsByName = new Map<string, DatabaseEntryTemplateSearchResult[]>();

  searchedDatabases.forEach((database) => {
    (database.entryTemplates ?? []).forEach((template) => {
      const nameResults = resultsByName.get(template.name) ?? [];

      nameResults.push({ database, template });
      resultsByName.set(template.name, nameResults);
    });
  });

  // Fuzzy match against the template names
  const matchedNames = fuzzySearch([...resultsByName.keys()], query);

  // Collect the matched templates in rank order
  return matchedNames.flatMap((name) => resultsByName.get(name) ?? []);
}
