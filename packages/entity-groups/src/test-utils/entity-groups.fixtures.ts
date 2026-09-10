import { Fs } from '@minddrop/file-system';
import { ItemReferenceAdapter } from '@minddrop/item-references';
import { Paths } from '@minddrop/utils';
import { EntityGroupsDirName } from '../constants';
import { EntityGroup, EntityGroupId, EntityGroupTypeConfig } from '../types';

// Item types invented for the tests, since the package is generic
// and owns no entity type of its own. `addressed-item` has a
// reference adapter, so it exercises the durable reference round
// trip; `plain-item` has none, so it passes through unchanged.
export const addressedItem_1 = 'addressed-item_1';
export const addressedItem_2 = 'addressed-item_2';
export const plainItem_1 = 'plain-item_1';
export const unsupportedItem_1 = 'unsupported-item_1';

/**
 * The durable addresses of the addressed item fixtures, keyed by ID.
 */
export const itemAddresses: Record<string, string> = {
  [addressedItem_1]: 'Addressed/Item 1',
  [addressedItem_2]: 'Addressed/Item 2',
};

/**
 * Stands in for the item reference adapter an owning package
 * registers at runtime, so that groups holding addressed items
 * serialize and resolve the way they do in the app.
 */
export const itemReferenceAdapter: ItemReferenceAdapter = {
  type: 'addressed-item',

  serialize: (id) => itemAddresses[id] ?? null,

  match: (reference) => {
    // Find the item whose address the reference is
    const id = Object.keys(itemAddresses).find(
      (itemId) => itemAddresses[itemId] === reference,
    );

    return id ? { type: 'addressed-item', id } : null;
  },
};

export const ItemDeletedEvent = 'entity-groups-tests:item:deleted';

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'entity-groups-tests:item:deleted': { id: string };
  }
}

export const protectedGroup_1 = {
  id: 'entity-group_protected' as EntityGroupId,
  name: 'Protected group',
};

/**
 * A type whose items belong to a single group, the default.
 */
export const groupTypeConfig_exclusive: EntityGroupTypeConfig = {
  id: 'exclusive',
  itemTypes: ['addressed-item', 'plain-item'],
  itemDeletedEvents: [ItemDeletedEvent],
};

/**
 * A type whose items can belong to several groups, and which the app
 * provides a group of its own.
 */
export const groupTypeConfig_multi: EntityGroupTypeConfig = {
  id: 'multi',
  itemTypes: ['addressed-item', 'plain-item'],
  multiMembership: true,
  protectedGroups: [protectedGroup_1],
};

export const groupTypeConfigs = [
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
];

export const entityGroup_exclusive_1: EntityGroup = {
  id: 'entity-group_exclusive_1' as EntityGroupId,
  type: groupTypeConfig_exclusive.id,
  name: 'Exclusive group 1',
  items: [addressedItem_1, plainItem_1],
};

export const entityGroup_exclusive_2: EntityGroup = {
  id: 'entity-group_exclusive_2' as EntityGroupId,
  type: groupTypeConfig_exclusive.id,
  name: 'Exclusive group 2',
  items: [addressedItem_2],
};

export const entityGroup_exclusive_empty: EntityGroup = {
  id: 'entity-group_exclusive_empty' as EntityGroupId,
  type: groupTypeConfig_exclusive.id,
  name: 'Empty exclusive group',
  items: [],
};

// Lists addressedItem_1 alongside entityGroup_multi_2, so that an
// item belonging to more than one group is covered.
export const entityGroup_multi_1: EntityGroup = {
  id: 'entity-group_multi_1' as EntityGroupId,
  type: groupTypeConfig_multi.id,
  name: 'Multi group 1',
  items: [addressedItem_1, plainItem_1],
};

export const entityGroup_multi_2: EntityGroup = {
  id: 'entity-group_multi_2' as EntityGroupId,
  type: groupTypeConfig_multi.id,
  name: 'Multi group 2',
  items: [addressedItem_1],
};

export const entityGroup_protected: EntityGroup = {
  ...protectedGroup_1,
  type: groupTypeConfig_multi.id,
  items: [],
};

export const exclusiveGroups = [
  entityGroup_exclusive_1,
  entityGroup_exclusive_2,
  entityGroup_exclusive_empty,
];

export const multiGroups = [
  entityGroup_multi_1,
  entityGroup_protected,
  entityGroup_multi_2,
];

export const entityGroupSets = [
  { type: groupTypeConfig_exclusive.id, groups: exclusiveGroups },
  { type: groupTypeConfig_multi.id, groups: multiGroups },
];

/**
 * Returns the path of a group type's stored file.
 *
 * @param type - The group type.
 * @returns The path to the type's groups file.
 */
export function groupsFilePath(type: string): string {
  return Fs.concatPath(
    Paths.workspaceConfigs,
    EntityGroupsDirName,
    `${type}.json`,
  );
}
