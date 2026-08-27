import { Designs } from '@minddrop/designs';
import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Assigns a design to a database. When the design changes, clears the
 * `designPropertyMap` and `defaultLayouts` since they reference the
 * previous design's properties and layouts.
 *
 * @param databaseId - The ID of the database.
 * @param designId - The ID of the design to assign, or null to unassign.
 * @returns The updated database.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 * @throws {DesignNotFoundError} If a non-null designId points to a missing design.
 */
export async function setDatabaseDesign(
  databaseId: string,
  designId: string | null,
): Promise<Database> {
  // Get the database
  const database = getDatabase(databaseId);

  // No-op if the design assignment is unchanged
  if (database.designId === designId) {
    return database;
  }

  // Ensure the new design exists (throws if non-null and missing)
  if (designId !== null) {
    Designs.get(designId);
  }

  // Persist the new design assignment, clearing the property map and
  // layout pins as they reference the previous design
  return updateDatabase(databaseId, {
    designId,
    designPropertyMap: {},
    defaultLayouts: {},
  });
}
