import { generateResourceDocument } from '../generateResourceDocument';
import { ResourceDocument, ResourceStore } from '../types';
import { createResourceStore } from './createResourceStore';

interface TestResource {
  foo: string;
}

const document1: ResourceDocument<TestResource> = {
  ...generateResourceDocument<TestResource>(1, {
    foo: 'foo',
  }),
  id: 'doc-1',
  revision: 'rev-1',
};

const document2: ResourceDocument<TestResource> = {
  ...generateResourceDocument<TestResource>(1, {
    foo: 'foo',
  }),
  id: 'doc-2',
  revision: 'rev-1',
};

describe('resourceStore', () => {
  let Store: ResourceStore<ResourceDocument<TestResource>>;

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

    it('adds the document revisions', () => {
      // Load documents into the store
      Store.load([document1, document2]);

      // Document revision should be added to the store
      expect(
        Store.containsRevision(document1.id, document1.revision),
      ).toBeTruthy();
    });

    it('preserves existing document revisionss', () => {
      // Load a document into the store
      Store.load([document1]);
      // Load a second document into the store
      Store.load([document2]);

      // Previously loaded document's revision should
      // still be in the store.
      expect(
        Store.containsRevision(document1.id, document1.revision),
      ).toBeTruthy();
    });
  });

  describe('set', () => {
    it('sets a document in the store', () => {
      // Set a document in the store
      Store.set(document1);

      // Document should be in the store
      expect(Store.get(document1.id)).toEqual(document1);
    });

    it('adds the document revision', () => {
      // Set a document in the store
      Store.set(document1);

      // Document revision should be in the store
      expect(
        Store.containsRevision(document1.id, document1.revision),
      ).toBeTruthy();
    });

    it('preserves previous revisions', () => {
      // Set a document in the store
      Store.set(document1);
      // Set the same document with a new revision
      Store.set({ ...document1, revision: 'rev-2' });

      // Both document revisions should be in the store
      expect(Store.containsRevision(document1.id, 'rev-1')).toBeTruthy();
      expect(Store.containsRevision(document1.id, 'rev-2')).toBeTruthy();
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

    it('removes the document revisions from the store', () => {
      // Load documents into the store
      Store.load([document1, document2]);

      // Remove a document from the store
      Store.remove(document1.id);

      // Document revisions should be removed from the store
      expect(
        Store.containsRevision(document1.id, document1.revision),
      ).toBeFalsy();
      // Other document revisions should remain
      expect(
        Store.containsRevision(document2.id, document2.revision),
      ).toBeTruthy();
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

    it('clears all document revisions from the store', () => {
      // Load documents into the store
      Store.load([document1, document2]);

      // Clear the store
      Store.clear();

      // Document revisions should no longer be in the store
      expect(
        Store.containsRevision(document1.id, document1.revision),
      ).toBeFalsy();
      expect(
        Store.containsRevision(document2.id, document2.revision),
      ).toBeFalsy();
    });
  });
});
