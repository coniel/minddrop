import { Design, Designs } from '@minddrop/designs-next';
import { Fs } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { getDatabase } from '../getDatabase';
import {
  resolveDatabaseDesignFilePath,
  resolveDatabaseDesignsDirPath,
} from '../utils';

/**
 * Writes a database-owned design to its file in the database's
 * designs directory.
 *
 * @param design - The design to write.
 *
 * @throws {InvalidParameterError} If the design has no owner.
 * @throws {DatabaseNotFoundError} If the owning database does not exist.
 */
export async function writeDatabaseDesign(design: Design): Promise<void> {
  // Designs without an owner are not database designs
  if (!design.owner) {
    throw new InvalidParameterError(
      `Cannot write design '${design.id}' as a database design without an owner`,
    );
  }

  // Get the owning database
  const database = getDatabase(design.owner);

  // Ensure the database's designs directory exists
  await Fs.ensureDir(resolveDatabaseDesignsDirPath(database.path));

  // Write the design to the file system in its stored form
  await Fs.writeJsonFile(
    resolveDatabaseDesignFilePath(database.path, design.id),
    Designs.serialize(design),
  );
}
