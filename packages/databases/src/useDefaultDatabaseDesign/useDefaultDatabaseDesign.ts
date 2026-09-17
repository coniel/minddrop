import { Design, Designs } from '@minddrop/designs-next';
import { useDatabase } from '../DatabasesStore';
import { getDefaultDatabaseDesign } from '../getDefaultDatabaseDesign';
import { LayoutContext } from '../layoutContexts';

/**
 * Returns the design a database renders entries with in the given
 * display context, re-rendering when that design changes. Resolves in
 * the same order as `getDefaultDatabaseDesign`.
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
  // Subscribes to the database, whose design ID list and default
  // design pins the resolution reads.
  const database = useDatabase(databaseId);

  // Resolve the design without subscribing to the designs store
  const designId = database
    ? getDefaultDatabaseDesign(databaseId, context)?.id
    : null;

  // Subscribe to the resolved design alone, so that an edit to
  // another design does not re-render.
  return Designs.use(designId ?? '');
}
