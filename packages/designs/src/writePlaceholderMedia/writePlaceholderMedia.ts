import { Fs } from '@minddrop/file-system';
import { uuid } from '@minddrop/utils';
import { getPlaceholderMediaDirPath } from '../utils';

/**
 * Writes a file into the placeholder-media directory using a
 * UUID as the file name.
 *
 * @param file - The file content as a Blob.
 * @param extension - The file extension (without the dot), e.g. "png".
 * @returns The generated file name (UUID + extension).
 */
export async function writeDesignPlaceholderMedia(
  file: Blob,
  extension: string,
): Promise<string> {
  const mediaDir = getPlaceholderMediaDirPath();

  // Ensure the placeholder-media directory exists
  await Fs.ensureDir(mediaDir);

  // Generate a UUID file name with the given extension
  const fileName = extension ? Fs.addFileExtension(uuid(), extension) : uuid();

  // Write the file into the placeholder-media directory
  const destinationPath = Fs.concatPath(mediaDir, fileName);
  await Fs.writeBinaryFile(destinationPath, file);

  return fileName;
}
