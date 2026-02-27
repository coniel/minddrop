import { Fs } from '@minddrop/file-system';
import { uuid } from '@minddrop/utils';
import { getPlaceholderMediaDirPath } from '../utils';

/**
 * Copies a file into the placeholder-media directory using a
 * UUID as the file name, preserving the original file extension.
 *
 * @param sourcePath - The absolute path to the source file.
 * @returns The generated file name (UUID + extension).
 */
export async function addDesignPlaceholderMedia(sourcePath: string): Promise<string> {
  const mediaDir = getPlaceholderMediaDirPath();

  // Ensure the placeholder-media directory exists
  await Fs.ensureDir(mediaDir);

  // Generate a UUID file name, preserving the original extension
  const extension = Fs.getExtension(sourcePath);
  const fileName = extension ? Fs.addFileExtension(uuid(), extension) : uuid();

  // Copy the file into the placeholder-media directory
  const destinationPath = Fs.concatPath(mediaDir, fileName);
  await Fs.copyFile(sourcePath, destinationPath);

  return fileName;
}
