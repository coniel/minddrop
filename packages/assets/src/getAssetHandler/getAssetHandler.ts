import { AssetHandlersStore } from '../AssetHandlersStore';
import { AssetHandler } from '../types';

/**
 * Returns the asset handler that matches the given resource ID.
 *
 * @param resourceId - The ID of the resource to which the asset belongs.
 * @returns An asset handler or `null` if no handler matched the resource.
 */
export function getAssetHandler(resourceId: string): AssetHandler | null {
  let handler: AssetHandler | null = null;

  // Loop through all asset handlers until one matches the resource
  AssetHandlersStore.some((assetHandler) => {
    if (assetHandler.getResourceAssetsPath(resourceId)) {
      handler = assetHandler;

      return true;
    }

    return false;
  });

  return handler;
}
