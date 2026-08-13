import { Designs, LayoutNotFoundError } from '@minddrop/designs-legacy';
import { getDatabase } from '../getDatabase';
import { LayoutContext, layoutContextBaseType } from '../layoutContexts';
import { Database } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Pins a layout as the database's default for a display context.
 *
 * @param databaseId - The ID of the database.
 * @param context - The layout context to pin the default for.
 * @param layoutId - The ID of the layout to pin.
 * @returns The updated database.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 * @throws {LayoutNotFoundError} If the layout is not a layout of the context's base type in the database's design.
 */
export async function setDatabaseDefaultLayout(
  databaseId: string,
  context: LayoutContext,
  layoutId: string,
): Promise<Database> {
  // Get the database
  const database = getDatabase(databaseId);

  // Look up the database's design
  const design = database.designId
    ? Designs.get(database.designId, false)
    : null;

  // Ensure the layout is a layout of the context's base type in
  // the database's design
  const layout = design?.layouts.find(
    (designLayout) => designLayout.id === layoutId,
  );

  if (!layout || layout.type !== layoutContextBaseType[context]) {
    throw new LayoutNotFoundError(layoutId);
  }

  // Pin the layout as the default for the context
  return updateDatabase(databaseId, {
    defaultLayouts: {
      ...database.defaultLayouts,
      [context]: layoutId,
    },
  });
}
