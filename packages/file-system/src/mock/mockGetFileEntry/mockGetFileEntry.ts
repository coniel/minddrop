import { FileEntry } from '../../types';
import { mockExists } from '../mockExists';

/**
 * Returns a file entry from the mock file system.
 *
 * @param root - The mock file system root entry.
 * @param path - The path of the file entry to get.
 */
export function mockGetFileEntry(root: FileEntry, path: string): FileEntry {
  if (!mockExists(root, path)) {
    throw new Error(
      `Mock FS error: cannot get file entry ${path}, path does not exist`,
    );
  }

  const pathParts = path.split('/');
  let currentPath = '';
  let currentChild = root;

  pathParts.forEach((part) => {
    currentPath = `${currentPath}${part}`;

    if (!currentChild.children) {
      throw new Error(
        `Mock FS error: cannot get file entry ${path}, ${currentChild.path} is not a dir`,
      );
    }

    currentChild =
      currentChild.children[
        currentChild.children.findIndex((child) => child.path === currentPath)
      ];

    currentPath = `${currentPath}/`;
  });

  return currentChild;
}
