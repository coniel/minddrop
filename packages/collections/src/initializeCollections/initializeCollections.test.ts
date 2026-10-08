import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { ItemReferenceMatch, ItemReferences } from '@minddrop/item-references';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { addCollectionItems } from '../addCollectionItems';
import { CollectionEntityType, CollectionGroupsType } from '../constants';
import { CollectionDeletedEvent } from '../events';
import {
  MockFs,
  cleanup,
  collection_1,
  collection_2,
  collection_3,
  setup,
} from '../test-utils';
import { Collection } from '../types';
import { resolveCollectionFilePath } from '../utils';
import { initializeCollections } from './initializeCollections';

// The changed member's ID, present in collection_1
const changedId = collection_1.items[0];

const { workspace_1 } = WorkspaceFixtures;

describe('initializeCollections', () => {
  beforeEach(() => {
    setup();

    // Register an adapter serializing IDs to observable addresses,
    // and matching those addresses back to their IDs.
    ItemReferences.registerAdapter({
      type: 'database-entry',
      serialize: (id) => `address:${id}`,
      match: matchAddress,
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

  // Pins Issue 45: Collections have no watcher handler. Files changed
  // outside the app stay stale in the store, and the next in-app write
  // overwrites them. Remove .fails once fixed.
  it.fails(
    'keeps members added to a collection file outside the app when the collection is next written',
    async () => {
      initializeCollections();

      const filePath = resolveCollectionFilePath(collection_1.id);
      // A member of another collection, absent from this one
      const externalItemId = collection_2.items[0];

      // Add a member to the collection file outside of the app
      MockFs.writeTextFile(
        filePath,
        JSON.stringify({
          ...collection_1,
          items: [...collection_1.items, externalItemId].map(
            (id) => `address:${id}`,
          ),
        }),
      );

      // Report the change to the collection file
      Events.dispatch(Fs.events.Changed, {
        workspaceId: workspace_1.id,
        path: filePath,
        kind: 'modified',
      });

      // Let the change listeners finish reading the file
      await Events.tests.awaitAllListeners();

      // Write the collection by adding another item in the app
      await addCollectionItems(collection_1.id, [collection_3.items[0]]);

      const written = MockFs.readJsonFile<Collection>(filePath);

      expect(written.items).toContain(`address:${externalItemId}`);
    },
  );

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

/**
 * Matches an `address:<id>` reference to the entry ID it addresses.
 */
function matchAddress(reference: string): ItemReferenceMatch | null {
  if (!reference.startsWith('address:')) {
    return null;
  }

  return { type: 'database-entry', id: reference.slice('address:'.length) };
}
