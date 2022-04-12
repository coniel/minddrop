import { Core } from '@minddrop/core';
import { createResourceStore } from '../createResourceStore';
import { generateResourceDocument } from '../generateResourceDocument';
import { setup, cleanup, core } from '../test-utils';
import { ResourceConfig, ResourceDocument, ResourceStore } from '../types';
import { permanentlyDeleteResourceDocument as rawPermanentlyDeleteResourceDocument } from './permanentlyDeleteResourceDocument';

// Test resource config
const config: ResourceConfig<{}> = {
  resource: 'tests',
  dataSchema: {},
};

// Create a resource store for the test resource
const store = createResourceStore<{}>();

// Test document to delete
const document = generateResourceDocument({});

// Create a typed version of the function
const permanentlyDeleteResourceDocument = (
  core: Core,
  store: ResourceStore<ResourceDocument<{}>>,
  config: ResourceConfig<{}>,
  documentId: string,
) => rawPermanentlyDeleteResourceDocument(core, store, config, documentId);

describe('permanentlyDeleteResourceDocument', () => {
  beforeEach(() => {
    setup();

    // Set test document in the store
    store.set(document);
  });

  afterEach(cleanup);

  it('removes the document from the store', () => {
    // Permanently delete a document
    permanentlyDeleteResourceDocument(core, store, config, document.id);

    // Document should no longer be in the store
    expect(store.get(document.id)).toBeUndefined();
  });

  it('dispatches a `[resource]:delete-permanently` event', (done) => {
    // Listen to 'tests:delete-permanently' events
    core.addEventListener('tests:delete-permanently', (payload) => {
      // Payload data should be the deleted document
      expect(payload.data).toEqual(document);
      done();
    });

    // Permanently delete a document
    permanentlyDeleteResourceDocument(core, store, config, document.id);
  });

  it('returns the document', () => {
    // Permanently delete a document
    const deleted = permanentlyDeleteResourceDocument(
      core,
      store,
      config,
      document.id,
    );

    // Should return the document
    expect(deleted).toEqual(document);
  });
});
