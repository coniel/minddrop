import { Fs } from '@minddrop/file-system';
import { generateMediaFileName } from '../utils';

/**
 * Writes a file into a media directory under a generated media file
 * name, creating the directory if it does not exist.
 *
 * @param mediaDirPath - The path to the media directory.
 * @param file - The file to write.
 * @returns The generated file name.
 */
export async function writeMediaFile(
  mediaDirPath: string,
  file: File,
): Promise<string> {
  // Ensure the media directory exists
  await Fs.ensureDir(mediaDirPath);

  // Generate the media file name from the file's extension
  const fileName = generateMediaFileName(file.name);

  // Write the file into the media directory
  await Fs.writeBinaryFile(Fs.concatPath(mediaDirPath, fileName), file);

  return fileName;
}
