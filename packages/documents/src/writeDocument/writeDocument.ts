import { FileNotFoundError, Fs } from '@minddrop/file-system';

/**
 * Writes a document's file content to the document markdown file.
 *
 * @param path - The path to the document file.
 * @param content - The document file content.
 *
 * @throws {FileNotFoundError} - If the document file does not exist.
 */
export async function writeDocument(path: string, content: string): Promise<void> {
  // Ensure that the document file exists
  if (!(await Fs.exists(path))) {
    throw new FileNotFoundError(path);
  }

  // Write the document content to the document file
  await Fs.writeTextFile(path, content);
}
