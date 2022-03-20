import { initializeCore } from '@minddrop/core';
import { cleanup } from '../test-utils';
import { setStore } from '../setStore';
import { usePersistentStore } from '../usePersistentStore';
import { deleteStore } from './deleteStore';

const core = initializeCore({ appId: 'app', extensionId: 'test' });

describe('deleteStore', () => {
  afterEach(cleanup);

  it("deletes the enxtension's global store", () => {
    // Set the 'test' extension's global store
    setStore('global', core, { foo: 'foo' });
    // Delete the 'test' extension's global store
    deleteStore('global', core);

    // The extension's store should no longer exist
    expect(usePersistentStore.getState().global.data.test).toBeUndefined();
  });

  it("deletes the enxtension's local store", () => {
    // Set the 'test' extension's local store
    setStore('local', core, { foo: 'foo' });
    // Delete the 'test' extension's local store
    deleteStore('local', core);

    // The extension's store should no longer exist
    expect(usePersistentStore.getState().local.data.test).toBeUndefined();
  });

  it("dispatches a 'persistent-store:update-global' event", (done) => {
    // Set the 'test' extension's global store
    setStore('global', core, { foo: 'foo' });

    // Listen to 'persistent-store:update-global' events
    core.addEventListener('persistent-store:update-global', (payload) => {
      // Should remove the store
      expect(payload.data.after.data.test).toBeUndefined();
      done();
    });

    // Delete the 'test' extension's global store
    deleteStore('global', core);
  });

  it("dispatches a 'persistent-store:update-local' event", (done) => {
    // Set the 'test' extension's local store
    setStore('local', core, { foo: 'foo' });

    // Listen to 'persistent-store:update-local' events
    core.addEventListener('persistent-store:update-local', (payload) => {
      // Should remove the store
      expect(payload.data.after.data.test).toBeUndefined();
      done();
    });

    // Delete the 'test' extension's local store
    deleteStore('local', core);
  });
});
