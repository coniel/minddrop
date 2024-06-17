import { fileNameFromPath } from '../../fileNameFromPath';
import { FsEntry } from '../../types';
import { mockAddFileEntry } from '../mockAddFileEntry';
import { mockGetFileEntry } from '../mockGetFileEntry';
import { mockRemoveFileEntry } from '../mockRemoveFileEntry';

/**
 * Renames a file entry and updates the paths of its descendants
 * if it has any.
 *
 * @param root - The mock file system root.
 * @param oldPath - The path of the file entry to rename.
 * @param newPath - The new file entry path.
 */
export function mockRenameFile(
  root: FsEntry,
  oldPath: string,
  newPath: string,
): void {
  const file = mockGetFileEntry(root, oldPath);

  mockRemoveFileEntry(root, oldPath);

  mockAddFileEntry(root, {
    ...file,
    path: newPath,
    name: fileNameFromPath(newPath),
    children: file.children?.map((child) =>
      renameDescendant(child, oldPath, newPath),
    ),
  });
}

function renameDescendant(
  descendant: FsEntry,
  oldBasePath: string,
  newBasePath: string,
): FsEntry {
  return {
    ...descendant,
    path: descendant.path.replace(oldBasePath, newBasePath),
    children: descendant.children?.map((child) =>
      renameDescendant(child, oldBasePath, newBasePath),
    ),
  };
}
