import { Design, Designs } from '@minddrop/designs';
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
  let design: Design | null = null;

  // Check if the database has a default design for the specified type
  if (database.defaultDesigns[type]) {
    design = Designs.get(database.defaultDesigns[type], false);

    // Ensure the design is of the specified type
    if (design && design.type === type) {
      return design;
    }
  }

  // If no default design is specified, check if the database has a design
  // property map for the specified design type and use the first match.
  for (const designId of Object.keys(database.designPropertyMaps)) {
    const mappedDesign = Designs.get(designId, false);

    if (mappedDesign && mappedDesign.type === type) {
      design = mappedDesign;
      break;
    }
  }

  if (design) {
    return design;
  }

  // If the database has no configured design of the specified type,
  // return the default design for that type.
  return Designs.get(type);
}
