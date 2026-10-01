import { resolveEntryPropertyFiles } from '../resolveEntryPropertyFiles';

/**
 * Returns the paths of the files owned by an entry's file-based
 * properties. Properties without a file value are skipped.
 *
 * @param entryId - The ID of the entry.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The entry's property file paths.
 */
export function resolveEntryPropertyFilePaths(
  entryId: string,
  workspacePath?: string,
): string[] {
  // Resolve the entry's property files and return their paths
  return resolveEntryPropertyFiles(entryId, { workspacePath }).map(
    (file) => file.path,
  );
}
