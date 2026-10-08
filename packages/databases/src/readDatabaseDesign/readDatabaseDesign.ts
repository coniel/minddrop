import { Design, Designs } from '@minddrop/designs-next';
import { Fs } from '@minddrop/file-system';
import { DatabaseFileReadResult, DatabaseId } from '../types';

/**
 * Reads a database-owned design from its file, with the database
 * attached as its owner.
 *
 * @param path - The path to the design file.
 * @param databaseId - The ID of the database owning the design.
 * @returns The design, or whether its file is missing or cannot be read.
 */
export async function readDatabaseDesign(
  path: string,
  databaseId: DatabaseId,
): Promise<DatabaseFileReadResult<Design>> {
  // Check the design file exists
  if (!(await Fs.exists(path))) {
    return { status: 'missing' };
  }

  // Read and validate the design file
  const design = await Designs.read(path);

  // Report an existing file which is not a valid design as unreadable
  if (!design) {
    return { status: 'unreadable' };
  }

  // Attach the database as the design's owner
  return { status: 'read', value: { ...design, owner: databaseId } };
}
