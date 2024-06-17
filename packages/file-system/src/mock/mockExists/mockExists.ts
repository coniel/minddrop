import { FsEntry } from '../../types';

/**
 * Checks whether a mock file entry exists by traversing
 * the mock file tree up to the requested file path.
 *
 * @param root - The root file entry.
 * @param path - The file path to check for.
 */
export function mockExists(root: FsEntry, path: string): boolean {
  const pathParts = path.split('/');
  let currentFileEntry = root;
  let currentPath = '';

  return pathParts.every((part) => {
    if (!currentFileEntry.children) {
      return false;
    }

    currentPath = `${currentPath}${part}`;

    const child = currentFileEntry.children.find(
      (entry) => entry.path === currentPath,
    );

    currentPath = `${currentPath}/`;

    if (child) {
      currentFileEntry = child;

      return true;
    }
  });
}
