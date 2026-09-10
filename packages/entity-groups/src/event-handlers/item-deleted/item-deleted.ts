import { getAllEntityGroups } from '../../getAllEntityGroups';
import { replaceEntityGroup } from '../../replaceEntityGroup';
import { resolveEntityGroupsForItem } from '../../utils';
import { writeEntityGroups } from '../../writeEntityGroups';

/**
 * Called when an item of a group type has been deleted. Removes the
 * item from every group of that type holding it.
 *
 * @param type - The group type the deleted item belongs to.
 * @param itemId - The ID of the deleted item.
 */
export async function onItemDeleted(
  type: string,
  itemId: string,
): Promise<void> {
  // Get the type's groups holding the item
  const groups = resolveEntityGroupsForItem(itemId, getAllEntityGroups(type));

  // Do nothing when the item was ungrouped
  if (!groups.length) {
    return;
  }

  // Drop the item from each group holding it
  groups.forEach((group) =>
    replaceEntityGroup(type, group.id, {
      items: group.items.filter((id) => id !== itemId),
    }),
  );

  // Write the type's groups to the file system
  await writeEntityGroups(type);
}
