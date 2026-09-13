import { Fs } from '@minddrop/file-system';
import { ItemReferences } from '@minddrop/item-references';
import { Workspaces } from '@minddrop/workspaces';
import { getAllEntityGroups } from '../getAllEntityGroups';
import {
  resolveEntityGroupsDirPath,
  resolveEntityGroupsFilePath,
} from '../utils';

/**
 * Writes a group type's groups to the file system.
 *
 * @param type - The group type.
 * @param workspaceId - The workspace the groups belong to. Omit for the active workspace.
 */
export async function writeEntityGroups(
  type: string,
  workspaceId?: string,
): Promise<void> {
  const workspacePath = Workspaces.resolvePath(workspaceId);

  // Ensure the groups directory exists
  await Fs.ensureDir(resolveEntityGroupsDirPath(workspacePath));

  // Convert the groups' item IDs into durable references
  const groups = getAllEntityGroups(type, workspaceId).map((group) => ({
    ...group,
    items: ItemReferences.serialize(group.items, workspaceId),
  }));

  // Write the type's groups file
  await Fs.writeJsonFile(
    resolveEntityGroupsFilePath(type, workspacePath),
    groups,
    true,
  );
}
