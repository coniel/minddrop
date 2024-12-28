import { Fs } from '@minddrop/file-system';
import { getResourceAssetsPath } from '../getResourceAssetsPath';

/**
 * Checks if an assets directory exists for the given resource ID.
 *
 * @param resourceId - The ID of the resource to check for assets.
 * @returns A boolean indicating whether the resource has assets.
 */
export async function resourceHasAssets(resourceId: string): Promise<boolean> {
  const path = getResourceAssetsPath(resourceId);

  if (!path) {
    return false;
  }

  return Fs.exists(path);
}
