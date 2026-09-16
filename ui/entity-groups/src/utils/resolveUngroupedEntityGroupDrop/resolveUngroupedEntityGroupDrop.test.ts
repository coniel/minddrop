import { describe, expect, it } from 'vitest';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import { resolveUngroupedEntityGroupDrop } from './resolveUngroupedEntityGroupDrop';

const {
  addressedItem_1,
  entityGroup_exclusive_1,
  entityGroup_multi_1,
  entityGroup_multi_2,
  exclusiveGroups,
  multiGroups,
  plainItem_2,
} = EntityGroupFixtures;

describe('resolveUngroupedEntityGroupDrop', () => {
  it('removes the item from the group holding it', () => {
    expect(
      resolveUngroupedEntityGroupDrop(exclusiveGroups, [addressedItem_1]),
    ).toEqual([
      {
        action: 'remove-item',
        groupId: entityGroup_exclusive_1.id,
        itemId: addressedItem_1,
      },
    ]);
  });

  it('removes the item from every group holding it', () => {
    expect(
      resolveUngroupedEntityGroupDrop(multiGroups, [addressedItem_1]),
    ).toEqual([
      {
        action: 'remove-item',
        groupId: entityGroup_multi_1.id,
        itemId: addressedItem_1,
      },
      {
        action: 'remove-item',
        groupId: entityGroup_multi_2.id,
        itemId: addressedItem_1,
      },
    ]);
  });

  it('does nothing for an item already in no group', () => {
    expect(
      resolveUngroupedEntityGroupDrop(exclusiveGroups, [plainItem_2]),
    ).toEqual([]);
  });
});
