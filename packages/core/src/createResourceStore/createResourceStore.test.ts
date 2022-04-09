import { Resource, ResourceStore } from '../types';
import { createResourceStore } from './createResourceStore';

const document1: Resource = {
  id: 'doc-1',
};
const document2: Resource = {
  id: 'doc-2',
};

describe('resourceStore', () => {
  let Store: ResourceStore<Resource>;

  beforeEach(() => {
    Store = createResourceStore();
  });

  describe('load', () => {
    it('loads documents into the store', () => {
      // Load documents into the store
      Store.load([document1, document2]);

      // Documents should be in the store
      expect(Store.get(document1.id)).toEqual(document1);
      expect(Store.get(document2.id)).toEqual(document2);
    });

    it('preserves existing documents', () => {
      // Load a document into the store
      Store.load([document1]);
      // Load a second document into the store
      Store.load([document2]);

      // Store should contain both documents
      expect(Store.get(document1.id)).toEqual(document1);
      expect(Store.get(document2.id)).toEqual(document2);
    });
  });

  describe('set', () => {
    it('sets a document in the store', () => {
      // Set a document in the store
      Store.set(document1);

      // Document should be in the store
      expect(Store.get(document1.id)).toEqual(document1);
    });
  });

  describe('remove', () => {
    it('removes a document from the store', () => {
      // Load documents into the store
      Store.load([document1, document2]);

      // Remove a document from the store
      Store.remove(document1.id);

      // Document should be removed from the store
      expect(Store.getAll()).toEqual({ 'doc-2': document2 });
    });
  });

  describe('get', () => {
    it('returns a single document provided a single ID', () => {
      // Load documents into the store
      Store.load([document1, document2]);

      // Returns the requested document
      expect(Store.get(document1.id)).toEqual(document1);
    });

    it('returns multiple documents provided an array of IDs', () => {
      // Load documents into the store
      Store.load([document1, document2]);

      // Returns the requested documents
      expect(Store.get([document1.id, document2.id])).toEqual({
        'doc-1': document1,
        'doc-2': document2,
      });
    });
  });

  describe('getAll', () => {
    it('returns all documents from the store', () => {
      // Load documents into the store
      Store.load([document1, document2]);

      // Returns all documents in the store
      expect(Store.getAll()).toEqual({
        'doc-1': document1,
        'doc-2': document2,
      });
    });
  });

  describe('clear', () => {
    it('clears all documents from the store', () => {
      // Load documents into the store
      Store.load([document1, document2]);

      // Clear the store
      Store.clear();

      // Documents should no longer be in the store
      expect(Store.get([document1.id, document2.id])).toEqual({});
    });
  });
});
