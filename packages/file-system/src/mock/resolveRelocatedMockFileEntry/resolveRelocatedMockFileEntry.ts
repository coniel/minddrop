import { fileNameFromPath } from '../../fileNameFromPath';
import { FsEntry } from '../../types';

/**
 * Resolves a copy of a mock file entry moved to a new path, with the
 * paths of its descendants moved along with it.
 *
 * @param entry - The file entry to move.
 * @param path - The path to move the file entry to.
 * @returns The moved file entry.
 */
export function resolveRelocatedMockFileEntry(
  entry: FsEntry,
  path: string,
): FsEntry {
  // Move the entry, then each descendant to the same place below it
  return {
    ...entry,
    path,
    name: fileNameFromPath(path),
    children: entry.children?.map((child) =>
      resolveRelocatedMockFileEntry(
        child,
        `${path}${child.path.slice(entry.path.length)}`,
      ),
    ),
  };
}
