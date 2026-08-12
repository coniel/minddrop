import { Fs } from '@minddrop/file-system';
import { getFileExtensionFromUrl, titleFromUrl } from '@minddrop/utils';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { getIncrementalPropertyFilePath } from '../utils';

/**
 * Downloads a file from a URL and saves it as the specified entry property's
 * file, stored according to the database's property file storage mode.
 *
 * @param entryId - The ID of the entry to download the file for.
 * @param propertyName - The name of the property to download the file for.
 * @param url - The URL of the file to download.
 *
 * @returns A promise that resolves to the downloaded file's name or false
 *          if the download failed.
 */
export async function downloadPropertyFile(
  entryId: string,
  propertyName: string,
  url: string,
): Promise<string | false> {
  // Ensure the entry exists, throwing if it does not
  getDatabaseEntry(entryId);

  const fileTitle = titleFromUrl(url);
  const fileExtension = getFileExtensionFromUrl(url);
  const fileName = fileExtension ? `${fileTitle}.${fileExtension}` : fileTitle;

  const { path } = await getIncrementalPropertyFilePath(
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
