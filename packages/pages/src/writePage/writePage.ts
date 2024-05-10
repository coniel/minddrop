import { FileNotFoundError, Fs } from '@minddrop/file-system';

/**
 * Writes a page's file content to the page markdown file.
 *
 * @param path - The path to the page file.
 * @param content - The page file content.
 *
 * @throws {FileNotFoundError} - If the page file does not exist.
 */
export async function writePage(path: string, content: string): Promise<void> {
  // Ensure that the page file exists
  if (!(await Fs.exists(path))) {
    throw new FileNotFoundError(path);
  }

  // Write the page content to the page file
  await Fs.writeTextFile(path, content);
}
