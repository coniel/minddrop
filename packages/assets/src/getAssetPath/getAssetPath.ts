import { getResourceAssetsPath } from '../getResourceAssetsPath';

/**
 * Returns the path to an asset file for a given resource ID.
 *
 * @param resourceId - The ID of the resource to which the asset belongs.
 * @param filename - The name of the asset file.
 * @returns The path to the asset file or null if no path was found.
 */
export function getAssetPath(
  resourceId: string,
  filename: string | null,
): string | null {
  if (!filename) {
    return null;
  }

  // Get the path to the assets directory for the given resource ID
  const assetsPath = getResourceAssetsPath(resourceId);

  // Add the filename to the asset path or return null if no path was found
  return assetsPath ? `${assetsPath}/${filename}` : null;
}
