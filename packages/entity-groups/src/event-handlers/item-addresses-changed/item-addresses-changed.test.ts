import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { EntityGroupsStore } from '../../EntityGroupsStore';
import {
  EntityGroupFixtures,
  MockFs,
  cleanup,
  readWrittenEntityGroup,
  setup,
} from '../../test-utils';
import { EntityGroup } from '../../types';
import { resolveEntityGroupsFilePath } from '../../utils';
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

const { workspace_1, workspace_2 } = WorkspaceFixtures;

describe('onItemAddressesChanged', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('rewrites the file of every type holding a changed item', async () => {
    await onItemAddressesChanged({
      workspaceId: workspace_1.id,
      changes: [change],
    });

    expect(
      readWrittenEntityGroup(type, entityGroup_exclusive_1.id)?.items,
    ).toEqual([itemAddresses[addressedItem_1], 'plain-item_1']);
    expect(MockFs.exists(groupsFilePath(groupTypeConfig_multi.id))).toBe(true);
  });

  it("rewrites the groups of the changes' workspace", async () => {
    // The type's groups held by the second workspace as well
    EntityGroupsStore.in(workspace_2.id).set(EntityGroupsStore.get(type)!);

    await onItemAddressesChanged({
      workspaceId: workspace_2.id,
      changes: [change],
    });

    // The file is rewritten under the second workspace only
    expect(
      MockFs.readJsonFile<EntityGroup[]>(
        resolveEntityGroupsFilePath(type, workspace_2.path),
      ).find(({ id }) => id === entityGroup_exclusive_1.id)?.items,
    ).toEqual([itemAddresses[addressedItem_1], 'plain-item_1']);
    expect(MockFs.exists(groupsFilePath(type))).toBe(false);
  });

  it('leaves the files alone when no group holds a changed item', async () => {
    await onItemAddressesChanged({
      workspaceId: workspace_1.id,
      changes: [
        {
          id: 'addressed-item_99',
          oldReference: 'Addressed/Other',
          newReference: 'Addressed/Other renamed',
        },
      ],
    });

    expect(MockFs.exists(groupsFilePath(type))).toBe(false);
  });
});
