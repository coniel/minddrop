import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { ItemReferences } from '@minddrop/item-references';
import { MockFs, cleanup, collection_1, setup } from '../test-utils';
import { Collection } from '../types';
import { resolveCollectionFilePath } from '../utils';
import { initializeCollections } from './initializeCollections';

// The changed member's ID, present in collection_1
const changedId = collection_1.items[0];

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

    Events.dispatch(ItemReferences.events.AddressesChanged, [
      {
        id: changedId,
        oldReference: `old:${changedId}`,
        newReference: `address:${changedId}`,
      },
    ]);

    await vi.advanceTimersByTimeAsync(0);

    const written = MockFs.readJsonFile<Collection>(
      resolveCollectionFilePath(collection_1.id),
    );

    // The rewritten file holds freshly serialized member references
    expect(written.items).toEqual(
      collection_1.items.map((id) => `address:${id}`),
    );
  });
});
