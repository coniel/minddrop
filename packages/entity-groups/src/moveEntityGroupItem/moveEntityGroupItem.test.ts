import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { EntityGroupNotFoundError, ProtectedEntityGroupError } from '../errors';
import { EntityGroupUpdatedEvent } from '../events';
import { getEntityGroup } from '../getEntityGroup';
import { EntityGroupFixtures, cleanup, setup } from '../test-utils';
import { moveEntityGroupItem } from './moveEntityGroupItem';

const {
  addressedItem_1,
  addressedItem_2,
  entityGroup_exclusive_1,
  entityGroup_exclusive_2,
  entityGroup_exclusive_empty,
  entityGroup_multi_1,
  entityGroup_protected,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
  plainItem_1,
} = EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;
const multiType = groupTypeConfig_multi.id;

describe('moveEntityGroupItem', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the item to the target group', async () => {
    await moveEntityGroupItem(
      type,
      entityGroup_exclusive_1.id,
      entityGroup_exclusive_empty.id,
      plainItem_1,
    );

    expect(getEntityGroup(type, entityGroup_exclusive_empty.id).items).toEqual([
      plainItem_1,
    ]);
  });

  it('removes the item from the group it came from', async () => {
    await moveEntityGroupItem(
      type,
      entityGroup_exclusive_1.id,
      entityGroup_exclusive_empty.id,
      plainItem_1,
    );

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual([
      addressedItem_1,
    ]);
  });

  it('inserts the item at the given index', async () => {
    await moveEntityGroupItem(
      type,
      entityGroup_exclusive_2.id,
      entityGroup_exclusive_1.id,
      addressedItem_2,
      0,
    );

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual([
      addressedItem_2,
      addressedItem_1,
      plainItem_1,
    ]);
  });

  it('moves an item the target group already holds rather than listing it twice', async () => {
    await moveEntityGroupItem(
      multiType,
      entityGroup_multi_1.id,
      entityGroup_multi_1.id,
      plainItem_1,
      0,
    );

    expect(getEntityGroup(multiType, entityGroup_multi_1.id).items).toEqual([
      plainItem_1,
      addressedItem_1,
    ]);
  });

  it('leaves an app provided group listing the item it came from', async () => {
    await moveEntityGroupItem(
      multiType,
      entityGroup_protected.id,
      entityGroup_multi_1.id,
      addressedItem_2,
    );

    expect(getEntityGroup(multiType, entityGroup_protected.id).items).toEqual(
      [],
    );
    expect(getEntityGroup(multiType, entityGroup_multi_1.id).items).toEqual([
      ...entityGroup_multi_1.items,
      addressedItem_2,
    ]);
  });

  it('reports only the target as updated when the item came from an app provided group', async () => {
    const updatedGroupIds: string[] = [];

    Events.addListener(EntityGroupUpdatedEvent, 'test', ({ updated }) => {
      updatedGroupIds.push(updated.id);
    });

    await moveEntityGroupItem(
      multiType,
      entityGroup_protected.id,
      entityGroup_multi_1.id,
      addressedItem_2,
    );
    await Events.tests.awaitAllListeners();

    expect(updatedGroupIds).toEqual([entityGroup_multi_1.id]);
  });

  it('throws when the target group is one the app provides', async () => {
    await expect(
      moveEntityGroupItem(
        multiType,
        entityGroup_multi_1.id,
        entityGroup_protected.id,
        addressedItem_1,
      ),
    ).rejects.toThrow(ProtectedEntityGroupError);
  });

  it('throws when the group it comes from does not exist', async () => {
    await expect(
      moveEntityGroupItem(
        type,
        'entity-group_99',
        entityGroup_exclusive_1.id,
        addressedItem_1,
      ),
    ).rejects.toThrow(EntityGroupNotFoundError);
  });

  it('leaves both groups alone when the move throws', async () => {
    // Moving the target group's first item to its end, so that a
    // move which ran before throwing would show.
    await expect(
      moveEntityGroupItem(
        type,
        'entity-group_99',
        entityGroup_exclusive_1.id,
        addressedItem_1,
      ),
    ).rejects.toThrow(EntityGroupNotFoundError);

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual(
      entityGroup_exclusive_1.items,
    );
  });
});
