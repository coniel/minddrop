import { AssetHandlersStore } from '../AssetHandlersStore';

/**
 * Returns the assets path for a given resource. If no asset handler matched
 * the resource, returns null.
 *
 * Note: This function does not check if the path exists, only where it can be
 * found if it does.
 *
 * @param resourceId - The ID of the resource to get the assets path for.
 * @returns The assets path for the resource or null if no asset handler matched
 */
export function getResourceAssetsPath(resourceId: string): string | null {
  let assetsPath: string | null = null;

  // Loop through all asset handlers until one matches the resource
  AssetHandlersStore.some((assetHandler) => {
    const result = assetHandler.getResourceAssetsPath(resourceId);

    if (result) {
      assetsPath = `${result}`;
    }

    return false;
  });

  return assetsPath;
}
