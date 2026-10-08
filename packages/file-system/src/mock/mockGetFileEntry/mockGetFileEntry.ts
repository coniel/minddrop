import { FsEntry, MockFileSystemOptions } from '../../types';
import { mockExists } from '../mockExists';
import { resolveMockPathKey } from '../resolveMockPathKey';

/**
 * Returns a file entry from the mock file system.
 *
 * @param root - The mock file system root entry.
 * @param path - The path of the file entry to get.
 * @param options - The mock file system's matching options.
 * @returns The file entry.
 *
 * @throws {Error} If the path does not exist.
 */
export function mockGetFileEntry(
  root: FsEntry,
  path: string,
  options: MockFileSystemOptions,
): FsEntry {
  // Ensure the path exists
  if (!mockExists(root, path, options)) {
    throw new Error(
      `Mock FS error: cannot get file entry ${path}, path does not exist`,
    );
  }

  // Split the path into the parts to traverse
  const pathParts = path.split('/');
  // Path reached so far
  let currentPath = '';
  // Entry reached so far
  let currentChild = root;

  // Step through the tree one part at a time
  pathParts.forEach((part) => {
    // Extend the path by the part
    currentPath = `${currentPath}${part}`;

    // Ensure the entry reached so far is a directory
    if (!currentChild.children) {
      throw new Error(
        `Mock FS error: cannot get file entry ${path}, ${currentChild.path} is not a dir`,
      );
    }

    // Resolve the path's key
    const key = resolveMockPathKey(currentPath, options);

    // Step into the child at the path
    currentChild =
      currentChild.children[
        currentChild.children.findIndex(
          (child) => resolveMockPathKey(child.path, options) === key,
        )
      ];

    // Add the separator for the next part
    currentPath = `${currentPath}/`;
  });

  return currentChild;
}
