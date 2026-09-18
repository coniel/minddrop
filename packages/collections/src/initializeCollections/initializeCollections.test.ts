import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import { Events } from '@minddrop/events';
import { ItemReferences } from '@minddrop/item-references';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { CollectionEntityType, CollectionGroupsType } from '../constants';
import { CollectionDeletedEvent } from '../events';
import { MockFs, cleanup, collection_1, setup } from '../test-utils';
import { Collection } from '../types';
import { resolveCollectionFilePath } from '../utils';
import { initializeCollections } from './initializeCollections';

// The changed member's ID, present in collection_1
const changedId = collection_1.items[0];

const { workspace_1 } = WorkspaceFixtures;

describe('initializeCollections', () => {
  beforeEach(() => {
    setup();

    // Register an adapter serializing IDs to observable addresses
    ItemReferences.registerAdapter({
      type: 'database-entry',
      serialize: (id) => `address:${id}`,
      match: () => null,
    });
  });

  afterEach(cleanup);

  it('rewrites collection files when member item addresses change', async () => {
    initializeCollections();

    Events.dispatch(ItemReferences.events.AddressesChanged, {
      workspaceId: workspace_1.id,
      changes: [
        {
          id: changedId,
          oldReference: `old:${changedId}`,
          newReference: `address:${changedId}`,
        },
      ],
    });

    await vi.advanceTimersByTimeAsync(0);

    const written = MockFs.readJsonFile<Collection>(
      resolveCollectionFilePath(collection_1.id),
    );

    // The rewritten file holds freshly serialized member references
    expect(written.items).toEqual(
      collection_1.items.map((id) => `address:${id}`),
    );
  });

  it('registers the collection groups type', () => {
    // The fixtures register the type, so drop it to see the
    // initialization put it back.
    EntityGroups.unregisterType(CollectionGroupsType);

    initializeCollections();

    expect(EntityGroups.getConfig(CollectionGroupsType).id).toBe(
      CollectionGroupsType,
    );
  });

  it('lets a collection group hold only collections', () => {
    initializeCollections();

    expect(EntityGroups.getConfig(CollectionGroupsType).itemTypes).toEqual([
      CollectionEntityType,
    ]);
  });

  it('files a collection under one group at most', () => {
    initializeCollections();

    expect(
      EntityGroups.getConfig(CollectionGroupsType).multiMembership,
    ).toBeFalsy();
  });

  it('gives the collections in no group an ungrouped group', () => {
    initializeCollections();

    expect(EntityGroups.getConfig(CollectionGroupsType).ungrouped).toBe(true);
  });

  it('drops a deleted collection from the group holding it', () => {
    initializeCollections();

    expect(
      EntityGroups.getConfig(CollectionGroupsType).itemDeletedEvents,
    ).toEqual([CollectionDeletedEvent]);
  });
});
