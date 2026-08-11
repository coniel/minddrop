import { Fs, FsEntry } from '@minddrop/file-system';
import { FilePropertySupportedFileExtensions } from '@minddrop/properties';

/**
 * Lists the image files in a media directory, newest first. Media
 * file names are timestamp prefixed, so sorting by name descending
 * orders them by creation time.
 *
 * @param mediaDirPath - The path to the media directory, or null.
 * @returns The image file entries, newest first.
 */
export async function listMediaImages(
  mediaDirPath: string | null,
): Promise<FsEntry[]> {
  // Nothing to list without a media directory
  if (!mediaDirPath || !(await Fs.exists(mediaDirPath))) {
    return [];
  }

  const entries = await Fs.readDir(mediaDirPath);

  // Keep image files only, newest first
  return entries
    .filter((entry) => isImageFile(entry.name))
    .sort((a, b) => (b.name ?? '').localeCompare(a.name ?? ''));
}

/**
 * Checks whether a file name has a supported image extension.
 *
 * @param fileName - The file name to check.
 * @returns Whether the file is an image file.
 */
function isImageFile(fileName?: string): boolean {
  if (!fileName) {
    return false;
  }

  const extension = fileName.split('.').pop()?.toLowerCase();

  if (!extension) {
    return false;
  }

  return FilePropertySupportedFileExtensions.image.includes(extension);
}
