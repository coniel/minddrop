import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { EntityGroupsReorderedEvent } from '../events';
import { getAllEntityGroups } from '../getAllEntityGroups';
import {
  EntityGroupFixtures,
  cleanup,
  readWrittenEntityGroups,
  setup,
} from '../test-utils';
import { reorderEntityGroups } from './reorderEntityGroups';

const {
  entityGroup_exclusive_1,
  entityGroup_exclusive_2,
  entityGroup_exclusive_empty,
  entityGroup_multi_1,
  entityGroup_protected,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
} = EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;

const reversedIds = [
  entityGroup_exclusive_empty.id,
  entityGroup_exclusive_2.id,
  entityGroup_exclusive_1.id,
];

describe('reorderEntityGroups', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('lists the groups in the given order', async () => {
    await reorderEntityGroups(type, reversedIds);

    expect(getAllEntityGroups(type).map(({ id }) => id)).toEqual(reversedIds);
  });

  it('appends groups missing from the order', async () => {
    await reorderEntityGroups(type, [entityGroup_exclusive_2.id]);

    expect(getAllEntityGroups(type).map(({ id }) => id)).toEqual([
      entityGroup_exclusive_2.id,
      entityGroup_exclusive_1.id,
      entityGroup_exclusive_empty.id,
    ]);
  });

  it('orders the app provided groups among the user created ones', async () => {
    await reorderEntityGroups(groupTypeConfig_multi.id, [
      entityGroup_protected.id,
      entityGroup_multi_1.id,
    ]);

    expect(
      getAllEntityGroups(groupTypeConfig_multi.id).map(({ id }) => id)[0],
    ).toBe(entityGroup_protected.id);
  });

  it('leaves the other types alone', async () => {
    await reorderEntityGroups(type, reversedIds);

    expect(getAllEntityGroups(groupTypeConfig_multi.id)[0]).toEqual(
      entityGroup_multi_1,
    );
  });

  it('writes the groups to the file system', async () => {
    await reorderEntityGroups(type, reversedIds);

    expect(readWrittenEntityGroups(type).map(({ id }) => id)).toEqual(
      reversedIds,
    );
  });

  it('dispatches the groups reordered event', async () =>
    new Promise<void>((done) => {
      Events.addListener(EntityGroupsReorderedEvent, 'test', (payload) => {
        expect(payload.type).toBe(type);
        expect(payload.groups.map(({ id }) => id)).toEqual(reversedIds);
        done();
      });

      reorderEntityGroups(type, reversedIds);
    }));
});
