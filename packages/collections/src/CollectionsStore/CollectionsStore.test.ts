import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { collections, itemsCollection, notesCollection } from '../test-utils';
import { CollectionsStore } from './CollectionsStore';

function loadCollections() {
  CollectionsStore.getState().load(collections);
}

describe('CollectionsStore', () => {
  afterEach(() => {
    CollectionsStore.getState().clear();
  });

  describe('load', () => {
    it('loads collections into the store, preserving existing ones', () => {
      // Load a collection into the store
      CollectionsStore.getState().load([itemsCollection]);
      // Load a second collection into the store
      CollectionsStore.getState().load([notesCollection]);

      // Both collections should be in the store
      expect(CollectionsStore.getState().collections).toEqual({
        [itemsCollection.name]: itemsCollection,
        [notesCollection.name]: notesCollection,
      });
    });
  });

  describe('add', () => {
    it('adds a collection to the store', () => {
      // Load a collection into the store
      CollectionsStore.getState().load([itemsCollection]);

      // Add a second collection to the store
      CollectionsStore.getState().add(notesCollection);

      // Both collections should be in the store
      expect(CollectionsStore.getState().collections).toEqual({
        [itemsCollection.name]: itemsCollection,
        [notesCollection.name]: notesCollection,
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
      CollectionsStore.getState().update(itemsCollection.name, {
        name: 'New name',
      });

      // Get the collection from the store
      const collection =
        CollectionsStore.getState().collections[itemsCollection.name];

      // Collection title should be updated
      expect(collection).toEqual({
        ...itemsCollection,
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
      CollectionsStore.getState().remove(itemsCollection.name);

      // collection should no longer be in the store
      expect(
        CollectionsStore.getState().collections[itemsCollection.name],
      ).toBeUndefined();
    });
  });
});
