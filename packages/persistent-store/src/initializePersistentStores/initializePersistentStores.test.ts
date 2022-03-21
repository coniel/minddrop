import { cleanup, core } from '../test-utils';
import { onRun } from '../persistent-store-extension';
import { initializePersistentStores } from './initializePersistentStores';
import { usePersistentStore } from '../usePersistentStore';
import { getStoreValue } from '../getStoreValue';

describe('initializePersistentStores', () => {
  // Run the extension before each test
  beforeEach(() => onRun(core));

  afterEach(cleanup);

  it('creates a global store document if it does not exist', (done) => {
    // Set the global store to the default value
    usePersistentStore.getState().load('global', { id: null, data: {} });

    // Listen to 'persistent-store:load' events
    core.addEventListener('persistent-store:create-global', () => {
      // Global store should have a document ID
      expect(usePersistentStore.getState().global.id).not.toBeNull();
      done();
    });

    // Inisitalize the stores
    initializePersistentStores(core);
  });

  it('does not create a new global store if it already exists', () => {
    // Set the global store to an existing value
    usePersistentStore.getState().load('global', {
      id: 'doc-id',
      data: { [core.extensionId]: { foo: 'bar' } },
    });

    // Inisitalize the stores
    initializePersistentStores(core);

    // Global store should remain unchanged
    expect(getStoreValue('global', core, 'foo')).toBe('bar');
  });

  it('creates a local store document if it does not exist', (done) => {
    // Set the local store to the default value
    usePersistentStore.getState().load('local', { id: null, data: {} });

    // Listen to 'persistent-store:create-local' events
    core.addEventListener('persistent-store:create-local', () => {
      // Local store should document ID should be the application instance ID
      expect(usePersistentStore.getState().local.id).toBe(core.appId);
      done();
    });

    // Inisitalize the stores
    initializePersistentStores(core);
  });

  it('does not create a new local store if it already exists', () => {
    // Set the local store to an existing value
    usePersistentStore.getState().load('local', {
      id: core.appId,
      data: { [core.extensionId]: { foo: 'bar' } },
    });

    // Inisitalize the stores
    initializePersistentStores(core);

    // Local store should remain unchanged
    expect(getStoreValue('local', core, 'foo')).toBe('bar');
  });
});
