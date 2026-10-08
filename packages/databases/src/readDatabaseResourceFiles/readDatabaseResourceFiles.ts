import { Fs } from '@minddrop/file-system';
import { DatabaseFileReadResult } from '../types';

export interface ReadDatabaseResourceFilesResult<TResource> {
  /**
   * The resources read from the directory's files.
   */
  resources: TResource[];

  /**
   * The IDs of the resources whose files exist but could not be read.
   */
  unreadableIds: string[];
}

/**
 * Reads a database's resources of one kind (views, designs or entry
 * templates), stored one per file or one per subdirectory in a
 * database directory. Each resource's ID is its file name, without
 * the extension.
 *
 * @param dirPath - The path to the directory holding the resources.
 * @param readResource - Reads the resource at a file or subdirectory path.
 * @param extension - The extension of the resource files, without the leading dot. Omit when each resource is a subdirectory.
 * @returns The resources read, and the IDs of those which could not be read. Both are empty if the directory does not exist.
 */
export async function readDatabaseResourceFiles<TResource>(
  dirPath: string,
  readResource: (path: string) => Promise<DatabaseFileReadResult<TResource>>,
  extension?: string,
): Promise<ReadDatabaseResourceFilesResult<TResource>> {
  // The resources read, and the IDs of the unreadable ones
  const result: ReadDatabaseResourceFilesResult<TResource> = {
    resources: [],
    unreadableIds: [],
  };

  // Check the directory exists. A database only has one once it
  // stores a resource there.
  if (!(await Fs.exists(dirPath))) {
    return result;
  }

  // List the directory's files and subdirectories
  const files = await Fs.readDir(dirPath);

  // Resolve each resource's ID from its path
  const resourcePaths = files.flatMap((file) => {
    // Resolve the ID from the file name, or from the subdirectory name
    // when resources are subdirectories.
    const id = extension
      ? Fs.resolveFileIdInDir(file.path, dirPath, extension)
      : Fs.fileNameFromPath(file.path);

    // Leave out files of another type
    return id ? [{ id, path: file.path }] : [];
  });

  // Read each resource
  const reads = await Promise.all(
    resourcePaths.map(async ({ id, path }) => ({
      id,
      read: await readResource(path),
    })),
  );

  // Sort the reads into resources and the IDs of unreadable ones. A
  // missing resource is one removed since the listing.
  reads.forEach(({ id, read }) => {
    if (read.status === 'read') {
      // Add the read resource
      result.resources.push(read.value);
    } else if (read.status === 'unreadable') {
      // Add the unreadable resource's ID
      result.unreadableIds.push(id);
    }
  });

  return result;
}
