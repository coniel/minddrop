import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { EntityGroupNotFoundError } from '../errors';
import { EntityGroupUpdatedEvent } from '../events';
import { getAllEntityGroups } from '../getAllEntityGroups';
import { getEntityGroup } from '../getEntityGroup';
import { EntityGroupFixtures, MockFs, cleanup, setup } from '../test-utils';
import { replaceEntityGroup } from './replaceEntityGroup';

const {
  addressedItem_2,
  entityGroup_exclusive_1,
  entityGroup_exclusive_2,
  entityGroup_multi_1,
  exclusiveGroups,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
  groupsFilePath,
} = EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;
const multiType = groupTypeConfig_multi.id;

// Lets an in-flight file write settle
const flushWrites = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

describe('replaceEntityGroup', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('replaces the group among its type', () => {
    replaceEntityGroup(type, entityGroup_exclusive_1.id, { name: 'Renamed' });

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).name).toBe(
      'Renamed',
    );
  });

  it('merges the given data into the group', () => {
    replaceEntityGroup(type, entityGroup_exclusive_1.id, { name: 'Renamed' });

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual(
      entityGroup_exclusive_1.items,
    );
  });

  it('replaces the group in place', () => {
    replaceEntityGroup(type, entityGroup_exclusive_1.id, { name: 'Renamed' });

    expect(getAllEntityGroups(type).map(({ id }) => id)).toEqual(
      exclusiveGroups.map(({ id }) => id),
    );
  });

  it('leaves the type of other groups alone', () => {
    replaceEntityGroup(type, entityGroup_exclusive_1.id, { name: 'Renamed' });

    expect(getEntityGroup(type, entityGroup_exclusive_2.id)).toEqual(
      entityGroup_exclusive_2,
    );
  });

  it('leaves the other types alone', () => {
    replaceEntityGroup(type, entityGroup_exclusive_1.id, { name: 'Renamed' });

    expect(getEntityGroup(multiType, entityGroup_multi_1.id)).toEqual(
      entityGroup_multi_1,
    );
  });

  it('does not write the groups to the file system', async () => {
    // The whole point of it: a change spanning two groups mutates
    // each and is written once by the caller.
    replaceEntityGroup(type, entityGroup_exclusive_1.id, {
      items: [addressedItem_2],
    });

    // A write would be in flight rather than done, so the assertion
    // has to let one land before deciding none did.
    await flushWrites();

    expect(MockFs.exists(groupsFilePath(type))).toBe(false);
  });

  it('throws when the group does not exist', () => {
    expect(() =>
      replaceEntityGroup(type, 'entity-group_99', { name: 'Renamed' }),
    ).toThrow(EntityGroupNotFoundError);
  });

  it('throws when the group belongs to another type', () => {
    expect(() =>
      replaceEntityGroup(type, entityGroup_multi_1.id, { name: 'Renamed' }),
    ).toThrow(EntityGroupNotFoundError);
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

      replaceEntityGroup(type, entityGroup_exclusive_1.id, {
        name: 'Renamed',
      });
    }));
});
