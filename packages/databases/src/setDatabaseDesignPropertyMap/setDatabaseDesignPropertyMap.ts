import { Designs } from '@minddrop/designs';
import { getDatabase } from '../getDatabase';
import { Database, DesignPropertyMap } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Sets a design property map for a database. If the design is
 * the only one of its type mapped to the database, it is
 * automatically set as the default for that type.
 *
 * @param databaseId - The ID of the database.
 * @param designId - The ID of the design.
 * @param propertyMap - The design property map.
 * @returns The updated database.
 */
export async function setDatabaseDesignPropertyMap(
  databaseId: string,
  designId: string,
  propertyMap: DesignPropertyMap,
): Promise<Database> {
  // Get the database
  const database = getDatabase(databaseId);

  // Build the updated design property maps
  const updatedMaps = {
    ...database.designPropertyMaps,
    [designId]: propertyMap,
  };

  // Check if this design is the only one of its type in the
  // updated maps. If so, set it as the default for that type.
  const design = Designs.get(designId, false);
  let defaultDesigns = database.defaultDesigns;

  if (design) {
    const sameTypeMappedIds = Object.keys(updatedMaps).filter((mappedId) => {
      const mappedDesign = Designs.get(mappedId, false);

      return mappedDesign && mappedDesign.type === design.type;
    });

    if (sameTypeMappedIds.length === 1) {
      defaultDesigns = { ...defaultDesigns, [design.type]: designId };
    }
  }

  // Update the database
  return updateDatabase(databaseId, {
    designPropertyMaps: updatedMaps,
    defaultDesigns,
  });
}
