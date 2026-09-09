import { Design } from '@minddrop/designs-next';
import { Fs } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { getDatabase } from '../getDatabase';
import { resolveDatabaseDesignFilePath, resolveDatabasePath } from '../utils';

/**
 * Deletes a database-owned design's file from the database's
 * designs directory.
 *
 * @param design - The design whose file to delete.
 *
 * @throws {InvalidParameterError} If the design has no owner.
 * @throws {DatabaseNotFoundError} If the owning database does not exist.
 */
export async function removeDatabaseDesignFile(design: Design): Promise<void> {
  // Designs without an owner are not database designs
  if (!design.owner) {
    throw new InvalidParameterError(
      `Cannot remove the design file of design '${design.id}' without an owner`,
    );
  }

  // Get the owning database
  const database = getDatabase(design.owner);

  // Path to the design's file
  const filePath = resolveDatabaseDesignFilePath(
    resolveDatabasePath(database),
    design.id,
  );

  // Delete the design file if it exists
  if (await Fs.exists(filePath)) {
    await Fs.removeFile(filePath);
  }
}
