import { AssetHandlersStore } from '../AssetHandlersStore';

/**
 * Does something useful.
 */
export function getAssetPath(
  resourceId: string,
  filename: string | null,
): string | null {
  let assetsPath: string | null = null;

  if (!filename) {
    return null;
  }

  // Loop through all asset handlers until one matches the resource
  AssetHandlersStore.some((assetHandler) => {
    const result = assetHandler.getResourceAssetsPath(resourceId);

    if (result) {
      assetsPath = `${result}`;
    }

    return false;
  });

  // Add the filename to the asset path or return null if no path was found
  return assetsPath ? `${assetsPath}/${filename}` : null;
}
