import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionsLoadedEvent } from '../events';
import { cleanup, mockDate, setup } from '../test-utils';
import { loadVirtualCollections } from './loadVirtualCollections';

const data = [
  { id: 'virtual-1', name: 'Collection 1', entries: ['entry-1'] },
  { id: 'virtual-2', name: 'Collection 2', entries: ['entry-2', 'entry-3'] },
];

describe('loadVirtualCollections', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('loads virtual collections into the store', () => {
    loadVirtualCollections(data);

    const collection1 = CollectionsStore.get('virtual-1');
    const collection2 = CollectionsStore.get('virtual-2');

    expect(collection1).not.toBeNull();
    expect(collection2).not.toBeNull();
  });

  it('marks loaded collections as virtual', () => {
    loadVirtualCollections(data);

    const collection = CollectionsStore.get('virtual-1');

    expect(collection?.virtual).toBe(true);
  });

  it('sets names and entries from the provided data', () => {
    loadVirtualCollections(data);

    const collection = CollectionsStore.get('virtual-1');

    expect(collection?.name).toBe('Collection 1');
    expect(collection?.entries).toEqual(['entry-1']);
  });

  it('sets created and lastModified dates', () => {
    loadVirtualCollections(data);

    const collection = CollectionsStore.get('virtual-1');

    expect(collection?.created).toEqual(mockDate);
    expect(collection?.lastModified).toEqual(mockDate);
  });

  it('dispatches a collections loaded event', () =>
    new Promise<void>((done) => {
      Events.addListener(CollectionsLoadedEvent, 'test', (payload) => {
        expect(payload.data).toHaveLength(2);
        expect(payload.data[0].virtual).toBe(true);
        done();
      });

      loadVirtualCollections(data);
    }));
});
