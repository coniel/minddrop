import { fuzzySearch } from '@minddrop/utils';
import { DatabasesStore } from '../../DatabasesStore';
import { Database } from '../../types';

/**
 * Performs a fuzzy search on database names and entry names.
 *
 * @param query - The search query.
 * @param databases - IDs of the databases to include. All databases are included when omitted.
 * @returns The matched databases ranked by match quality.
 */
export function searchDatabases(
  query: string,
  databases?: string[],
): Database[] {
  const allDatabases = DatabasesStore.getAllArray();

  // Filter databases to the given IDs when provided
  const searchedDatabases = databases
    ? allDatabases.filter((database) => databases.includes(database.id))
    : allDatabases;

  // Map each searchable string to its databases. A string can
  // belong to multiple databases so each maps to a list.
  const databasesByText = new Map<string, Database[]>();

  searchedDatabases.forEach((database) => {
    [database.name, database.entryName].forEach((text) => {
      const textDatabases = databasesByText.get(text) ?? [];

      textDatabases.push(database);
      databasesByText.set(text, textDatabases);
    });
  });

  // Fuzzy match against both names and entry names
  const matchedTexts = fuzzySearch(
    searchedDatabases.flatMap((database) => [
      database.name,
      database.entryName,
    ]),
    query,
  );

  // Collect matched databases in rank order
  const matched: Database[] = [];

  matchedTexts.forEach((text) => {
    databasesByText.get(text)?.forEach((database) => {
      // Skip databases already matched via another string
      if (!matched.includes(database)) {
        matched.push(database);
      }
    });
  });

  return matched;
}
