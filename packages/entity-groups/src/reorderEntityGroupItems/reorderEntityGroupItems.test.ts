import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EntityGroupNotFoundError, ProtectedEntityGroupError } from '../errors';
import { getEntityGroup } from '../getEntityGroup';
import { EntityGroupFixtures, cleanup, setup } from '../test-utils';
import { reorderEntityGroupItems } from './reorderEntityGroupItems';

const {
  addressedItem_1,
  entityGroup_exclusive_1,
  entityGroup_protected,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
  plainItem_1,
} = EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;
const multiType = groupTypeConfig_multi.id;

describe('reorderEntityGroupItems', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('lists the items in the given order', async () => {
    await reorderEntityGroupItems(type, entityGroup_exclusive_1.id, [
      plainItem_1,
      addressedItem_1,
    ]);

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual([
      plainItem_1,
      addressedItem_1,
    ]);
  });

  it('appends items missing from the order', async () => {
    await reorderEntityGroupItems(type, entityGroup_exclusive_1.id, [
      plainItem_1,
    ]);

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual([
      plainItem_1,
      addressedItem_1,
    ]);
  });

  it('ignores IDs the group does not hold', async () => {
    await reorderEntityGroupItems(type, entityGroup_exclusive_1.id, [
      'plain-item_99',
      ...entityGroup_exclusive_1.items,
    ]);

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual(
      entityGroup_exclusive_1.items,
    );
  });

  it('throws when the group does not exist', async () => {
    await expect(
      reorderEntityGroupItems(type, 'entity-group_99', []),
    ).rejects.toThrow(EntityGroupNotFoundError);
  });

  it('throws when the group is one the app provides', async () => {
    await expect(
      reorderEntityGroupItems(multiType, entityGroup_protected.id, []),
    ).rejects.toThrow(ProtectedEntityGroupError);
  });
});
