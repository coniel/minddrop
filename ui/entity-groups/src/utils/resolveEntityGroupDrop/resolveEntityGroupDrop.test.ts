import { describe, expect, it } from 'vitest';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import { resolveEntityGroupDrop } from './resolveEntityGroupDrop';

const {
  addressedItem_1,
  addressedItem_2,
  entityGroup_exclusive_1,
  entityGroup_exclusive_2,
  plainItem_1,
  plainItem_2,
} = EntityGroupFixtures;

// The group receiving the drops, listing [addressedItem_1, plainItem_1]
const targetGroup = entityGroup_exclusive_1;

// The drop being resolved, defaulting to an item dragged in from
// outside the list onto the group's first item.
function drop(
  options: Partial<Parameters<typeof resolveEntityGroupDrop>[0]> = {},
) {
  return resolveEntityGroupDrop({
    position: 'before',
    targetIndex: 0,
    targetGroupId: targetGroup.id,
    targetItems: targetGroup.items,
    sourceGroupId: null,
    itemIds: [addressedItem_2],
    ...options,
  });
}

describe('resolveEntityGroupDrop', () => {
  it('resolves nothing when no items were dropped', () => {
    expect(drop({ itemIds: [] })).toEqual([]);
  });

  describe('within a group', () => {
    it('reorders the group with the item at its new position', () => {
      expect(
        drop({
          sourceGroupId: targetGroup.id,
          itemIds: [addressedItem_1],
          position: 'after',
          targetIndex: 1,
        }),
      ).toEqual([
        {
          action: 'reorder-items',
          groupId: targetGroup.id,
          itemIds: [plainItem_1, addressedItem_1],
        },
      ]);
    });

    it('reorders the group with an item dropped on it at the end', () => {
      expect(
        drop({
          sourceGroupId: targetGroup.id,
          itemIds: [addressedItem_1],
          position: 'inside',
          targetIndex: undefined,
        }),
      ).toEqual([
        {
          action: 'reorder-items',
          groupId: targetGroup.id,
          itemIds: [plainItem_1, addressedItem_1],
        },
      ]);
    });
  });

  describe('from another group', () => {
    it('moves the item into the group at the drop position', () => {
      expect(
        drop({
          sourceGroupId: entityGroup_exclusive_2.id,
          position: 'after',
          targetIndex: 0,
        }),
      ).toEqual([
        {
          action: 'move-item',
          fromGroupId: entityGroup_exclusive_2.id,
          toGroupId: targetGroup.id,
          itemId: addressedItem_2,
          index: 1,
        },
      ]);
    });

    it('moves each dropped item, keeping them in the order given', () => {
      expect(
        drop({
          sourceGroupId: entityGroup_exclusive_2.id,
          itemIds: [addressedItem_2, plainItem_2],
        }),
      ).toEqual([
        {
          action: 'move-item',
          fromGroupId: entityGroup_exclusive_2.id,
          toGroupId: targetGroup.id,
          itemId: addressedItem_2,
          index: 0,
        },
        {
          action: 'move-item',
          fromGroupId: entityGroup_exclusive_2.id,
          toGroupId: targetGroup.id,
          itemId: plainItem_2,
          index: 1,
        },
      ]);
    });

    it('moves an item the group already lists to its new position', () => {
      expect(
        drop({
          sourceGroupId: entityGroup_exclusive_2.id,
          itemIds: [addressedItem_1],
          position: 'inside',
          targetIndex: undefined,
        }),
      ).toEqual([
        {
          action: 'move-item',
          fromGroupId: entityGroup_exclusive_2.id,
          toGroupId: targetGroup.id,
          itemId: addressedItem_1,
          index: 1,
        },
      ]);
    });
  });

  describe('from outside the list', () => {
    it('adds the item to the group at the drop position', () => {
      expect(drop({ position: 'after', targetIndex: 1 })).toEqual([
        {
          action: 'add-item',
          groupId: targetGroup.id,
          itemId: addressedItem_2,
          index: 2,
        },
      ]);
    });

    it('adds an item dropped on the group itself to the end', () => {
      expect(drop({ position: 'inside', targetIndex: undefined })).toEqual([
        {
          action: 'add-item',
          groupId: targetGroup.id,
          itemId: addressedItem_2,
          index: 2,
        },
      ]);
    });
  });
});
