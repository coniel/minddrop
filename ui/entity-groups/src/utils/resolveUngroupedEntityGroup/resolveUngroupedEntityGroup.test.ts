import { describe, expect, it } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import { resolveUngroupedEntityGroup } from './resolveUngroupedEntityGroup';

const {
  addressedItem_1,
  addressedItem_2,
  exclusiveGroups,
  groupTypeConfig_exclusive,
  plainItem_1,
  plainItem_2,
} = EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;
const itemIds = [addressedItem_1, addressedItem_2, plainItem_1, plainItem_2];

describe('resolveUngroupedEntityGroup', () => {
  it('lists the items in none of the groups, in the order they were given', () => {
    expect(
      resolveUngroupedEntityGroup(type, exclusiveGroups, [
        plainItem_2,
        addressedItem_1,
      ]).items,
    ).toEqual([plainItem_2]);
  });

  it('lists every item when there are no groups', () => {
    expect(resolveUngroupedEntityGroup(type, [], itemIds).items).toEqual(
      itemIds,
    );
  });

  it('is identified as the ungrouped group of the type', () => {
    const group = resolveUngroupedEntityGroup(type, exclusiveGroups, itemIds);

    expect(group.id).toBe(EntityGroups.constants.UngroupedId);
    expect(group.type).toBe(type);
  });
});
