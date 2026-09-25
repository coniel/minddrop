import { useMemo } from 'react';
import { Design, Designs } from '@minddrop/designs-next';
import { DatabasesStore } from '../DatabasesStore';
import { LayoutContext } from '../layoutContexts';
import { resolveDatabaseDesign } from '../utils';

/**
 * Returns the design each database renders entries with in the given
 * display context, keyed by database ID. A database's override is
 * used in place of its default design. Databases with no design of
 * the context's base type are omitted.
 *
 * @param databaseIds - The IDs of the databases.
 * @param context - The layout context.
 * @param overrides - The IDs of the designs to render with in place of the database defaults, keyed by database ID.
 * @returns The resolved designs, keyed by database ID.
 */
export function useDatabaseDesigns(
  databaseIds: string[],
  context: LayoutContext,
  overrides?: Record<string, string>,
): Record<string, Design> {
  // Subscribe to the databases. The designs re-resolve when a
  // database changes.
  const databases = DatabasesStore.useItemsArray(databaseIds);

  // Resolve each database's design ID without subscribing to the
  // designs store.
  const designIds = useMemo(() => {
    // The resolved design ID of each database
    const ids: Record<string, string> = {};

    // Resolve each database's design
    databases.forEach((database) => {
      const design = resolveDatabaseDesign(
        database.id,
        context,
        overrides?.[database.id],
      );

      // Skip databases with no design of the base type
      if (design) {
        ids[database.id] = design.id;
      }
    });

    return ids;
  }, [databases, context, overrides]);

  // Subscribe to the resolved designs alone. An edit to another
  // design then does not re-render.
  const designs = Designs.useByIds(Object.values(designIds));

  // Key the subscribed designs by database
  return useMemo(() => {
    // The subscribed designs keyed by database ID
    const result: Record<string, Design> = {};

    // Match each database's design ID to its subscribed design
    Object.entries(designIds).forEach(([databaseId, designId]) => {
      const design = designs.find((design) => design.id === designId);

      if (design) {
        result[databaseId] = design;
      }
    });

    return result;
  }, [designIds, designs]);
}
