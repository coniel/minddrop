import { useMemo } from 'react';
import { Design } from '@minddrop/designs-next';
import { LayoutContext } from '../layoutContexts';
import { useDatabaseDesigns } from '../useDatabaseDesigns';

/**
 * Returns the design a database renders entries with in the given
 * display context.
 *
 * @param databaseId - The ID of the database.
 * @param context - The layout context.
 * @returns The resolved design, or null if the database has no design
 *   of the context's base type.
 */
export function useDefaultDatabaseDesign(
  databaseId: string,
  context: LayoutContext,
): Design | null {
  // Memoise the ID list so its identity is stable between renders
  const databaseIds = useMemo(() => [databaseId], [databaseId]);

  // Resolve the database's design
  return useDatabaseDesigns(databaseIds, context)[databaseId] ?? null;
}
