import { Core } from '@minddrop/core';
import { createResourceStore } from '../createResourceStore';
import { generateResourceDocument } from '../generateResourceDocument';
import { setup, cleanup, core } from '../test-utils';
import { deleteResourceDocument } from '../deleteResourceDocument';
import { ResourceConfig, ResourceDocument, ResourceStore } from '../types';
import { restoreResourceDocument as rawRestoreResourceDocument } from './restoreResourceDocument';

// Test resource config
const config: ResourceConfig<{}> = {
  resource: 'tests',
  dataSchema: {},
};

// Create a resource store for the test resource
const store = createResourceStore<ResourceDocument<{}>>();

// Test document to restore
const document = generateResourceDocument('tests', {});

// Create a typed version of the function
const restoreResourceDocument = (
  core: Core,
  store: ResourceStore<ResourceDocument<{}>>,
  config: ResourceConfig<{}>,
  documentId: string,
) => rawRestoreResourceDocument(core, store, config, documentId);

describe('restoreResourceDocument', () => {
  beforeEach(() => {
    setup();

    // Set test document in the store
    store.set(document);
    // Delete the document
    deleteResourceDocument(core, store, config, document.id);
  });

  afterEach(cleanup);

  it('marks the document as restored', () => {
    // Delete a document
    restoreResourceDocument(core, store, config, document.id);

    // Get the restored document from the store
    const restored = store.get(document.id);

    // Deletion related fields should be removed
    expect(restored.deleted).toBeUndefined();
    expect(restored.deletedAt).toBeUndefined();
  });

  it('returns the restored document', () => {
    // Delete a document
    const restored = restoreResourceDocument(core, store, config, document.id);

    // Get the restored document from the store
    const storeDoc = store.get(document.id);

    // Should return the restored document
    expect(restored).toEqual(storeDoc);
  });

  it('dispatches a `[resource]:restore` event', (done) => {
    // Listen to 'tests:restore' events
    core.addEventListener('tests:restore', (payload) => {
      // Get the restored document
      const restored = store.get(document.id);

      // Payload data should be the restored document
      expect(payload.data).toEqual(restored);
      done();
    });

    // Delete a document
    restoreResourceDocument(core, store, config, document.id);
  });
});
