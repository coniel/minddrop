import { EntityGroupTypesRegistry } from '../EntityGroupTypesRegistry';
import { useEntityGroup, useEntityGroups } from '../EntityGroupsStore';
import { addEntityGroupItem } from '../addEntityGroupItem';
import { createEntityGroup } from '../createEntityGroup';
import { deleteEntityGroup } from '../deleteEntityGroup';
import { getAllEntityGroups } from '../getAllEntityGroups';
import { getEntityGroup } from '../getEntityGroup';
import { getEntityGroupsForItem } from '../getEntityGroupsForItem';
import { moveEntityGroupItem } from '../moveEntityGroupItem';
import { removeEntityGroupItem } from '../removeEntityGroupItem';
import { reorderEntityGroupItems } from '../reorderEntityGroupItems';
import { reorderEntityGroups } from '../reorderEntityGroups';
import { EntityGroup, EntityGroupsFacade } from '../types';
import { updateEntityGroup } from '../updateEntityGroup';
import { useEntityGroupsForItem } from '../useEntityGroupsForItem';
import { isProtectedEntityGroup } from '../utils';

/**
 * Creates the entity groups API bound to a group type.
 *
 * @param type - The group type to bind.
 * @returns The API bound to the type.
 */
export function createEntityGroupsFacade(type: string): EntityGroupsFacade {
  // Keeps the overloads of the throwing and non-throwing lookups
  function get(id: string): EntityGroup;
  function get(id: string, throwOnNotFound: false): EntityGroup | null;
  function get(id: string, throwOnNotFound = true): EntityGroup | null {
    if (!throwOnNotFound) {
      return getEntityGroup(type, id, false);
    }

    return getEntityGroup(type, id);
  }

  return {
    create: (name, options) => createEntityGroup(type, name, options),
    get,
    getAll: () => getAllEntityGroups(type),
    getForItem: (itemId) => getEntityGroupsForItem(type, itemId),
    isProtected: (id) =>
      isProtectedEntityGroup(id, EntityGroupTypesRegistry.get(type)),
    update: (id, data) => updateEntityGroup(type, id, data),
    delete: (id) => deleteEntityGroup(type, id),
    reorder: (ids) => reorderEntityGroups(type, ids),
    addItem: (groupId, itemId, index) =>
      addEntityGroupItem(type, groupId, itemId, index),
    moveItem: (fromGroupId, toGroupId, itemId, index) =>
      moveEntityGroupItem(type, fromGroupId, toGroupId, itemId, index),
    removeItem: (groupId, itemId) =>
      removeEntityGroupItem(type, groupId, itemId),
    reorderItems: (groupId, itemIds) =>
      reorderEntityGroupItems(type, groupId, itemIds),
    use: (id) => useEntityGroup(type, id),
    useAll: () => useEntityGroups(type),
    useForItem: (itemId) => useEntityGroupsForItem(type, itemId),
  };
}
