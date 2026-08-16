import { Fs } from '@minddrop/file-system';

/**
 * Derives the name of an entry's metadata sidecar, minus its
 * extension.
 *
 * Entry titles double as file names and are unique within a
 * database, so the entry's file name identifies it whether the
 * database stores entries flat or in per-entry subdirectories.
 *
 * @param entryPath - The absolute path of the entry file.
 * @returns The sidecar name.
 */
export function entryMetadataKey(entryPath: string): string {
  return Fs.removeExtension(Fs.fileNameFromPath(entryPath));
}
