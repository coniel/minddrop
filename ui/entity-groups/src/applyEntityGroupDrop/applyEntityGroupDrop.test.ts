import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import { cleanup, setup } from '../test-utils';
import { applyEntityGroupDrop } from './applyEntityGroupDrop';

const {
  addressedItem_1,
  addressedItem_2,
  entityGroup_exclusive_1,
  entityGroup_exclusive_2,
  groupTypeConfig_exclusive,
  plainItem_1,
} = EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;

describe('applyEntityGroupDrop', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reorders a group items', async () => {
    await applyEntityGroupDrop(type, [
      {
        action: 'reorder-items',
        groupId: entityGroup_exclusive_1.id,
        itemIds: [plainItem_1, addressedItem_1],
      },
    ]);

    expect(EntityGroups.get(type, entityGroup_exclusive_1.id).items).toEqual([
      plainItem_1,
      addressedItem_1,
    ]);
  });

  it('moves an item into another group', async () => {
    await applyEntityGroupDrop(type, [
      {
        action: 'move-item',
        fromGroupId: entityGroup_exclusive_2.id,
        toGroupId: entityGroup_exclusive_1.id,
        itemId: addressedItem_2,
        index: 0,
      },
    ]);

    expect(EntityGroups.get(type, entityGroup_exclusive_1.id).items).toEqual([
      addressedItem_2,
      addressedItem_1,
      plainItem_1,
    ]);
    expect(EntityGroups.get(type, entityGroup_exclusive_2.id).items).toEqual(
      [],
    );
  });

  it('adds an item to a group', async () => {
    await applyEntityGroupDrop(type, [
      {
        action: 'add-item',
        groupId: entityGroup_exclusive_1.id,
        itemId: addressedItem_2,
        index: 1,
      },
    ]);

    expect(EntityGroups.get(type, entityGroup_exclusive_1.id).items).toEqual([
      addressedItem_1,
      addressedItem_2,
      plainItem_1,
    ]);
  });

  it('applies the actions in the order they are given', async () => {
    await applyEntityGroupDrop(type, [
      {
        action: 'move-item',
        fromGroupId: entityGroup_exclusive_1.id,
        toGroupId: entityGroup_exclusive_2.id,
        itemId: addressedItem_1,
        index: 0,
      },
      {
        action: 'move-item',
        fromGroupId: entityGroup_exclusive_1.id,
        toGroupId: entityGroup_exclusive_2.id,
        itemId: plainItem_1,
        index: 1,
      },
    ]);

    expect(EntityGroups.get(type, entityGroup_exclusive_2.id).items).toEqual([
      addressedItem_1,
      plainItem_1,
      addressedItem_2,
    ]);
  });
});
