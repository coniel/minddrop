import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ItemReferences } from '@minddrop/item-references';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { CollectionsStore } from '../../CollectionsStore';
import {
  MockFs,
  cleanup,
  collection_1,
  collection_2,
  setup,
} from '../../test-utils';
import { Collection } from '../../types';
import { resolveCollectionFilePath } from '../../utils';
import { onItemAddressesChanged } from './item-addresses-changed';

// The changed member's ID, present in collection_1 (and its virtual
// twin) but not collection_2.
const changedId = collection_1.items[0];

const { workspace_1, workspace_2 } = WorkspaceFixtures;

describe('onItemAddressesChanged', () => {
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

  it('rewrites persisted collections containing changed items', async () => {
    await onItemAddressesChanged({
      workspaceId: workspace_1.id,
      changes: [
        {
          id: changedId,
          oldReference: `old:${changedId}`,
          newReference: `address:${changedId}`,
        },
      ],
    });

    const written = MockFs.readJsonFile<Collection>(
      resolveCollectionFilePath(collection_1.id),
    );

    // The rewritten file holds freshly serialized member references
    expect(written.items).toEqual(
      collection_1.items.map((id) => `address:${id}`),
    );
  });

  it("rewrites the collections of the changes' workspace", async () => {
    // The collection held by the second workspace as well
    CollectionsStore.in(workspace_2.id).set(collection_1);

    await onItemAddressesChanged({
      workspaceId: workspace_2.id,
      changes: [
        {
          id: changedId,
          oldReference: `old:${changedId}`,
          newReference: `address:${changedId}`,
        },
      ],
    });

    // The file is rewritten under the second workspace
    expect(
      MockFs.readJsonFile<Collection>(
        resolveCollectionFilePath(collection_1.id, workspace_2.path),
      ).items,
    ).toEqual(collection_1.items.map((id) => `address:${id}`));
  });

  it('does not rewrite collections without changed items', async () => {
    await onItemAddressesChanged({
      workspaceId: workspace_1.id,
      changes: [
        {
          id: changedId,
          oldReference: `old:${changedId}`,
          newReference: `address:${changedId}`,
        },
      ],
    });

    const written = MockFs.readJsonFile<Collection>(
      resolveCollectionFilePath(collection_2.id),
    );

    // The unaffected file keeps its original raw member IDs
    expect(written.items).toEqual(collection_2.items);
  });
});
