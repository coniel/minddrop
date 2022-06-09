import { setup, cleanup, core } from '../test-utils';
import { ResourceStorageAdapterConfig } from '../types';
import { createResource } from '../createResource';
import { registerResource } from '../registerResource';
import { registerResourceStorageAdapter } from '../registerResourceStorageAdapter';
import { generateResourceDocument } from '../generateResourceDocument';
import { onRun, onDisable } from './resources-extension';
import { ResourceStorageAdaptersStore } from '../ResourceStorageAdaptersStore';
import { ResourceApisStore } from '../ResourceApisStore';
import { Resources } from '../Resources';

const resource1 = createResource<{ foo?: string }, {}, {}>({
  resource: 'tests:resource-1',
  dataSchema: {
    foo: {
      type: 'string',
      required: false,
    },
  },
});
const resource2 = createResource<{ foo?: string }, {}, {}>({
  resource: 'tests:resource-2',
  dataSchema: {
    foo: {
      type: 'string',
      required: false,
    },
  },
});
const resource3 = createResource<{ foo?: string }, {}, {}>({
  resource: 'tests:resource-2',
  dataSchema: {
    foo: {
      type: 'string',
      required: false,
    },
  },
});

// resource1 documents
const res1doc1 = generateResourceDocument('tests:resource-1', {});
const res1doc2 = generateResourceDocument('tests:resource-1', {});
const res1doc3 = generateResourceDocument('tests:resource-1', {});
// resource2 documents
const res2doc1 = generateResourceDocument('tests:resource-2', {});

const storageAdapterConfig1: ResourceStorageAdapterConfig = {
  id: 'adapter-1',
  initialize: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getAll: () =>
    new Promise((resolve) => {
      resolve([res1doc1, res1doc2, res2doc1]);
    }),
};
const storageAdapterConfig2: ResourceStorageAdapterConfig = {
  id: 'adapter-2',
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getAll: () => [res1doc2],
};

describe('resources-extension', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();

    resource1.store.clear();
    resource2.store.clear();

    jest.clearAllMocks();
  });

  describe('onRun', () => {
    it('initializes storage adapters with the sync API', async () => {
      // Register a resource
      registerResource(core, resource1);
      // Load a couple of documents to the resource store
      resource1.store.load(core, [res1doc1, res1doc2]);
      // Register a storage adapter which calls sync API methods
      registerResourceStorageAdapter(core, {
        ...storageAdapterConfig1,
        // Load nothing to prevent modifications made
        // in `initialize` from being overwritten.
        getAll: () => [],
        initialize: (syncApi) => {
          // Set a new document
          syncApi.set(res1doc3);
          // Set an existing document with modifications
          syncApi.set({ ...res1doc1, revision: 'new-revision' });
          // Remove a document
          syncApi.remove(res1doc2);
        },
      });

      // Run the extension
      await onRun(core);

      // Should have added document 'res1doc3' to the store
      expect(resource1.store.get(res1doc3.id)).toEqual(res1doc3);
      // Should have set document 'res1doc1' modifications in the store
      expect(resource1.store.get(res1doc1.id).revision).toBe('new-revision');
      // Should have removed document 'res1doc2' from the store
      expect(resource1.store.get(res1doc2.id)).not.toBeDefined();
    });

    it('works with storage adapters which have no `initialize` callback', async () => {
      // Register a storage adapter which has no `initialize` callback
      registerResourceStorageAdapter(core, storageAdapterConfig2);

      // Run the extension, should not throw
      await onRun(core);
    });

    it('loads documents into the appropriate store', async () => {
      // Register a couple of resources
      registerResource(core, resource1);
      registerResource(core, resource2);
      // Register a storage adapter
      registerResourceStorageAdapter(core, storageAdapterConfig1);

      // Run the extension
      await onRun(core);

      // Should load res1doc1 into resource1
      expect(resource1.store.get(res1doc1.id)).toBeDefined();
      expect(resource2.store.get(res1doc1.id)).toBeUndefined();
      // Should load res2doc1 into resource2
      expect(resource2.store.get(res2doc1.id)).toBeDefined();
      expect(resource1.store.get(res2doc1.id)).toBeUndefined();
    });

    it('loads documents from the last registered storage adapter', async () => {
      jest.spyOn(storageAdapterConfig1, 'getAll');
      jest.spyOn(storageAdapterConfig2, 'getAll');

      // Register a couple of storage adapters, with storage
      // adapter 2 being registered last.
      registerResourceStorageAdapter(core, storageAdapterConfig1);
      registerResourceStorageAdapter(core, storageAdapterConfig2);

      // Run the extension
      await onRun(core);

      // Should only load documents from storage adapter 2
      expect(storageAdapterConfig1.getAll).not.toHaveBeenCalled();
      expect(storageAdapterConfig2.getAll).toHaveBeenCalled();
    });

    it('works with resources which have no documents to load', async () => {
      // Register a resource which has no documents
      registerResource(core, resource3);
      // Register a storage adapter
      registerResourceStorageAdapter(core, storageAdapterConfig1);

      // Run the extension, should not throw an error
      await onRun(core);
    });

    it('loads documents into resource registered after the initial call', (done) => {
      // Register a storage adapter
      registerResourceStorageAdapter(core, storageAdapterConfig1);

      // Listen to 'tests:resource-1:load' events which
      // are fired when documents are loaded into resource1
      core.addEventListener('tests:resource-1:load', (payload) => {
        // Payload should be 'tests:resource-1' documents loaded
        // by storage adapter 1.
        expect(payload.data).toEqual([res1doc1, res1doc2]);
        done();
      });

      async function runTest() {
        // Run the extension, should not throw an error
        await onRun(core);

        // Register resource1
        registerResource(core, resource1);
      }

      runTest();
    });
  });

  describe('onDisable', () => {
    beforeEach(() => {
      // Register a resource
      registerResource(core, resource1);
      // Register a storage adapter
      registerResourceStorageAdapter(core, storageAdapterConfig1);

      // Run the extension
      onRun(core);
    });

    it('clears registered storage adapters', () => {
      // Disable the extension
      onDisable(core);

      // Storage adapter should no longer be registered
      expect(ResourceStorageAdaptersStore.getAll()).toEqual([]);
    });

    it('clears registered resources', () => {
      // Disable the extension
      onDisable(core);

      // Resource should no longer be registered
      expect(ResourceApisStore.getAll()).toEqual([]);
    });

    it('clears event listeners', () => {
      // Add an event listener
      Resources.addEventListener(
        core,
        'resources:resource:register',
        jest.fn(),
      );

      // Disable the extension
      onDisable(core);

      // Event listener should no longer be registered
      expect(core.hasEventListeners()).toBeFalsy();
    });
  });
});
