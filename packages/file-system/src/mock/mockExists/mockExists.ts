import { FsEntry, MockFileSystemOptions } from '../../types';
import { resolveMockPathKey } from '../resolveMockPathKey';

/**
 * Checks whether a mock file entry exists at a path.
 *
 * @param root - The root file entry.
 * @param path - The file path to check for.
 * @param options - The mock file system's matching options.
 * @returns Whether the file entry exists.
 */
export function mockExists(
  root: FsEntry,
  path: string,
  options: MockFileSystemOptions,
): boolean {
  // Split the path into the parts to traverse
  const pathParts = path.split('/');
  // Entry reached so far
  let currentFileEntry = root;
  // Path reached so far
  let currentPath = '';

  // Check each part exists in the entry above it
  return pathParts.every((part) => {
    // Fail if the entry above has no children
    if (!currentFileEntry.children) {
      return false;
    }

    // Extend the path by the part
    currentPath = `${currentPath}${part}`;

    // Resolve the path's key
    const key = resolveMockPathKey(currentPath, options);
    // Find the child at the path
    const child = currentFileEntry.children.find(
      (entry) => resolveMockPathKey(entry.path, options) === key,
    );

    // Add the separator for the next part
    currentPath = `${currentPath}/`;

    // Continue from the child, if found
    if (child) {
      currentFileEntry = child;

      return true;
    }
  });
}
