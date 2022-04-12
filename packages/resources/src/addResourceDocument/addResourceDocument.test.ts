import { createResourceStore } from '../createResourceStore';
import { generateResourceDocument } from '../generateResourceDocument';
import { setup, cleanup, core } from '../test-utils';
import { ResourceConfig } from '../types';
import { addResourceDocument } from './addResourceDocument';

// Test resource config
const config: ResourceConfig<{}> = {
  resource: 'tests',
  dataSchema: {},
};

// Create a resource store for the test resource
const store = createResourceStore<{}>();

// Test document to add
const document = generateResourceDocument({});

describe('addResourceDocument', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();

    // Clear the added document from the store
    store.clear();
  });

  it('adds the document to the store', () => {
    // Add a document
    addResourceDocument(core, store, config, document);

    // Document should be in the store
    expect(store.get(document.id)).toBe(document);
  });

  it('dispatches a `[resource]:add` event', (done) => {
    // Listen to 'tests:add' events
    core.addEventListener('tests:add', (payload) => {
      // Payload data should be the added document
      expect(payload.data).toEqual(document);
      done();
    });

    // Add a document
    addResourceDocument(core, store, config, document);
  });
});
