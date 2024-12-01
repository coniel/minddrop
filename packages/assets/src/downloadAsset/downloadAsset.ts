import { Fs } from '@minddrop/file-system';
import { AssetHandlersStore } from '../AssetHandlersStore';
import { AssetResourceNotMatchedError } from '../errors';
import { AssetHandler } from '../types';

/**
 * Downloads an asset from a given URL and saves it to the appropriate assets directory.
 *
 * Returns the path to the downloaded asset.
 *
 * @param resourceId - The ID of the resource to which the asset belongs.
 * @param filename - The name of the file to save the asset as.
 * @param url - The URL to download the asset from.
 * @returns The path to the downloaded asset.
 *
 * @throws {AssetResourceNotMatchedError} If no asset handler matched the given resource ID.
 */
export async function downloadAsset(
  resourceId: string,
  filename: string,
  url: string,
): Promise<string> {
  let handler: AssetHandler | null = null;

  // Loop through all asset handlers until one matches the resource
  AssetHandlersStore.some((assetHandler) => {
    if (assetHandler.getResourceAssetsPath(resourceId)) {
      handler = assetHandler;

      return true;
    }

    return false;
  });

  // If no handler was found, throw an error
  if (!handler) {
    throw new AssetResourceNotMatchedError(resourceId);
  }

  // Ensure the asset directory exists
  const assetsPath = await (handler as AssetHandler).ensureResourceAssetsPath(
    resourceId,
  );
  const assetFilePath = `${assetsPath}/${filename}`;

  // Download the asset to the resource assets directory
  await Fs.downloadFile(url, assetFilePath);

  return assetFilePath;
}
