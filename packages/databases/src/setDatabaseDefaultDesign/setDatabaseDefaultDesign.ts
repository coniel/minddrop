import { DesignNotFoundError, Designs } from '@minddrop/designs-next';
import { InvalidParameterError } from '@minddrop/utils';
import { getDatabase } from '../getDatabase';
import { LayoutContext, layoutContextBaseType } from '../layoutContexts';
import { Database } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Pins a design as the database's default for a display context, or
 * clears the context's pin.
 *
 * @param databaseId - The ID of the database.
 * @param context - The layout context to pin the default for.
 * @param designId - The ID of the design to pin, or null to unpin.
 * @returns The updated database.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 * @throws {DesignNotFoundError} If the design is not owned by the database.
 * @throws {InvalidParameterError} If the design is not of the context's base type.
 */
export async function setDatabaseDefaultDesign(
  databaseId: string,
  context: LayoutContext,
  designId: string | null,
): Promise<Database> {
  // Get the database
  const database = getDatabase(databaseId);

  // Drop the context's pin when unpinning
  if (designId === null) {
    const { [context]: _unpinned, ...defaultDesigns } =
      database.defaultDesigns ?? {};

    return updateDatabase(databaseId, { defaultDesigns });
  }

  // Look up the design among the database's own designs
  const design = Designs.getByOwner(databaseId).find(
    (ownedDesign) => ownedDesign.id === designId,
  );

  // Ensure the design exists
  if (!design) {
    throw new DesignNotFoundError(designId);
  }

  // Ensure the design is of the context's base type
  if (design.type !== layoutContextBaseType[context]) {
    throw new InvalidParameterError(
      `Design ${designId} is not a ${layoutContextBaseType[context]} design`,
    );
  }

  // Pin the design as the default for the context
  return updateDatabase(databaseId, {
    defaultDesigns: {
      ...database.defaultDesigns,
      [context]: designId,
    },
  });
}
