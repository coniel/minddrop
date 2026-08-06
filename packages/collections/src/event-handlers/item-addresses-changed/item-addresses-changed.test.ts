import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { registerItemReferenceAdapter } from '@minddrop/item-references';
import {
  MockFs,
  cleanup,
  collection_1,
  collection_2,
  setup,
} from '../../test-utils';
import { Collection } from '../../types';
import { getCollectionFilePath } from '../../utils';
import { onItemAddressesChanged } from './item-addresses-changed';

// The changed member's ID, present in collection_1 (and its virtual
// twin) but not collection_2
const changedId = collection_1.items[0];

describe('onItemAddressesChanged', () => {
  beforeEach(() => {
    setup();

    // Register an adapter serializing IDs to observable addresses
    registerItemReferenceAdapter({
      type: 'database-entry',
      serialize: (id) => `address:${id}`,
      match: () => null,
    });
  });

  afterEach(cleanup);

  it('rewrites persisted collections containing changed items', async () => {
    await onItemAddressesChanged([
      {
        id: changedId,
        oldReference: `old:${changedId}`,
        newReference: `address:${changedId}`,
      },
    ]);

    const written = MockFs.readJsonFile<Collection>(
      getCollectionFilePath(collection_1.id),
    );

    // The rewritten file holds freshly serialized member references
    expect(written.items).toEqual(
      collection_1.items.map((id) => `address:${id}`),
    );
  });

  it('does not rewrite collections without changed items', async () => {
    await onItemAddressesChanged([
      {
        id: changedId,
        oldReference: `old:${changedId}`,
        newReference: `address:${changedId}`,
      },
    ]);

    const written = MockFs.readJsonFile<Collection>(
      getCollectionFilePath(collection_2.id),
    );

    // The unaffected file keeps its original raw member IDs
    expect(written.items).toEqual(collection_2.items);
  });
});
