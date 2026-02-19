import { Design } from '@minddrop/designs';
import { i18n } from '@minddrop/i18n';
import { defaultDatabaseDesigns } from '../constants';
import { getDatabase } from '../getDatabase';
import { DatabaseDesignType } from '../types';

/**
 * Returns the default design for the specified database and design type.
 *
 * @param databaseId - The ID of the database.
 * @param type - The design type.
 * @returns The default design for the specified database and type.
 */
export function getDefaultDatabaseDesign(
  databaseId: string,
  type: DatabaseDesignType,
): Design {
  // Get the database
  const database = getDatabase(databaseId);

  // Check if the database has a default design for the specified type
  if (database.defaultDesigns[type]) {
    const design = database.designs.find(
      (design) => design.id === database.defaultDesigns[type],
    );

    // Ensure the design is of the specified type
    if (design && design.type === type) {
      return design;
    }
  }

  // Chck if the database has a design for the specified type
  const design = database.designs.find((design) => design.type === type);

  if (design) {
    return design;
  }

  // If the database does not specify a default design for the type,
  // return the global default design.
  return {
    ...defaultDatabaseDesigns[type],
    name: i18n.t(defaultDatabaseDesigns[type].name),
  };
}
