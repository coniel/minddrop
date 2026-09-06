import { fuzzySearch } from '@minddrop/utils';
import { DatabaseEntryTemplatesStore } from '../../DatabaseEntryTemplatesStore';
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
  const allTemplates = DatabaseEntryTemplatesStore.getAllArray();

  // Filter templates to the given databases when provided
  const searchedTemplates = databases
    ? allTemplates.filter((template) => databases.includes(template.database))
    : allTemplates;

  // Map each template name to its results. A name can be used by
  // templates in several databases so each maps to a list.
  const resultsByName = new Map<string, DatabaseEntryTemplateSearchResult[]>();

  searchedTemplates.forEach((template) => {
    // The template's database, dropped from results if it no
    // longer exists.
    const database = DatabasesStore.get(template.database);

    if (!database) {
      return;
    }

    const nameResults = resultsByName.get(template.name) ?? [];

    nameResults.push({ database, template });
    resultsByName.set(template.name, nameResults);
  });

  // Fuzzy match against the template names
  const matchedNames = fuzzySearch([...resultsByName.keys()], query);

  // Collect the matched templates in rank order
  return matchedNames.flatMap((name) => resultsByName.get(name) ?? []);
}
