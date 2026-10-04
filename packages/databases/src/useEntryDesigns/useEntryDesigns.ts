import { useMemo } from 'react';
import { Design } from '@minddrop/designs-next';
import { LayoutContext } from '../layoutContexts';
import { useDatabaseDesigns } from '../useDatabaseDesigns';
import { useDatabasesFromEntries } from '../useDatabasesFromEntries';
import { resolveEntryDatabaseValues } from '../utils';

/**
 * Returns the design each entry renders with in the given display
 * context, keyed by entry ID. A database's override is used in place
 * of its default design. Entries of a database with no design of the
 * context's base type are omitted.
 *
 * @param entryIds - The IDs of the entries.
 * @param context - The layout context.
 * @param overrides - The IDs of the designs to render with in place of the database defaults, keyed by database ID.
 * @returns The resolved designs, keyed by entry ID.
 */
export function useEntryDesigns(
  entryIds: string[],
  context: LayoutContext,
  overrides?: Record<string, string>,
): Record<string, Design> {
  // The databases the entries belong to
  const databases = useDatabasesFromEntries(entryIds);

  // Map the databases to their IDs
  const databaseIds = useMemo(
    () => databases.map((database) => database.id),
    [databases],
  );

  // Resolve the design each database renders entries with in the
  // context.
  const databaseDesigns = useDatabaseDesigns(databaseIds, context, overrides);

  // Key the designs by entry
  return useMemo(
    () => resolveEntryDatabaseValues(entryIds, databaseDesigns),
    [entryIds, databaseDesigns],
  );
}
