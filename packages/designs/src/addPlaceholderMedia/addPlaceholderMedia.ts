import { Fs } from '@minddrop/file-system';
import { uuid } from '@minddrop/utils';
import { getPlaceholderMediaDirPath } from '../utils';

/**
 * Copies a file into the placeholder-media directory using a
 * timestamp-prefixed UUID as the file name, preserving the
 * original file extension. The timestamp prefix ensures files
 * sort newest-first by name.
 *
 * @param sourcePath - The absolute path to the source file.
 * @returns The generated file name (timestamp-UUID + extension).
 */
export async function addDesignPlaceholderMedia(
  sourcePath: string,
): Promise<string> {
  const mediaDir = getPlaceholderMediaDirPath();

  // Ensure the placeholder-media directory exists
  await Fs.ensureDir(mediaDir);

  // Generate a timestamp-prefixed UUID file name, preserving the
  // original extension
  const timestamp = Date.now();
  const baseName = `${timestamp}-${uuid()}`;
  const extension = Fs.getExtension(sourcePath);
  const fileName = extension
    ? Fs.addFileExtension(baseName, extension)
    : baseName;

  // Copy the file into the placeholder-media directory
  const destinationPath = Fs.concatPath(mediaDir, fileName);
  await Fs.copyFile(sourcePath, destinationPath);

  return fileName;
}
