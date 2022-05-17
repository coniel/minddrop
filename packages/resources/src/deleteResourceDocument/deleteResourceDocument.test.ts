import { Core } from '@minddrop/core';
import { createResourceStore } from '../createResourceStore';
import { generateResourceDocument } from '../generateResourceDocument';
import { setup, cleanup, core } from '../test-utils';
import { ResourceConfig, ResourceDocument, ResourceStore } from '../types';
import { deleteResourceDocument as rawDeleteResourceDocument } from './deleteResourceDocument';

// Test resource config
const config: ResourceConfig<{}> = {
  resource: 'tests',
  dataSchema: {},
};

// Create a resource store for the test resource
const store = createResourceStore<ResourceDocument<{}>>();

// Test document to delete
const document = generateResourceDocument('tests', {});

// Create a typed version of the function
const deleteResourceDocument = (
  core: Core,
  store: ResourceStore<ResourceDocument<{}>>,
  config: ResourceConfig<{}>,
  documentId: string,
) => rawDeleteResourceDocument(core, store, config, documentId);

describe('deleteResourceDocument', () => {
  beforeEach(() => {
    setup();

    // Set test document in the store
    store.set(document);
  });

  afterEach(cleanup);

  it('marks the document as deleted', () => {
    // Delete a document
    deleteResourceDocument(core, store, config, document.id);

    // Get the deleted document from the store
    const deleted = store.get(document.id);

    // Document should be deleted
    expect(deleted.deleted).toBe(true);
    expect(deleted.deletedAt instanceof Date).toBe(true);
  });

  it('returns the deleted document', () => {
    // Delete a document
    const deleted = deleteResourceDocument(core, store, config, document.id);

    // Get the deleted document from the store
    const storeDoc = store.get(document.id);

    // Should return the deleted document
    expect(deleted).toEqual(storeDoc);
  });

  it('dispatches a `[resource]:delete` event', (done) => {
    // Listen to 'tests:delete' events
    core.addEventListener('tests:delete', (payload) => {
      // Get the deleted document
      const deleted = store.get(document.id);

      // Payload data should be the deleted document
      expect(payload.data).toEqual(deleted);
      done();
    });

    // Delete a document
    deleteResourceDocument(core, store, config, document.id);
  });
});
