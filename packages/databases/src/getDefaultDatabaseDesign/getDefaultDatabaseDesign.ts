import { Design, DesignType, Designs } from '@minddrop/designs-next';
import { getDatabase } from '../getDatabase';
import { LayoutContext, layoutContextBaseType } from '../layoutContexts';

/**
 * Returns the design a database renders entries with in the given
 * display context. Resolves in order: the design pinned in
 * `defaultDesigns` for the context (if still owned by the database
 * and of the context's base type) → the database's first design of
 * the context's base type → null.
 *
 * @param databaseId - The ID of the database.
 * @param context - The layout context.
 * @returns The resolved design, or null if the database has no design
 *   of the context's base type.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 */
export function getDefaultDatabaseDesign(
  databaseId: string,
  context: LayoutContext,
): Design | null {
  // Get the database
  const database = getDatabase(databaseId);

  // The design type the context's designs are drawn from
  const baseType: DesignType = layoutContextBaseType[context];

  // The database's own designs
  const ownedDesigns = Designs.getByOwner(databaseId);

  // If a default is pinned, return it when still owned and of the base type
  const pinnedId = database.defaultDesigns?.[context];

  if (pinnedId) {
    const pinned = ownedDesigns.find((design) => design.id === pinnedId);

    if (pinned && pinned.type === baseType) {
      return pinned;
    }
  }

  // Fall back to the first design of the base type
  return ownedDesigns.find((design) => design.type === baseType) || null;
}
