import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  collectionConfigs,
  itemsCollectionConfig,
  markdownCollectionConfig,
} from '../test-utils';
import { CollectionsStore } from './CollectionsStore';

function loadCollections() {
  CollectionsStore.getState().load(collectionConfigs);
}

describe('CollectionsStore', () => {
  afterEach(() => {
    CollectionsStore.getState().clear();
  });

  describe('load', () => {
    it('loads collections into the store, preserving existing ones', () => {
      // Load a collection into the store
      CollectionsStore.getState().load([itemsCollectionConfig]);
      // Load a second collection into the store
      CollectionsStore.getState().load([markdownCollectionConfig]);

      // Both collections should be in the store
      expect(CollectionsStore.getState().collections).toEqual({
        [itemsCollectionConfig.name]: itemsCollectionConfig,
        [markdownCollectionConfig.name]: markdownCollectionConfig,
      });
    });
  });

  describe('add', () => {
    it('adds a collection to the store', () => {
      // Load a collection into the store
      CollectionsStore.getState().load([itemsCollectionConfig]);

      // Add a second collection to the store
      CollectionsStore.getState().add(markdownCollectionConfig);

      // Both collections should be in the store
      expect(CollectionsStore.getState().collections).toEqual({
        [itemsCollectionConfig.name]: itemsCollectionConfig,
        [markdownCollectionConfig.name]: markdownCollectionConfig,
      });
    });
  });

  describe('update', () => {
    beforeEach(() => {
      // Load collections into the store
      loadCollections();
    });

    it('updates the specified collection in the store', () => {
      // Update a collection
      CollectionsStore.getState().update(itemsCollectionConfig.name, {
        name: 'New name',
      });

      // Get the collection from the store
      const collection =
        CollectionsStore.getState().collections[itemsCollectionConfig.name];

      // Collection title should be updated
      expect(collection).toEqual({
        ...itemsCollectionConfig,
        name: 'New name',
      });
    });

    it('does nothing if the collection does not exist', () => {
      const initialState = { ...CollectionsStore.getState().collections };

      // Update a missing collection
      CollectionsStore.getState().update('foo', {
        name: 'New name',
      });

      // Collections state should remain unchanged
      expect(CollectionsStore.getState().collections).toEqual(initialState);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      // Load collections into the store
      loadCollections();
    });

    it('removes the collection from the store', () => {
      // Remove a collection
      CollectionsStore.getState().remove(itemsCollectionConfig.name);

      // collection should no longer be in the store
      expect(
        CollectionsStore.getState().collections[itemsCollectionConfig.name],
      ).toBeUndefined();
    });
  });
});
