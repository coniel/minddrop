import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import {
  EntityGroupNotFoundError,
  ProtectedEntityGroupError,
  UnsupportedEntityGroupItemError,
} from '../errors';
import { EntityGroupUpdatedEvent } from '../events';
import { getEntityGroup } from '../getEntityGroup';
import {
  EntityGroupFixtures,
  cleanup,
  readWrittenEntityGroup,
  setup,
} from '../test-utils';
import { addEntityGroupItem } from './addEntityGroupItem';

const {
  addressedItem_1,
  addressedItem_2,
  entityGroup_exclusive_1,
  entityGroup_exclusive_2,
  entityGroup_exclusive_empty,
  entityGroup_multi_1,
  entityGroup_multi_2,
  entityGroup_protected,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
  plainItem_1,
  unsupportedItem_1,
} = EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;
const multiType = groupTypeConfig_multi.id;

describe('addEntityGroupItem', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('appends the item to the group', async () => {
    await addEntityGroupItem(type, entityGroup_exclusive_empty.id, plainItem_1);

    expect(getEntityGroup(type, entityGroup_exclusive_empty.id).items).toEqual([
      plainItem_1,
    ]);
  });

  it('inserts the item at the given index', async () => {
    await addEntityGroupItem(
      type,
      entityGroup_exclusive_1.id,
      addressedItem_2,
      1,
    );

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual([
      addressedItem_1,
      addressedItem_2,
      plainItem_1,
    ]);
  });

  it('moves an item the group already holds to the new position', async () => {
    await addEntityGroupItem(type, entityGroup_exclusive_1.id, plainItem_1, 0);

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual([
      plainItem_1,
      addressedItem_1,
    ]);
  });

  it('removes the item from the group which held it', async () => {
    await addEntityGroupItem(
      type,
      entityGroup_exclusive_empty.id,
      addressedItem_2,
    );

    expect(getEntityGroup(type, entityGroup_exclusive_2.id).items).toEqual([]);
  });

  it('leaves the other groups holding the item when the type allows it', async () => {
    await addEntityGroupItem(multiType, entityGroup_multi_2.id, plainItem_1);

    expect(getEntityGroup(multiType, entityGroup_multi_1.id).items).toEqual(
      entityGroup_multi_1.items,
    );
  });

  it('leaves the other types alone', async () => {
    await addEntityGroupItem(
      type,
      entityGroup_exclusive_empty.id,
      addressedItem_1,
    );

    expect(getEntityGroup(multiType, entityGroup_multi_1.id).items).toEqual(
      entityGroup_multi_1.items,
    );
  });

  it('writes the groups to the file system', async () => {
    await addEntityGroupItem(type, entityGroup_exclusive_empty.id, plainItem_1);

    expect(
      readWrittenEntityGroup(
        groupTypeConfig_exclusive.id,
        entityGroup_exclusive_empty.id,
      )?.items,
    ).toEqual([plainItem_1]);
  });

  it('throws for an item of a type the group cannot hold', async () => {
    await expect(
      addEntityGroupItem(
        type,
        entityGroup_exclusive_empty.id,
        unsupportedItem_1,
      ),
    ).rejects.toThrow(UnsupportedEntityGroupItemError);
  });

  it('throws when the group does not exist', async () => {
    await expect(
      addEntityGroupItem(type, 'entity-group_99', plainItem_1),
    ).rejects.toThrow(EntityGroupNotFoundError);
  });

  it('throws when the group is one the app provides', async () => {
    await expect(
      addEntityGroupItem(multiType, entityGroup_protected.id, plainItem_1),
    ).rejects.toThrow(ProtectedEntityGroupError);
  });

  it('dispatches the group updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener(EntityGroupUpdatedEvent, 'test', (payload) => {
        expect(payload).toEqual({
          original: entityGroup_exclusive_empty,
          updated: { ...entityGroup_exclusive_empty, items: [plainItem_1] },
        });
        done();
      });

      addEntityGroupItem(type, entityGroup_exclusive_empty.id, plainItem_1);
    }));
});
