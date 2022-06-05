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

const resource1 = createResource<{ foo: string }, {}, {}>({
  resource: 'tests:resource-1',
  dataSchema: {
    foo: {
      type: 'string',
      required: false,
    },
  },
});
const resource2 = createResource<{ foo: string }, {}, {}>({
  resource: 'tests:resource-2',
  dataSchema: {
    foo: {
      type: 'string',
      required: false,
    },
  },
});
const resource3 = createResource<{ foo: string }, {}, {}>({
  resource: 'tests:resource-2',
  dataSchema: {
    foo: {
      type: 'string',
      required: false,
    },
  },
});

const document1 = generateResourceDocument('tests:resource-1', {});
const document2 = generateResourceDocument('tests:resource-2', {});
const document3 = generateResourceDocument('tests:resource-1', {});

const storageAdapterConfig1: ResourceStorageAdapterConfig = {
  id: 'adapter-1',
  initialize: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getAll: () =>
    new Promise((resolve) => {
      resolve([document1, document2]);
    }),
};
const storageAdapterConfig2: ResourceStorageAdapterConfig = {
  id: 'adapter-2',
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getAll: () => [document3],
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
    it('initializes storage adapters', async () => {
      // Register a couple of storage adapters, with storage
      // adapter 2 having no initialization callback.
      registerResourceStorageAdapter(core, storageAdapterConfig1);
      registerResourceStorageAdapter(core, storageAdapterConfig2);

      // Run the extension
      await onRun(core);

      // Should initialize the adapters with a `initialize` callback
      expect(storageAdapterConfig1.initialize).toHaveBeenCalledWith(core);
    });

    it('loads documents into the appropriate store', async () => {
      // Register a couple of resources
      registerResource(core, resource1);
      registerResource(core, resource2);
      // Register a storage adapter
      registerResourceStorageAdapter(core, storageAdapterConfig1);

      // Run the extension
      await onRun(core);

      // Should load document1 into resource1
      expect(resource1.store.get(document1.id)).toBeDefined();
      expect(resource2.store.get(document1.id)).toBeUndefined();
      // Should load document2 into resource2
      expect(resource2.store.get(document2.id)).toBeDefined();
      expect(resource1.store.get(document2.id)).toBeUndefined();
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
        expect(payload.data).toEqual([document1]);
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
