import { Designs, Layout } from '@minddrop/designs-legacy';
import { getDatabase } from '../getDatabase';
import { LayoutContext, layoutContextBaseType } from '../layoutContexts';

/**
 * Returns the default layout for a database in the given display context.
 * Resolves in order: explicit pin in `defaultLayouts` for the context (if
 * still present in the database's design and of the context's base type) →
 * first layout of the context's base type in the database's design → null.
 * Returns null when the database has no `designId` set; the renderer handles
 * the missing case with an inline fallback.
 *
 * @param databaseId - The ID of the database.
 * @param context - The layout context.
 * @returns The resolved layout, or null if the database has no design or
 *   no matching layout exists in it.
 */
export function getDefaultDatabaseLayout(
  databaseId: string,
  context: LayoutContext,
): Layout | null {
  // Get the database
  const database = getDatabase(databaseId);

  // No design assigned; the renderer falls back inline
  if (!database.designId) {
    return null;
  }

  // Look up the database's design; bail if it no longer exists
  const design = Designs.get(database.designId, false);

  if (!design) {
    return null;
  }

  // The base layout type the context's layouts are drawn from
  const baseType = layoutContextBaseType[context];

  // If a default is pinned, return it when present in the design and of the base type
  const pinnedId = database.defaultLayouts[context];

  if (pinnedId) {
    const pinned = design.layouts.find((layout) => layout.id === pinnedId);

    if (pinned && pinned.type === baseType) {
      return pinned;
    }
  }

  // Fall back to the first layout of the base type in the design
  return design.layouts.find((layout) => layout.type === baseType) || null;
}
