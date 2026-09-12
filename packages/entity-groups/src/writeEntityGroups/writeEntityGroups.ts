import { Fs } from '@minddrop/file-system';
import { ItemReferences } from '@minddrop/item-references';
import { getAllEntityGroups } from '../getAllEntityGroups';
import {
  resolveEntityGroupsDirPath,
  resolveEntityGroupsFilePath,
} from '../utils';

/**
 * Writes a group type's groups to the file system.
 *
 * @param type - The group type.
 */
export async function writeEntityGroups(type: string): Promise<void> {
  // Ensure the groups directory exists
  await Fs.ensureDir(resolveEntityGroupsDirPath());

  // Convert the groups' item IDs into durable references
  const groups = getAllEntityGroups(type).map((group) => ({
    ...group,
    items: ItemReferences.serialize(group.items),
  }));

  // Write the type's groups file
  await Fs.writeJsonFile(resolveEntityGroupsFilePath(type), groups, true);
}
