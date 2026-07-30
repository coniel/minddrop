import { Fs } from '@minddrop/file-system';
import { uuid } from '@minddrop/utils';
import { getPlaceholderMediaDirPath } from '../utils';

/**
 * Writes a file into the placeholder-media directory using a
 * timestamp-prefixed UUID as the file name, deriving the extension
 * from the File's name. The timestamp prefix ensures files sort
 * newest-first by name.
 *
 * @param file - The file to write.
 * @returns The generated file name (timestamp-UUID + extension).
 */
export async function writeDesignPlaceholderMedia(file: File): Promise<string> {
  const mediaDir = getPlaceholderMediaDirPath();

  // Ensure the placeholder-media directory exists
  await Fs.ensureDir(mediaDir);

  // Generate a timestamp-prefixed UUID file name, preserving the
  // original extension
  const timestamp = Date.now();
  const baseName = `${timestamp}-${uuid()}`;
  const extension = Fs.getExtension(file.name);
  const fileName = extension
    ? Fs.addFileExtension(baseName, extension)
    : baseName;

  // Write the file into the placeholder-media directory
  const destinationPath = Fs.concatPath(mediaDir, fileName);
  await Fs.writeBinaryFile(destinationPath, file);

  return fileName;
}
