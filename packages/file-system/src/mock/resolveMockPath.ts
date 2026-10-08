import { concatPath } from '../concatPath';
import { FsDirOptions, FsFileOptions } from '../types';

/**
 * Resolves the path under which the mock file system stores a path. The
 * path is prefixed with its base directory when one is given.
 *
 * @param path - The path, relative to the base directory if one is given.
 * @param options - Options with the path's base directory.
 * @returns The path as stored in the mock file system.
 */
export function resolveMockPath(
  path: string,
  options?: FsFileOptions | FsDirOptions,
): string {
  // Prefix the base directory, if given
  return options?.baseDir ? concatPath(options.baseDir, path) : path;
}
