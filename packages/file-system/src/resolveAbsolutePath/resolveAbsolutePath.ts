import { Fs } from '../FileSystem';
import { concatPath } from '../concatPath';
import { BaseDirectory } from '../types';

/**
 * Resolves the absolute path of a path within a base directory.
 *
 * @param path - The path, relative to the base directory if one is given.
 * @param baseDir - The base directory the path is in, if any.
 * @returns The absolute path, or null while the base directory's path has not resolved yet.
 */
export function resolveAbsolutePath(
  path: string,
  baseDir?: BaseDirectory,
): string | null {
  // Use a path outside a base directory as it is. It is already
  // absolute.
  if (!baseDir) {
    return path;
  }

  // Get the base directory's path
  const baseDirPath = Fs.resolveBaseDirPath(baseDir);

  // Check the base directory's path has resolved. Base directory paths
  // resolve once the adapter is registered.
  if (!baseDirPath) {
    return null;
  }

  // Join the path onto the base directory's path
  return concatPath(baseDirPath, path);
}
