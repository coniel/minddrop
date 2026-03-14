import { Designs } from '@minddrop/designs';
import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Removes a design property map from a database. If the removed
 * design was the default for its type, another mapped design of
 * the same type is promoted to default.
 *
 * @param databaseId - The ID of the database.
 * @param designId - The ID of the design.
 * @returns The updated database.
 */
export function removeDatabaseDesignPropertyMap(
  databaseId: string,
  designId: string,
): Promise<Database> {
  // Get the database
  const database = getDatabase(databaseId);

  // Remove the target design property map
  const { [designId]: _, ...remainingPropertyMaps } =
    database.designPropertyMaps;

  // If the removed design was the default for its type, pick
  // another mapped design of the same type as the new default.
  const defaultDesigns = { ...database.defaultDesigns };
  const design = Designs.get(designId, false);

  if (design && defaultDesigns[design.type] === designId) {
    // Find another mapped design of the same type
    const replacement = Object.keys(remainingPropertyMaps).find((mappedId) => {
      const mappedDesign = Designs.get(mappedId, false);

      return mappedDesign && mappedDesign.type === design.type;
    });

    if (replacement) {
      defaultDesigns[design.type] = replacement;
    } else {
      delete defaultDesigns[design.type];
    }
  }

  // Update the database
  return updateDatabase(databaseId, {
    designPropertyMaps: remainingPropertyMaps,
    defaultDesigns,
  });
}
