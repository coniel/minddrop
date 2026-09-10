import { Fs } from '@minddrop/file-system';
import { EntityGroup } from '../types';
import { resolveEntityGroupsFilePath } from '../utils';

/**
 * Reads a group type's groups from the file system. Their items are
 * durable references rather than item IDs.
 *
 * @param type - The group type.
 * @returns The stored groups, or an empty list if there are none.
 */
export async function readEntityGroups(type: string): Promise<EntityGroup[]> {
  try {
    return await Fs.readJsonFile<EntityGroup[]>(
      resolveEntityGroupsFilePath(type),
    );
  } catch {
    return [];
  }
}
