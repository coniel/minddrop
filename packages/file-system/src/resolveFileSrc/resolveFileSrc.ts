import { Paths } from '@minddrop/utils';

/**
 * Resolves the `src` a file on the file system is served at, or null
 * without a path.
 *
 * @param path - The path to the file.
 * @returns The src of the file, or null.
 */
export function resolveFileSrc(path: string | null): string | null {
  if (!path) {
    return null;
  }

  // Build the file server URL for the path
  return `${Paths.httpServerHost}/files?path=${encodeURIComponent(path)}`;
}
