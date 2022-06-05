import { setup, cleanup, core } from '../test-utils';
import { ResourceStorageAdapterConfig } from '../types';
import { ResourceStorageAdaptersStore } from '../ResourceStorageAdaptersStore';
import { registerResourceStorageAdapter } from './registerResourceStorageAdapter';

const config: ResourceStorageAdapterConfig = {
  id: 'id',
  initialize: jest.fn(),
  getAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('registerResourceStorageAdapter', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('registers the config in the ResourceStorageAdaptersStore', () => {
    // Register a storage adapter config
    registerResourceStorageAdapter(core, config);

    // Config should be in the ResourceStorageAdaptersStore
    expect(ResourceStorageAdaptersStore.get('id')).toEqual(config);
  });

  it('dispatches a `resources:storage-adapter:register` event', (done) => {
    // Listen to 'resources:storage-adapter:register' events
    core.addEventListener('resources:storage-adapter:register', (payload) => {
      // Payload data should be the config
      expect(payload.data).toEqual(config);
      done();
    });

    // Register a storage adapter config
    registerResourceStorageAdapter(core, config);
  });
});
