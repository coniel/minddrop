import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { EntityGroupNotFoundError, ProtectedEntityGroupError } from '../errors';
import { EntityGroupUpdatedEvent } from '../events';
import { getEntityGroup } from '../getEntityGroup';
import {
  EntityGroupFixtures,
  cleanup,
  readWrittenEntityGroup,
  setup,
} from '../test-utils';
import { removeEntityGroupItem } from './removeEntityGroupItem';

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

describe('removeEntityGroupItem', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('drops the item from the group', async () => {
    await removeEntityGroupItem(
      type,
      entityGroup_exclusive_1.id,
      addressedItem_1,
    );

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual([
      plainItem_1,
    ]);
  });

  it('leaves the group alone when it does not hold the item', async () => {
    await removeEntityGroupItem(
      type,
      entityGroup_exclusive_1.id,
      'plain-item_99',
    );

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual(
      entityGroup_exclusive_1.items,
    );
  });

  it('writes the groups to the file system', async () => {
    await removeEntityGroupItem(
      type,
      entityGroup_exclusive_1.id,
      addressedItem_1,
    );

    expect(
      readWrittenEntityGroup(
        groupTypeConfig_exclusive.id,
        entityGroup_exclusive_1.id,
      )?.items,
    ).toEqual([plainItem_1]);
  });

  it('throws when the group does not exist', async () => {
    await expect(
      removeEntityGroupItem(type, 'entity-group_99', plainItem_1),
    ).rejects.toThrow(EntityGroupNotFoundError);
  });

  it('throws when the group is one the app provides', async () => {
    await expect(
      removeEntityGroupItem(multiType, entityGroup_protected.id, plainItem_1),
    ).rejects.toThrow(ProtectedEntityGroupError);
  });

  it('dispatches the group updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener(EntityGroupUpdatedEvent, 'test', (payload) => {
        expect(payload.updated.items).toEqual([plainItem_1]);
        done();
      });

      removeEntityGroupItem(type, entityGroup_exclusive_1.id, addressedItem_1);
    }));
});
