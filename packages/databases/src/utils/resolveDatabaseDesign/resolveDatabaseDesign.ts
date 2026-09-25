import { Design, DesignType, Designs } from '@minddrop/designs-next';
import { getDatabase } from '../../getDatabase';
import { LayoutContext, layoutContextBaseType } from '../../layoutContexts';

/**
 * Resolves the design a database renders entries with in the given
 * display context. Returns the given design when the database owns it
 * and it is of the context's base type. Otherwise returns the design
 * pinned as the context's default, on the same conditions, else the
 * database's first design of the base type.
 *
 * @param databaseId - The ID of the database.
 * @param context - The layout context.
 * @param designId - The ID of the design to render with in place of the database default.
 * @returns The resolved design, or null if the database has no design
 *   of the context's base type.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 */
export function resolveDatabaseDesign(
  databaseId: string,
  context: LayoutContext,
  designId?: string,
): Design | null {
  // Get the database
  const database = getDatabase(databaseId);

  // The base design type of the context
  const baseType: DesignType = layoutContextBaseType[context];

  // The database's own designs
  const ownedDesigns = Designs.getByOwner(databaseId);

  // Check the given design, then the pinned default. Return the first
  // one the database owns which is of the base type.
  for (const preferredId of [designId, database.defaultDesigns?.[context]]) {
    const preferred = ownedDesigns.find((design) => design.id === preferredId);

    if (preferred && preferred.type === baseType) {
      return preferred;
    }
  }

  // Fall back to the first design of the base type
  return ownedDesigns.find((design) => design.type === baseType) || null;
}
