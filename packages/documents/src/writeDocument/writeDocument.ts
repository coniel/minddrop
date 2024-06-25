import { FileNotFoundError, Fs } from '@minddrop/file-system';

/**
 * Writes stringified document data to the document file.
 *
 * @param path - The path to the document file.
 * @param data - The stringified document data.
 *
 * @throws {FileNotFoundError} - If the document file does not exist.
 */
export async function writeDocument(path: string, data: string): Promise<void> {
  // Ensure that the document file exists
  if (!(await Fs.exists(path))) {
    throw new FileNotFoundError(path);
  }

  // Write the document content to the document file
  await Fs.writeTextFile(path, data);
}
