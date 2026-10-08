import { resolveFsEntryFilePaths } from '../../mock/resolveFsEntryFilePaths';
import { MockFileSystem } from '../../types';

/**
 * Returns the text contents of every file in a mock file system,
 * keyed by path. Files without text contents map to an empty string.
 *
 * @param mockFileSystem - The mock file system to snapshot.
 * @returns The file contents, keyed by path.
 */
export function snapshotMockFiles(
  mockFileSystem: MockFileSystem,
): Record<string, string> {
  // Read the text contents of every file
  return Object.fromEntries(
    resolveFsEntryFilePaths(mockFileSystem.getFiles()).map((path) => [
      path,
      mockFileSystem.readTextFile(path),
    ]),
  );
}
