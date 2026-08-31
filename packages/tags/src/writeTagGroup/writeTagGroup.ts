import { Fs } from '@minddrop/file-system';
import { getTagGroup } from '../getTagGroup';
import { resolveTagGroupFilePath, resolveTagGroupsDirPath } from '../utils';

/**
 * Writes a tag group to the file system.
 *
 * @param id - The ID of the tag group to write.
 */
export async function writeTagGroup(id: string): Promise<void> {
  // Get the tag group
  const group = getTagGroup(id);

  // Ensure the tag groups directory exists
  await Fs.ensureDir(resolveTagGroupsDirPath());

  // Write the tag group config
  Fs.writeJsonFile(resolveTagGroupFilePath(id), group);
}
