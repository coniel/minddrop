import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { storeItem } from '@minddrop/stores/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionsLoadedEvent } from '../events';
import { cleanup, mockDate, setup } from '../test-utils';
import { loadVirtualCollections } from './loadVirtualCollections';

const { workspace_1, workspace_2 } = WorkspaceFixtures;

const data = [
  { id: 'virtual-1', name: 'Collection 1', items: ['item-1'] },
  { id: 'virtual-2', name: 'Collection 2', items: ['item-2', 'item-3'] },
];

describe('loadVirtualCollections', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('loads virtual collections into the store', () => {
    loadVirtualCollections(data, workspace_1.id);

    const collection1 = storeItem(CollectionsStore, 'virtual-1');
    const collection2 = storeItem(CollectionsStore, 'virtual-2');

    expect(collection1).not.toBeNull();
    expect(collection2).not.toBeNull();
  });

  it("loads the collections into the workspace's store record", () => {
    loadVirtualCollections(data, workspace_2.id);

    // Should load into the second workspace's record, not the
    // active workspace's.
    expect(CollectionsStore.in(workspace_2.id).get('virtual-1')).not.toBeNull();
    expect(CollectionsStore).not.toHaveItem('virtual-1');
  });

  it('marks loaded collections as virtual', () => {
    loadVirtualCollections(data, workspace_1.id);

    const collection = storeItem(CollectionsStore, 'virtual-1');

    expect(collection.virtual).toBe(true);
  });

  it('sets names and items from the provided data', () => {
    loadVirtualCollections(data, workspace_1.id);

    const collection = storeItem(CollectionsStore, 'virtual-1');

    expect(collection.name).toBe('Collection 1');
    expect(collection.items).toEqual(['item-1']);
  });

  it('sets created and lastModified dates', () => {
    loadVirtualCollections(data, workspace_1.id);

    const collection = storeItem(CollectionsStore, 'virtual-1');

    expect(collection.created).toEqual(mockDate);
    expect(collection.lastModified).toEqual(mockDate);
  });

  it('dispatches a collections loaded event', () =>
    new Promise<void>((done) => {
      Events.addListener(CollectionsLoadedEvent, 'test', (payload) => {
        expect(payload).toHaveLength(2);
        expect(payload[0].virtual).toBe(true);
        done();
      });

      loadVirtualCollections(data, workspace_1.id);
    }));
});
