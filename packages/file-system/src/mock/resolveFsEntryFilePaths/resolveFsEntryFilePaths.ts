import { FsEntry } from '../../types';

/**
 * Returns the paths of the files in a file tree, at every depth.
 * Directories are not included.
 *
 * @param entries - The file tree's top level entries.
 * @returns The paths of the files in the tree.
 */
export function resolveFsEntryFilePaths(entries: FsEntry[]): string[] {
  // Collect the file paths, recursing into directories
  return entries.flatMap((entry) =>
    entry.children ? resolveFsEntryFilePaths(entry.children) : [entry.path],
  );
}
