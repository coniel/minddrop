import { describe, expect, it } from 'vitest';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import { resolveAcceptedEntityGroupItems } from './resolveAcceptedEntityGroupItems';

const {
  addressedItem_1,
  groupTypeConfig_exclusive,
  plainItem_1,
  unsupportedItem_1,
} = EntityGroupFixtures;

describe('resolveAcceptedEntityGroupItems', () => {
  it('keeps items of the types the group type holds', () => {
    expect(
      resolveAcceptedEntityGroupItems(
        [addressedItem_1, plainItem_1],
        groupTypeConfig_exclusive,
      ),
    ).toEqual([addressedItem_1, plainItem_1]);
  });

  it('drops items of a type the group type does not hold', () => {
    expect(
      resolveAcceptedEntityGroupItems(
        [addressedItem_1, unsupportedItem_1],
        groupTypeConfig_exclusive,
      ),
    ).toEqual([addressedItem_1]);
  });

  it('drops IDs which carry no entity type', () => {
    expect(
      resolveAcceptedEntityGroupItems(['untyped'], groupTypeConfig_exclusive),
    ).toEqual([]);
  });
});
