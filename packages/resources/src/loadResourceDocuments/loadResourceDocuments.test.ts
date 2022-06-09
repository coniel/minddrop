import { mapById } from '@minddrop/utils';
import { createResourceStore } from '../createResourceStore';
import { generateResourceDocument } from '../generateResourceDocument';
import { setup, cleanup, core } from '../test-utils';
import { ResourceConfig, ResourceDocument } from '../types';
import { loadResourceDocuments } from './loadResourceDocuments';

// Test resource config
const config: ResourceConfig<{}> = {
  resource: 'tests',
  dataSchema: {},
};

// Create a resource store for the test resource
const store = createResourceStore<ResourceDocument<{}>>();

// Test document to load
const document1 = generateResourceDocument('tests', {});
const document2 = generateResourceDocument('tests', {});

describe('loadResourceDocuments', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();

    // Clear the loaded documents from the store
    store.clear();
  });

  it('loads the documents into the store', () => {
    // Load some documents
    loadResourceDocuments(core, store, config, [document1, document2]);

    // Documents should be in the store
    expect(store.getAll()).toEqual(mapById([document1, document2]));
  });

  it('dispatches a `[resource]:load` event', (done) => {
    // Listen to 'tests:load' events
    core.addEventListener('tests:load', (payload) => {
      // Payload data should be the loaded documents
      expect(payload.data).toEqual([document1, document2]);
      done();
    });

    // Load some documents
    loadResourceDocuments(core, store, config, [document1, document2]);
  });
});
