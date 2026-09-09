import { InvalidParameterError } from '@minddrop/utils';

/**
 * Strips a directory prefix from a path, returning the path as it is
 * addressed from within that directory.
 *
 * @param dirPath - The directory the path is relative to.
 * @param path - The path to strip the directory from.
 * @returns The path relative to the directory.
 *
 * @throws {InvalidParameterError} If the directory is empty, or the path is not inside it.
 */
export function relativePath(dirPath: string, path: string): string {
  const dir = trimTrailingSlash(dirPath);

  // Every absolute path starts with the separator, so an empty
  // directory would pass the check below and strip nothing but the
  // leading slash, turning an absolute path into a plausible looking
  // relative one. Reject it rather than invent a path.
  if (!dir) {
    throw new InvalidParameterError(
      `Cannot resolve '${path}' against an empty directory`,
    );
  }

  // The directory addresses itself as an empty path
  if (path === dir) {
    return '';
  }

  if (!path.startsWith(`${dir}/`)) {
    throw new InvalidParameterError(`'${path}' is not inside '${dirPath}'`);
  }

  return path.slice(dir.length + 1);
}

/**
 * Removes a path's trailing slash, if it has one.
 */
function trimTrailingSlash(path: string): string {
  return path.endsWith('/') ? path.slice(0, -1) : path;
}
