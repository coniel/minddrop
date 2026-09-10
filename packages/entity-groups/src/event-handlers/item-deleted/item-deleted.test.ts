import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getEntityGroup } from '../../getEntityGroup';
import {
  EntityGroupFixtures,
  cleanup,
  readWrittenEntityGroup,
  setup,
} from '../../test-utils';
import { onItemDeleted } from './item-deleted';

const {
  addressedItem_1,
  entityGroup_exclusive_1,
  entityGroup_multi_1,
  entityGroup_multi_2,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
  plainItem_1,
} = EntityGroupFixtures;

const multiType = groupTypeConfig_multi.id;

const type = groupTypeConfig_exclusive.id;

describe('onItemDeleted', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the deleted item from its group', async () => {
    await onItemDeleted(type, addressedItem_1);

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual([
      plainItem_1,
    ]);
  });

  it('removes the deleted item from every group of the type holding it', async () => {
    await onItemDeleted(groupTypeConfig_multi.id, addressedItem_1);

    expect(getEntityGroup(multiType, entityGroup_multi_1.id).items).toEqual([
      plainItem_1,
    ]);
    expect(getEntityGroup(multiType, entityGroup_multi_2.id).items).toEqual([]);
  });

  it('leaves the other types alone', async () => {
    await onItemDeleted(type, addressedItem_1);

    expect(getEntityGroup(multiType, entityGroup_multi_1.id).items).toEqual(
      entityGroup_multi_1.items,
    );
  });

  it('writes the groups to the file system', async () => {
    await onItemDeleted(type, addressedItem_1);

    expect(
      readWrittenEntityGroup(type, entityGroup_exclusive_1.id)?.items,
    ).toEqual([plainItem_1]);
  });

  it('does nothing when the item was ungrouped', async () => {
    await onItemDeleted(type, 'plain-item_99');

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual(
      entityGroup_exclusive_1.items,
    );
  });
});
