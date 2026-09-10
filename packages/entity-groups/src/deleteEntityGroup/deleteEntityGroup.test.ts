import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { EntityGroupNotFoundError, ProtectedEntityGroupError } from '../errors';
import { EntityGroupDeletedEvent } from '../events';
import { getAllEntityGroups } from '../getAllEntityGroups';
import { getEntityGroup } from '../getEntityGroup';
import {
  EntityGroupFixtures,
  cleanup,
  readWrittenEntityGroup,
  setup,
} from '../test-utils';
import { deleteEntityGroup } from './deleteEntityGroup';

const {
  entityGroup_exclusive_1,
  entityGroup_exclusive_2,
  entityGroup_exclusive_empty,
  entityGroup_protected,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
} = EntityGroupFixtures;

const multiType = groupTypeConfig_multi.id;

const type = groupTypeConfig_exclusive.id;

describe('deleteEntityGroup', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the group from its type', async () => {
    await deleteEntityGroup(type, entityGroup_exclusive_1.id);

    expect(getEntityGroup(type, entityGroup_exclusive_1.id, false)).toBeNull();
  });

  it('leaves the other groups listed in order', async () => {
    await deleteEntityGroup(type, entityGroup_exclusive_1.id);

    expect(getAllEntityGroups(type)).toEqual([
      entityGroup_exclusive_2,
      entityGroup_exclusive_empty,
    ]);
  });

  it('writes the groups to the file system', async () => {
    await deleteEntityGroup(type, entityGroup_exclusive_1.id);

    expect(
      readWrittenEntityGroup(type, entityGroup_exclusive_1.id),
    ).toBeUndefined();
  });

  it('throws when the group does not exist', async () => {
    await expect(deleteEntityGroup(type, 'entity-group_99')).rejects.toThrow(
      EntityGroupNotFoundError,
    );
  });

  it('throws when the group is one the app provides', async () => {
    await expect(
      deleteEntityGroup(multiType, entityGroup_protected.id),
    ).rejects.toThrow(ProtectedEntityGroupError);
  });

  it('dispatches the group deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(EntityGroupDeletedEvent, 'test', (payload) => {
        expect(payload).toEqual(entityGroup_exclusive_1);
        done();
      });

      deleteEntityGroup(type, entityGroup_exclusive_1.id);
    }));
});
