import { createUpdate } from '@minddrop/utils';
import { generateResourceDocument } from '../generateResourceDocument';
import { runStorageAdapters } from '../runStorageAdapters';
import { RDChanges, ResourceDocument } from '../types';
import { ResourceDocumentChangesStore } from './ResourceDocumentChangesStore';

jest.mock('../runStorageAdapters/runStorageAdapters.ts', () => ({
  runStorageAdapters: jest.fn(),
}));

const document1 = generateResourceDocument('tests:test', {});
const document2 = generateResourceDocument('tests:test', {});
const document3 = generateResourceDocument('tests:test', {});

const update1 = createUpdate<RDChanges, ResourceDocument>(document1, {
  revision: 'new-rev',
  updatedAt: new Date(),
});

describe('ResourceDocumentChangesStore', () => {
  afterEach(() => {
    // Clear the store
    ResourceDocumentChangesStore.clear();
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('addCreated', () => {
    it('adds the document to the `created` map', () => {
      // Add a created document
      ResourceDocumentChangesStore.addCreated(document1);

      // Document should be in the `created` map
      expect(ResourceDocumentChangesStore.created[document1.id]).toEqual(
        document1,
      );
    });

    it('adds the document ID to the end of `creationOrder`', () => {
      // Add a couple of created documents
      ResourceDocumentChangesStore.addCreated(document1);
      ResourceDocumentChangesStore.addCreated(document2);

      // `creationOrder` should contain the created document
      // IDs in order of creation.
      expect(ResourceDocumentChangesStore.creationOrder).toEqual([
        document1.id,
        document2.id,
      ]);
    });

    it('calls `runStorageAdapters`', () => {
      // Add a created document
      ResourceDocumentChangesStore.addCreated(document1);

      // Should call `runStorageAdapters` with the store
      expect(runStorageAdapters).toHaveBeenCalledWith(
        ResourceDocumentChangesStore,
      );
    });
  });

  describe('addUpdated', () => {
    it('adds the update to the `updated` map', () => {
      // Add a document update
      ResourceDocumentChangesStore.addUpdated(document1.id, update1);

      // Document update should be in the `updated` map
      expect(ResourceDocumentChangesStore.updated[document1.id]).toEqual(
        update1,
      );
    });

    it('updates the created document data if document is in `created`', () => {
      // Add a created document
      ResourceDocumentChangesStore.addCreated(document1);

      // Add an update for the created document
      ResourceDocumentChangesStore.addUpdated(document1.id, update1);

      // Should update the document data in `created`
      expect(ResourceDocumentChangesStore.created[document1.id].revision).toBe(
        'new-rev',
      );
      // Should not add the document update to `updated`
      expect(
        ResourceDocumentChangesStore.updated[document1.id],
      ).toBeUndefined();
    });

    it('calls `runStorageAdapters`', () => {
      // Add a document update
      ResourceDocumentChangesStore.addUpdated(document1.id, update1);

      // Should call `runStorageAdapters` with the store
      expect(runStorageAdapters).toHaveBeenCalledWith(
        ResourceDocumentChangesStore,
      );
    });
  });

  describe('addDeleted', () => {
    it('adds the document to the `deleted` list', () => {
      // Add a deleted document
      ResourceDocumentChangesStore.addDeleted(document1);

      // Document should be in `deleted`
      expect(ResourceDocumentChangesStore.deleted).toContain(document1);
    });

    it('removes the document from the `created` map', () => {
      // Add a created document
      ResourceDocumentChangesStore.addCreated(document1);

      // Add the document to deleted
      ResourceDocumentChangesStore.addDeleted(document1);

      // Document should no longer be in `created`
      expect(
        ResourceDocumentChangesStore.created[document1.id],
      ).toBeUndefined();
    });

    it('removes the document from the `updated` map', () => {
      // Create an update for the created document
      const update = createUpdate<RDChanges, ResourceDocument>(document1, {
        revision: 'new-rev',
        updatedAt: new Date(),
      });

      // Add the update
      ResourceDocumentChangesStore.addUpdated(document1.id, update);

      // Add the document to deleted
      ResourceDocumentChangesStore.addDeleted(document1);

      // Document update should no longer be in `updated`
      expect(
        ResourceDocumentChangesStore.updated[document1.id],
      ).toBeUndefined();
    });

    it('calls `runStorageAdapters`', () => {
      // Add a deleted document
      ResourceDocumentChangesStore.addDeleted(document1);

      // Should call `runStorageAdapters` with the store
      expect(runStorageAdapters).toHaveBeenCalledWith(
        ResourceDocumentChangesStore,
      );
    });
  });

  describe('clear', () => {
    it('clears the store', () => {
      // Add a created document
      ResourceDocumentChangesStore.addCreated(document1);

      // Add a document update
      ResourceDocumentChangesStore.addUpdated(
        document2.id,
        createUpdate<RDChanges, ResourceDocument>(document2, {
          revision: 'new-rev',
          updatedAt: new Date(),
        }),
      );

      // Add a deleted document
      ResourceDocumentChangesStore.addDeleted(document3);

      // Clear the store
      ResourceDocumentChangesStore.clear();

      // Should clear `created`
      expect(ResourceDocumentChangesStore.created).toEqual({});
      // Should clear `creationOrder`
      expect(ResourceDocumentChangesStore.creationOrder).toEqual([]);
      // Should clear `updated`
      expect(ResourceDocumentChangesStore.updated).toEqual({});
      // Should clear `deleted`
      expect(ResourceDocumentChangesStore.deleted).toEqual([]);
    });
  });
});
