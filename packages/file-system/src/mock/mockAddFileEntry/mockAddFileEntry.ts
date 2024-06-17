import { parentDirPath } from '../../parentDirPath';
import { FsEntry } from '../../types';
import { mockExists } from '../mockExists';

/**
 * Adds a file entry into the file system.
 *
 * @param root - The file system root file entry.
 * @param fileEntry - The file entry to add.
 */
export function mockAddFileEntry(root: FsEntry, fileEntry: FsEntry): void {
  const parentDir = parentDirPath(fileEntry.path);

  if (parentDir && !mockExists(root, parentDir)) {
    throw new Error(
      `Mock FS error: cannot add file entry "${fileEntry.path}", parent dir path does not exist`,
    );
  }

  // Ensure new path does not already exist
  if (mockExists(root, fileEntry.path)) {
    throw new Error(
      `Mock FS error: cannot add file entry "${fileEntry.path}", path already exists`,
    );
  }

  let currentPath = '';
  let currentEntry = root;

  // If file entry has no parent, add it to the root
  if (!parentDir) {
    root.children?.push(fileEntry);

    return;
  }

  parentDir.split('/').forEach((part) => {
    currentPath = `${currentPath}${part}`;

    currentEntry = currentEntry.children?.find(
      (child) => child.path === currentPath,
    ) as FsEntry;

    currentPath = `${currentPath}/`;
  });

  currentEntry.children?.push(fileEntry);
}
