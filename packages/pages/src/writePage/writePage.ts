import { Fs } from '@minddrop/file-system';
import { getPage } from '../getPage';
import { getPageFilePath, getPagesDirPath } from '../utils';

/**
 * Writes a page to the file system.
 *
 * @param id - The ID of the page to write.
 * @throws {PageNotFoundError} If the page does not exist.
 */
export async function writePage(id: string): Promise<void> {
  // Get the page
  const page = getPage(id);

  // Ensure the pages directory exists
  await Fs.ensureDir(getPagesDirPath());

  // Write the page config to the file system
  Fs.writeJsonFile(getPageFilePath(id), page);
}
