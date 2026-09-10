import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ItemReferences } from '@minddrop/item-references';
import { EntityGroupTypesRegistry } from '../EntityGroupTypesRegistry';
import { EntityGroupsStore } from '../EntityGroupsStore';
import { EntityGroupsLoadedEvent } from '../events';
import { getAllEntityGroups } from '../getAllEntityGroups';
import { getEntityGroup } from '../getEntityGroup';
import { EntityGroupFixtures, MockFs, cleanup, setup } from '../test-utils';
import { initializeEntityGroups } from './initializeEntityGroups';

const {
  ItemDeletedEvent,
  addressedItem_1,
  entityGroup_exclusive_1,
  entityGroup_multi_1,
  entityGroup_protected,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
  groupsFilePath,
  itemAddresses,
} = EntityGroupFixtures;

const multiType = groupTypeConfig_multi.id;

const type = groupTypeConfig_exclusive.id;

describe('initializeEntityGroups', () => {
  beforeEach(() => {
    setup();

    // The store starts empty, as it does before the groups load
    EntityGroupsStore.clear();
  });

  afterEach(cleanup);

  it('loads each registered type of groups', async () => {
    MockFs.writeJsonFile(groupsFilePath(type), [entityGroup_exclusive_1]);
    MockFs.writeJsonFile(groupsFilePath(groupTypeConfig_multi.id), [
      entityGroup_multi_1,
    ]);

    await initializeEntityGroups();

    expect(getAllEntityGroups(type)).toEqual([entityGroup_exclusive_1]);
    expect(getAllEntityGroups(groupTypeConfig_multi.id)).toEqual([
      entityGroup_multi_1,
      entityGroup_protected,
    ]);
  });

  it('resolves stored references back into item IDs', async () => {
    MockFs.writeJsonFile(groupsFilePath(type), [
      { ...entityGroup_exclusive_1, items: [itemAddresses[addressedItem_1]] },
    ]);

    await initializeEntityGroups();

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual([
      addressedItem_1,
    ]);
  });

  it('drops stored references which no longer resolve', async () => {
    MockFs.writeJsonFile(groupsFilePath(type), [
      { ...entityGroup_exclusive_1, items: ['Addressed/Deleted item'] },
    ]);

    await initializeEntityGroups();

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual([]);
  });

  it('adds a type of app provided groups when none have been stored', async () => {
    await initializeEntityGroups();

    expect(getAllEntityGroups(groupTypeConfig_multi.id)).toEqual([
      entityGroup_protected,
    ]);
  });

  it('leaves a type without app provided groups empty', async () => {
    await initializeEntityGroups();

    expect(getAllEntityGroups(type)).toEqual([]);
  });

  it('restores an app provided group edited on disk', async () => {
    MockFs.writeJsonFile(groupsFilePath(groupTypeConfig_multi.id), [
      { ...entityGroup_protected, name: 'Renamed', items: [addressedItem_1] },
    ]);

    await initializeEntityGroups();

    expect(getEntityGroup(multiType, entityGroup_protected.id)).toEqual(
      entityGroup_protected,
    );
  });

  it('drops a deleted item from the groups of its type', async () => {
    MockFs.writeJsonFile(groupsFilePath(type), [entityGroup_exclusive_1]);

    await initializeEntityGroups();

    Events.dispatch(ItemDeletedEvent, { id: addressedItem_1 });
    await Events.tests.awaitAllListeners();

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual([
      'plain-item_1',
    ]);
  });

  it('leaves a type without item deleted events alone', async () => {
    MockFs.writeJsonFile(groupsFilePath(groupTypeConfig_multi.id), [
      entityGroup_multi_1,
    ]);

    await initializeEntityGroups();

    Events.dispatch(ItemDeletedEvent, { id: addressedItem_1 });
    await Events.tests.awaitAllListeners();

    expect(getEntityGroup(multiType, entityGroup_multi_1.id).items).toEqual(
      entityGroup_multi_1.items,
    );
  });

  it('listens for item address changes', async () => {
    await initializeEntityGroups();

    expect(
      Events.hasListener(
        ItemReferences.events.AddressesChanged,
        'entity-groups',
      ),
    ).toBe(true);
  });

  it('dispatches the loaded event with every type of groups', async () =>
    new Promise<void>((done) => {
      MockFs.writeJsonFile(groupsFilePath(type), [entityGroup_exclusive_1]);

      Events.addListener(EntityGroupsLoadedEvent, 'test', (payload) => {
        expect(payload).toEqual([
          entityGroup_exclusive_1,
          entityGroup_protected,
        ]);
        done();
      });

      initializeEntityGroups();
    }));

  it('loads nothing when no type is registered', async () => {
    EntityGroupTypesRegistry.clear();

    await initializeEntityGroups();

    expect(EntityGroupsStore).toHaveItemCount(0);
  });
});
