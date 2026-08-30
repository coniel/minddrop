import { Fs } from '@minddrop/file-system';
import { getTag } from '../getTag';
import { resolveTagFilePath, resolveTagsDirPath } from '../utils';

/**
 * Writes a tag to the file system.
 *
 * @param id - The ID of the tag to write.
 */
export async function writeTag(id: string): Promise<void> {
  // Get the tag
  const tag = getTag(id);

  // Ensure the tags directory exists
  await Fs.ensureDir(resolveTagsDirPath());

  // Write the tag config
  Fs.writeJsonFile(resolveTagFilePath(id), tag);
}
