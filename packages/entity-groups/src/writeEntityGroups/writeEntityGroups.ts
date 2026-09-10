import { Fs } from '@minddrop/file-system';
import { ItemReferences } from '@minddrop/item-references';
import { Paths } from '@minddrop/utils';
import { EntityGroupsDirName } from '../constants';
import { getAllEntityGroups } from '../getAllEntityGroups';
import { resolveEntityGroupsFilePath } from '../utils';

/**
 * Writes a group type's groups to the file system.
 *
 * @param type - The group type.
 */
export async function writeEntityGroups(type: string): Promise<void> {
  // Ensure the groups directory exists
  await Fs.ensureDir(
    Fs.concatPath(Paths.workspaceConfigs, EntityGroupsDirName),
  );

  // Convert the groups' item IDs into durable references
  const groups = getAllEntityGroups(type).map((group) => ({
    ...group,
    items: ItemReferences.serialize(group.items),
  }));

  // Write the type's groups file
  await Fs.writeJsonFile(resolveEntityGroupsFilePath(type), groups, true);
}
