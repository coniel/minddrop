import { fuzzySearch } from '@minddrop/utils';
import { DatabaseEntryTemplatesStore } from '../../DatabaseEntryTemplatesStore';
import { DatabasesStore } from '../../DatabasesStore';
import { Database, DatabaseEntryTemplate } from '../../types';

export interface DatabaseEntryCreationOption {
  /**
   * The database the entry is created in.
   */
  database: Database;

  /**
   * The entry template the entry is created from, absent when it
   * is created blank.
   */
  template?: DatabaseEntryTemplate;
}

/**
 * Performs a fuzzy search on the ways a new entry can be created.
 * Databases are matched by their name and their entry name, entry
 * templates by theirs.
 *
 * @param query - The search query.
 * @param databases - IDs of the databases to include. All databases are included when omitted.
 * @returns The matched creation options ranked by match quality.
 */
export function searchDatabaseEntryCreationOptions(
  query: string,
  databases?: string[],
): DatabaseEntryCreationOption[] {
  // Get every database
  const allDatabases = DatabasesStore.getAllArray();

  // Filter databases to the given IDs when provided
  const searchedDatabases = databases
    ? allDatabases.filter((database) => databases.includes(database.id))
    : allDatabases;

  // Queue up options per searchable string, so that a string used
  // by more than one database or template maps back to each of them.
  const optionsByText = new Map<string, DatabaseEntryCreationOption[]>();

  // Queue an option under a string it can be matched by
  function queueOption(text: string, option: DatabaseEntryCreationOption) {
    optionsByText.set(text, [...(optionsByText.get(text) ?? []), option]);
  }

  // Queue each database under its name and its entry name
  searchedDatabases.forEach((database) => {
    [database.name, database.entryName].forEach((text) => {
      queueOption(text, { database });
    });
  });

  // Queue each entry template under its name
  DatabaseEntryTemplatesStore.getAllArray().forEach((template) => {
    // Get the template's database
    const database = searchedDatabases.find(
      (searched) => searched.id === template.database,
    );

    // Skip templates whose database is not searched
    if (!database) {
      return;
    }

    queueOption(template.name, { database, template });
  });

  // Fuzzy match every searchable string at once, so databases and
  // templates rank against each other.
  const matchedTexts = fuzzySearch([...optionsByText.keys()], query);

  // The matched options, in rank order
  const matched: DatabaseEntryCreationOption[] = [];

  // Collect the options queued under each matched string. A
  // database is listed once however many of its names matched.
  matchedTexts.forEach((text) => {
    optionsByText.get(text)?.forEach((option) => {
      if (!matched.some((collected) => isSameOption(collected, option))) {
        matched.push(option);
      }
    });
  });

  return matched;
}

/**
 * Whether both options create the same entry.
 */
function isSameOption(
  option: DatabaseEntryCreationOption,
  other: DatabaseEntryCreationOption,
): boolean {
  return (
    option.database.id === other.database.id &&
    option.template?.id === other.template?.id
  );
}
