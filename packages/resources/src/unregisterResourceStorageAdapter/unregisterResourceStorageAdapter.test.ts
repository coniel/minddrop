import { setup, cleanup, core } from '../test-utils';
import { ResourceStorageAdapterConfig } from '../types';
import { ResourceStorageAdaptersStore } from '../ResourceStorageAdaptersStore';
import { registerResourceStorageAdapter } from '../registerResourceStorageAdapter';
import { unregisterResourceStorageAdapter } from './unregisterResourceStorageAdapter';

const config: ResourceStorageAdapterConfig = {
  id: 'id',
  initialize: jest.fn(),
  getAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('unregisterResourceStorageAdapter', () => {
  beforeEach(() => {
    setup();

    // Register a resource storage adapter
    registerResourceStorageAdapter(core, config);
  });

  afterEach(cleanup);

  it('unregisters the config from the ResourceStorageAdaptersStore', () => {
    // Unregister a resource storage adapter
    unregisterResourceStorageAdapter(core, config);

    // Config should no longer be in the storage adapter store
    expect(ResourceStorageAdaptersStore.get('id')).toBeUndefined();
  });

  it('dispatches a `resources:storage-adapter:unregister` event', (done) => {
    // Listen to 'resources:storage-adapter:unregister' events
    core.addEventListener('resources:storage-adapter:unregister', (payload) => {
      // Payload data should be the config
      expect(payload.data).toEqual(config);
      done();
    });

    // Unregister a storage adapter config
    unregisterResourceStorageAdapter(core, config);
  });
});
