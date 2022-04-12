import { createResourceStore } from '../createResourceStore';
import { generateResourceDocument } from '../generateResourceDocument';
import { setup, cleanup, core } from '../test-utils';
import { ResourceConfig } from '../types';
import { removeResourceDocument } from './removeResourceDocument';

// Test resource config
const config: ResourceConfig<{}> = {
  resource: 'tests',
  dataSchema: {},
};

// Create a resource store for the test resource
const store = createResourceStore<{}>();

// Test document to remove
const document = generateResourceDocument({});

describe('removeResourceDocument', () => {
  beforeEach(() => {
    setup();

    // Add a document to the store
    store.set(document);
  });

  afterEach(cleanup);

  it('removes the document to the store', () => {
    // Remove a document
    removeResourceDocument(core, store, config, document.id);

    // Document should no longer be in the store
    expect(store.get(document.id)).toBeUndefined();
  });

  it('dispatches a `[resource]:remove` event', (done) => {
    // Listen to 'tests:remove' events
    core.addEventListener('tests:remove', (payload) => {
      // Payload data should be the removed document
      expect(payload.data).toEqual(document);
      done();
    });

    // Remove a document
    removeResourceDocument(core, store, config, document.id);
  });
});
