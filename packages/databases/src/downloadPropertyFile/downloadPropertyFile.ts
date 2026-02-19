import { Fs } from '@minddrop/file-system';
import { getFileExtensionFromUrl, titleFromUrl } from '@minddrop/utils';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { getIncrmentalPropertyFilePath } from '../utils';

/**
 * Downloads an asset from a URL and saves it to the specified entry's assets
 * directory. Replaces any existing asset with the same name.
 *
 * @param entryId - The ID of the entry to download the asset for.
 * @param propertyName - The name of the property to download the asset for.
 * @param url - The URL of the asset to download.
 *
 * @returns A promise that resolves to the downloaded asset's file name or false
 *          if the download failed.
 */
export async function downloadPropertyFile(
  entryId: string,
  propertyName: string,
  url: string,
): Promise<string | false> {
  // Get the entry
  const entry = getDatabaseEntry(entryId);

  const fileTitle = titleFromUrl(url);
  const fileExtension = getFileExtensionFromUrl(url);
  const fileName = fileExtension ? `${fileTitle}.${fileExtension}` : fileTitle;

  const { path } = await getIncrmentalPropertyFilePath(
    entryId,
    propertyName,
    fileName,
  );

  try {
    await Fs.downloadFile(url, path);
  } catch (error) {
    console.error(error);
    return false;
  }

  return fileName;
}
