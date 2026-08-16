import { resolveSpacesDirPath } from '../resolveSpacesDirPath';

export interface ParsedSpaceBundlePath {
  /**
   * The ID of the space whose bundle the path belongs to.
   */
  id: string;

  /**
   * The path relative to the space's bundle directory. Empty when
   * the path is the bundle directory itself.
   */
  bundlePath: string;
}

/**
 * Returns the space and bundle relative path the given path belongs
 * to, or null if it is not inside the spaces directory. Space bundle
 * directories are named by their space's ID.
 *
 * @param path - The path to parse.
 * @returns The parsed path or null if it is not inside a space bundle.
 */
export function parseSpaceBundlePath(
  path: string,
): ParsedSpaceBundlePath | null {
  const spacesDirPath = `${resolveSpacesDirPath()}/`;

  if (!path.startsWith(spacesDirPath)) {
    return null;
  }

  const [id, ...bundlePathParts] = path.slice(spacesDirPath.length).split('/');

  return { id, bundlePath: bundlePathParts.join('/') };
}
