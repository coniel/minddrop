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
import { updateEntityGroup } from './updateEntityGroup';

const {
  entityGroup_exclusive_1,
  entityGroup_protected,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
} = EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;
const multiType = groupTypeConfig_multi.id;

describe('updateEntityGroup', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renames the group', async () => {
    await updateEntityGroup(type, entityGroup_exclusive_1.id, {
      name: 'Renamed',
    });

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).name).toBe(
      'Renamed',
    );
  });

  it('leaves the group items alone', async () => {
    await updateEntityGroup(type, entityGroup_exclusive_1.id, {
      name: 'Renamed',
    });

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual(
      entityGroup_exclusive_1.items,
    );
  });

  it('writes the groups to the file system', async () => {
    await updateEntityGroup(type, entityGroup_exclusive_1.id, {
      name: 'Renamed',
    });

    expect(
      readWrittenEntityGroup(
        groupTypeConfig_exclusive.id,
        entityGroup_exclusive_1.id,
      )?.name,
    ).toBe('Renamed');
  });

  it('throws when the group does not exist', async () => {
    await expect(
      updateEntityGroup(type, 'entity-group_99', { name: 'Renamed' }),
    ).rejects.toThrow(EntityGroupNotFoundError);
  });

  it('throws when the group is one the app provides', async () => {
    await expect(
      updateEntityGroup(multiType, entityGroup_protected.id, {
        name: 'Renamed',
      }),
    ).rejects.toThrow(ProtectedEntityGroupError);
  });

  it('dispatches the group updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener(EntityGroupUpdatedEvent, 'test', (payload) => {
        expect(payload).toEqual({
          original: entityGroup_exclusive_1,
          updated: { ...entityGroup_exclusive_1, name: 'Renamed' },
        });
        done();
      });

      updateEntityGroup(type, entityGroup_exclusive_1.id, { name: 'Renamed' });
    }));
});
