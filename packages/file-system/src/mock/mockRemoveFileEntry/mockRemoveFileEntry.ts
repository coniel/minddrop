import { FileEntry } from '../../types';
import { mockExists } from '../mockExists';

/**
 * Removes a file entry from the mock file system.
 *
 * @param root - The mock file system root.
 * @param path - The path of the entry to remove.
 */
export function mockRemoveFileEntry(root: FileEntry, path: string): void {
  if (!mockExists(root, path)) {
    throw new Error(
      `Mock FS error: cannot remove file entry ${path}, path does not exist`,
    );
  }

  const pathParts = path.split('/');
  let currentPath = '';
  let currentChild = root;

  pathParts.forEach((part, index) => {
    currentPath = `${currentPath}${part}`;

    if (index === pathParts.length - 1) {
      if (!currentChild.children) {
        throw new Error(
          `Mock FS error: cannot remove file entry ${path}, ${currentChild.path} is not a dir`,
        );
      }

      currentChild.children = currentChild.children.filter(
        (child) => child.path !== currentPath,
      );

      return;
    }

    if (!currentChild.children) {
      throw new Error(
        `Mock FS error: cannot remove file entry ${path}, ${currentChild.path} is not a dir`,
      );
    }

    currentChild =
      currentChild.children[
        currentChild.children.findIndex((child) => child.path === currentPath)
      ];

    currentPath = `${currentPath}/`;
  });
}
