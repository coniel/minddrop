import { describe, expect, it } from 'vitest';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import { resolveAcceptedEntityGroupItemIds } from './resolveAcceptedEntityGroupItemIds';

const {
  addressedItem_1,
  groupTypeConfig_exclusive,
  plainItem_1,
  unsupportedItem_1,
} = EntityGroupFixtures;

describe('resolveAcceptedEntityGroupItemIds', () => {
  it('keeps items of the types the group type holds', () => {
    expect(
      resolveAcceptedEntityGroupItemIds(
        [addressedItem_1, plainItem_1],
        groupTypeConfig_exclusive,
      ),
    ).toEqual([addressedItem_1, plainItem_1]);
  });

  it('drops items of a type the group type does not hold', () => {
    expect(
      resolveAcceptedEntityGroupItemIds(
        [addressedItem_1, unsupportedItem_1],
        groupTypeConfig_exclusive,
      ),
    ).toEqual([addressedItem_1]);
  });

  it('drops IDs which carry no entity type', () => {
    expect(
      resolveAcceptedEntityGroupItemIds(['untyped'], groupTypeConfig_exclusive),
    ).toEqual([]);
  });
});
