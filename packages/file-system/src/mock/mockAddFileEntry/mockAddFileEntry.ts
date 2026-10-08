import { fileNameFromPath } from '../../fileNameFromPath';
import { parentDirPath } from '../../parentDirPath';
import { FsEntry, MockFileSystemOptions } from '../../types';
import { mockExists } from '../mockExists';
import { mockGetFileEntry } from '../mockGetFileEntry';
import { resolveRelocatedMockFileEntry } from '../resolveRelocatedMockFileEntry';

/**
 * Adds a file entry into the file system. The entry's path is placed
 * below its parent directory's path as stored, whatever the case
 * in which the parent was given.
 *
 * @param root - The file system root file entry.
 * @param fileEntry - The file entry to add.
 * @param options - The mock file system's matching options.
 *
 * @throws {Error} If the path already exists.
 * @throws {Error} If the parent directory does not exist.
 * @throws {Error} If the parent path is not a directory.
 */
export function mockAddFileEntry(
  root: FsEntry,
  fileEntry: FsEntry,
  options: MockFileSystemOptions,
): void {
  // Get the parent directory's path
  const parentDir = parentDirPath(fileEntry.path);

  // Ensure the new path does not already exist
  if (mockExists(root, fileEntry.path, options)) {
    throw new Error(
      `Mock FS error: cannot add file entry "${fileEntry.path}", path already exists`,
    );
  }

  // Add an entry with no parent to the root
  if (!parentDir) {
    root.children?.push(fileEntry);

    return;
  }

  // Get the parent directory as stored
  const parentEntry = mockGetFileEntry(root, parentDir, options);

  // Ensure the parent is a directory
  if (!parentEntry.children) {
    throw new Error(
      `Mock FS error: cannot add file entry "${fileEntry.path}", parent path is not a dir`,
    );
  }

  // Resolve the entry's path below the parent's stored path
  const storedPath = `${parentEntry.path}/${fileNameFromPath(fileEntry.path)}`;

  // Add the entry. Move it below the parent's stored path if the parent
  // was given in another case or normalisation form.
  parentEntry.children.push(
    storedPath === fileEntry.path
      ? fileEntry
      : resolveRelocatedMockFileEntry(fileEntry, storedPath),
  );
}
