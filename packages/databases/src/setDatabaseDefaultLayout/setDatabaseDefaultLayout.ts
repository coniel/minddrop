import { Designs, LayoutNotFoundError, LayoutType } from '@minddrop/designs';
import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Pins a layout as the database's default for its layout type.
 *
 * @param databaseId - The ID of the database.
 * @param type - The layout type to pin the default for.
 * @param layoutId - The ID of the layout to pin.
 * @returns The updated database.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 * @throws {LayoutNotFoundError} If the layout is not a layout of the given type in the database's design.
 */
export async function setDatabaseDefaultLayout(
  databaseId: string,
  type: LayoutType,
  layoutId: string,
): Promise<Database> {
  // Get the database
  const database = getDatabase(databaseId);

  // Look up the database's design
  const design = database.designId
    ? Designs.get(database.designId, false)
    : null;

  // Ensure the layout is a layout of the given type in the
  // database's design
  const layout = design?.layouts.find(
    (designLayout) => designLayout.id === layoutId,
  );

  if (!layout || layout.type !== type) {
    throw new LayoutNotFoundError(layoutId);
  }

  // Pin the layout as the default for its type
  return updateDatabase(databaseId, {
    defaultLayouts: {
      ...database.defaultLayouts,
      [type]: layoutId,
    },
  });
}
