import { useMemo } from 'react';
import { Design } from '@minddrop/designs-next';
import { LayoutContext } from '../layoutContexts';
import { useDatabaseDesigns } from '../useDatabaseDesigns';

/**
 * Returns the design a database renders entries with in the given
 * display context.
 *
 * @param databaseId - The ID of the database, or null when there is none.
 * @param context - The layout context.
 * @returns The resolved design, or null if there is no database or it
 *   has no design of the context's base type.
 */
export function useDefaultDatabaseDesign(
  databaseId: string | null,
  context: LayoutContext,
): Design | null {
  // Memoise the ID list so its identity is stable between renders
  const databaseIds = useMemo(
    () => (databaseId ? [databaseId] : []),
    [databaseId],
  );

  // Resolve the database's design
  const designs = useDatabaseDesigns(databaseIds, context);

  if (!databaseId) {
    return null;
  }

  return designs[databaseId] ?? null;
}
