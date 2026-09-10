import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { NotRegisteredError } from '@minddrop/stores';
import { UnsupportedEntityGroupItemError } from '../errors';
import { EntityGroupCreatedEvent } from '../events';
import { getAllEntityGroups } from '../getAllEntityGroups';
import {
  EntityGroupFixtures,
  cleanup,
  readWrittenEntityGroup,
  setup,
} from '../test-utils';
import { createEntityGroup } from './createEntityGroup';

const {
  addressedItem_1,
  plainItem_1,
  unsupportedItem_1,
  exclusiveGroups,
  groupTypeConfig_exclusive,
} = EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;

describe('createEntityGroup', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the group to its type', async () => {
    const group = await createEntityGroup(type, 'My group');

    expect(getAllEntityGroups(type)).toContainEqual(group);
  });

  it('creates the group with no items', async () => {
    const group = await createEntityGroup(type, 'My group');

    expect(group.items).toEqual([]);
  });

  it('creates the group with the given items', async () => {
    const group = await createEntityGroup(type, 'My group', [
      addressedItem_1,
      plainItem_1,
    ]);

    expect(group.items).toEqual([addressedItem_1, plainItem_1]);
  });

  it('lists each given item once', async () => {
    const group = await createEntityGroup(type, 'My group', [
      addressedItem_1,
      plainItem_1,
      addressedItem_1,
    ]);

    expect(group.items).toEqual([addressedItem_1, plainItem_1]);
  });

  it('lists the group above the existing ones', async () => {
    const group = await createEntityGroup(type, 'My group');

    expect(getAllEntityGroups(type).map(({ id }) => id)).toEqual([
      group.id,
      ...exclusiveGroups.map(({ id }) => id),
    ]);
  });

  it('writes the groups to the file system', async () => {
    const group = await createEntityGroup(type, 'My group');

    expect(readWrittenEntityGroup(type, group.id)?.name).toBe('My group');
  });

  it('throws for an item of a type the group cannot hold', async () => {
    await expect(
      createEntityGroup(type, 'My group', [unsupportedItem_1]),
    ).rejects.toThrow(UnsupportedEntityGroupItemError);
  });

  it('creates no group when an item is of an unsupported type', async () => {
    await expect(
      createEntityGroup(type, 'My group', [unsupportedItem_1]),
    ).rejects.toThrow(UnsupportedEntityGroupItemError);

    expect(getAllEntityGroups(type)).toEqual(exclusiveGroups);
  });

  it('throws when the group type is not registered', async () => {
    await expect(createEntityGroup('unregistered', 'My group')).rejects.toThrow(
      NotRegisteredError,
    );
  });

  it('dispatches the group created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(EntityGroupCreatedEvent, 'test', (payload) => {
        expect(payload.type).toBe(type);
        expect(payload.name).toBe('My group');
        done();
      });

      createEntityGroup(type, 'My group');
    }));
});
