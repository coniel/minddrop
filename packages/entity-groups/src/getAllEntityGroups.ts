import { EntityGroupsStore } from './EntityGroupsStore';
import { EntityGroup } from './types';

/**
 * Retrieves a group type's groups.
 *
 * @param type - The group type.
 * @param workspaceId - The workspace the groups belong to. Omit for the active workspace.
 * @returns The type's groups in the order they are listed.
 */
export function getAllEntityGroups(
  type: string,
  workspaceId?: string,
): EntityGroup[] {
  return EntityGroupsStore.in(workspaceId).get(type)?.groups ?? [];
}
