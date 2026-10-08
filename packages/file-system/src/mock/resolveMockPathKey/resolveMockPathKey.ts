import { MockFileSystemOptions } from '../../types';

/**
 * Resolves the key under which the mock file system matches a path.
 * Paths differing only in case or Unicode normalisation form share a
 * key, unless the file system is case-sensitive.
 *
 * @param path - The path to resolve the key of.
 * @param options - The mock file system's matching options.
 * @returns The path's key.
 */
export function resolveMockPathKey(
  path: string,
  options: MockFileSystemOptions,
): string {
  // Match paths exactly on a case-sensitive file system
  if (options.caseSensitive) {
    return path;
  }

  // Fold the case and Unicode normalisation form of each segment
  return path
    .split('/')
    .map((segment) => segment.toLowerCase().normalize('NFC'))
    .join('/');
}
