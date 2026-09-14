import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ItemReferences } from '@minddrop/item-references';
import {
  EntityGroupCollapsedStore,
  entityGroupCollapsedKey,
} from '../EntityGroupCollapsedStore';
import { deleteEntityGroup } from '../deleteEntityGroup';
import { getEntityGroup } from '../getEntityGroup';
import { setEntityGroupCollapsed } from '../setEntityGroupCollapsed';
import { EntityGroupFixtures, cleanup, setup } from '../test-utils';
import { initializeEntityGroups } from './initializeEntityGroups';

const {
  ItemDeletedEvent,
  addressedItem_1,
  entityGroup_exclusive_1,
  entityGroup_multi_1,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
} = EntityGroupFixtures;

const multiType = groupTypeConfig_multi.id;

const type = groupTypeConfig_exclusive.id;

describe('initializeEntityGroups', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('drops a deleted item from the groups of its type', async () => {
    initializeEntityGroups();

    Events.dispatch(ItemDeletedEvent, { id: addressedItem_1 });
    await Events.tests.awaitAllListeners();

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual(
      entityGroup_exclusive_1.items.filter((id) => id !== addressedItem_1),
    );
  });

  it('leaves a type without item deleted events alone', async () => {
    initializeEntityGroups();

    Events.dispatch(ItemDeletedEvent, { id: addressedItem_1 });
    await Events.tests.awaitAllListeners();

    expect(getEntityGroup(multiType, entityGroup_multi_1.id).items).toEqual(
      entityGroup_multi_1.items,
    );
  });

  it('listens for item address changes', () => {
    initializeEntityGroups();

    expect(
      Events.hasListener(
        ItemReferences.events.AddressesChanged,
        'entity-groups',
      ),
    ).toBe(true);
  });

  it('forgets a deleted group was collapsed', async () => {
    initializeEntityGroups();

    setEntityGroupCollapsed(type, entityGroup_exclusive_1.id, true);

    await deleteEntityGroup(type, entityGroup_exclusive_1.id);
    await Events.tests.awaitAllListeners();

    expect(
      EntityGroupCollapsedStore.get(
        entityGroupCollapsedKey(type, entityGroup_exclusive_1.id),
      ),
    ).toBeUndefined();
  });
});
