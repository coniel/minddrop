import { resolveDesignsDirPath } from '../resolveDesignsDirPath';

export interface ParsedDesignBundlePath {
  /**
   * The ID of the design whose bundle the path belongs to.
   */
  id: string;

  /**
   * The path relative to the design's bundle directory. Empty when
   * the path is the bundle directory itself.
   */
  bundlePath: string;
}

/**
 * Returns the design and bundle relative path the given path belongs
 * to, or null if it is not inside the designs directory. Design
 * bundle directories are named by their design's ID.
 *
 * @param path - The path to parse.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The parsed path or null if it is not inside a design bundle.
 */
export function parseDesignBundlePath(
  path: string,
  workspacePath?: string,
): ParsedDesignBundlePath | null {
  const designsDirPath = `${resolveDesignsDirPath(workspacePath)}/`;

  if (!path.startsWith(designsDirPath)) {
    return null;
  }

  const [id, ...bundlePathParts] = path.slice(designsDirPath.length).split('/');

  return { id, bundlePath: bundlePathParts.join('/') };
}
