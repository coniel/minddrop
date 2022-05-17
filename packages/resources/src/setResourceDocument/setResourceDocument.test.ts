import { createResourceStore } from '../createResourceStore';
import { generateResourceDocument } from '../generateResourceDocument';
import { setup, cleanup, core } from '../test-utils';
import { ResourceConfig, ResourceDocument } from '../types';
import { setResourceDocument } from './setResourceDocument';

// Test resource config
const config: ResourceConfig<{}> = {
  resource: 'tests',
  dataSchema: {},
};

// Create a resource store for the test resource
const store = createResourceStore<ResourceDocument<{}>>();

// Test document to set
const document = generateResourceDocument('tests', {});

describe('setResourceDocument', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();

    // Clear the seted document from the store
    store.clear();
  });

  it('sets the document in the store', () => {
    // Set a document
    setResourceDocument(core, store, config, document);

    // Document should be in the store
    expect(store.get(document.id)).toBe(document);
  });

  it('dispatches a `[resource]:set` event', (done) => {
    // Listen to 'tests:set' events
    core.addEventListener('tests:set', (payload) => {
      // Payload data should be the set document
      expect(payload.data).toEqual(document);
      done();
    });

    // Set a document
    setResourceDocument(core, store, config, document);
  });
});
