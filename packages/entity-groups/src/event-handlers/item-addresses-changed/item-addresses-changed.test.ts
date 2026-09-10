import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  EntityGroupFixtures,
  MockFs,
  cleanup,
  readWrittenEntityGroup,
  setup,
} from '../../test-utils';
import { onItemAddressesChanged } from './item-addresses-changed';

const {
  addressedItem_1,
  itemAddresses,
  entityGroup_exclusive_1,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
  groupsFilePath,
} = EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;

const change = {
  id: addressedItem_1,
  oldReference: 'Addressed/Old title',
  newReference: itemAddresses[addressedItem_1],
};

describe('onItemAddressesChanged', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('rewrites the file of every type holding a changed item', async () => {
    await onItemAddressesChanged([change]);

    expect(
      readWrittenEntityGroup(type, entityGroup_exclusive_1.id)?.items,
    ).toEqual([itemAddresses[addressedItem_1], 'plain-item_1']);
    expect(MockFs.exists(groupsFilePath(groupTypeConfig_multi.id))).toBe(true);
  });

  it('leaves the files alone when no group holds a changed item', async () => {
    await onItemAddressesChanged([
      {
        id: 'addressed-item_99',
        oldReference: 'Addressed/Other',
        newReference: 'Addressed/Other renamed',
      },
    ]);

    expect(MockFs.exists(groupsFilePath(type))).toBe(false);
  });
});
