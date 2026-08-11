import { Fs } from '@minddrop/file-system';
import { generateMediaFileName } from '../utils';

/**
 * Copies a file into a media directory under a generated media file
 * name, creating the directory if it does not exist.
 *
 * @param mediaDirPath - The path to the media directory.
 * @param sourcePath - The absolute path to the source file.
 * @returns The generated file name.
 */
export async function addMediaFile(
  mediaDirPath: string,
  sourcePath: string,
): Promise<string> {
  // Ensure the media directory exists
  await Fs.ensureDir(mediaDirPath);

  // Generate the media file name from the source file's extension
  const fileName = generateMediaFileName(sourcePath);

  // Copy the file into the media directory
  await Fs.copyFile(sourcePath, Fs.concatPath(mediaDirPath, fileName));

  return fileName;
}
