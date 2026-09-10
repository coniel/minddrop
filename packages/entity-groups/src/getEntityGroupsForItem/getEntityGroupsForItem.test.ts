import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EntityGroupFixtures, cleanup, setup } from '../test-utils';
import { getEntityGroupsForItem } from './getEntityGroupsForItem';

const {
  addressedItem_1,
  entityGroup_exclusive_1,
  entityGroup_multi_1,
  entityGroup_multi_2,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
} = EntityGroupFixtures;

describe('getEntityGroupsForItem', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the group holding the item', () => {
    expect(
      getEntityGroupsForItem(groupTypeConfig_exclusive.id, addressedItem_1),
    ).toEqual([entityGroup_exclusive_1]);
  });

  it('returns every group of the type holding the item', () => {
    expect(
      getEntityGroupsForItem(groupTypeConfig_multi.id, addressedItem_1),
    ).toEqual([entityGroup_multi_1, entityGroup_multi_2]);
  });

  it('returns nothing for an ungrouped item', () => {
    expect(
      getEntityGroupsForItem(groupTypeConfig_exclusive.id, 'plain-item_99'),
    ).toEqual([]);
  });
});
