import { Design } from '@minddrop/designs';
import { defaultDatabaseDesigns } from '../constants';
import { getDatabase } from '../getDatabase';

/**
 * Returns the default design for of the specified type for a database.
 *
 * @param databaseId - The ID of the database.
 * @param type - The design type.
 * @returns The default design for the specified database and type.
 */
export function getDefaultDatabaseDesign(
  databaseId: string,
  type: string,
): Design {
  // Get the database
  const database = getDatabase(databaseId);

  // Check if the database has a default design for the specified layout
  if (database.defaultDesigns[type]) {
    const design = database.designs.find(
      (design) => design.id === database.defaultDesigns[type],
    );

    // Ensure the design is of the specified type
    if (design && design.type === type) {
      return design;
    }
  }

  // If no default design is specified, return the first design
  // which is of the specified type.
  const design = database.designs.find((design) => design.type === type);

  if (design) {
    return design;
  }

  // If the database has no designs, use the default design for the
  // specified layout.
  const defaultDesign = defaultDatabaseDesigns[type];

  if (defaultDesign) {
    return defaultDesign;
  }

  // If no default design for the specified layout is found, return
  // the global default design.
  return defaultDatabaseDesigns.global;
}
