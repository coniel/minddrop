import {
  EntityGroupCollapsedStore,
  entityGroupCollapsedKey,
} from '../EntityGroupCollapsedStore';

/**
 * Collapses or expands a group, remembered per workspace on this
 * device.
 *
 * @param type - The entity group type.
 * @param groupId - The ID of the group.
 * @param collapsed - Whether the group is collapsed.
 */
export function setEntityGroupCollapsed(
  type: string,
  groupId: string,
  collapsed: boolean,
): void {
  EntityGroupCollapsedStore.set(
    entityGroupCollapsedKey(type, groupId),
    collapsed,
  );
}
