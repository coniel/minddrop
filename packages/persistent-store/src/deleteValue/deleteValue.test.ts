import { initializeCore } from '@minddrop/core';
import { cleanup } from '../test-utils';
import { getStoreValue } from '../getStoreValue';
import { setStore } from '../setStore';
import { usePersistentStore } from '../usePersistentStore';
import { deleteValue } from './deleteValue';

const core = initializeCore({ appId: 'app', extensionId: 'test' });

describe('deleteValue', () => {
  afterEach(cleanup);

  it('deletes a value from the store', () => {
    // Set the store
    setStore('global', core, { foo: 'bar' });

    // Delete a value from the store
    deleteValue('global', core, 'foo');

    // Deleted value should no longer exist
    expect(getStoreValue('global', core, 'foo')).toBeUndefined();
  });

  it("dispatches a 'persistent-store:update-global' event", (done) => {
    // Set the extension's store
    setStore('global', core, { bar: 'foo', foo: 'bar' });

    // Get the original global store
    const before = usePersistentStore.getState().global;

    // Listen to 'persistent-store:update-global' events
    core.addEventListener('persistent-store:update-global', (payload) => {
      // Get the updated global store
      const after = usePersistentStore.getState().global;

      // Payload data should be an update object
      expect(payload.data.before).toEqual(before);
      expect(payload.data.after).toEqual(after);
      done();
    });

    // Delete a value from the store
    deleteValue('global', core, 'foo');
  });

  it("dispatches a 'persistent-store:update-local' event", (done) => {
    // Set the extension's store
    setStore('local', core, { bar: 'foo', foo: 'bar' });

    // Get the original local store
    const before = usePersistentStore.getState().local;

    // Listen to 'persistent-store:update-local' events
    core.addEventListener('persistent-store:update-local', (payload) => {
      // Get the updated local store
      const after = usePersistentStore.getState().local;

      // Payload data should be an update object
      expect(payload.data.before).toEqual(before);
      expect(payload.data.after).toEqual(after);
      done();
    });

    // Delete a value from the store
    deleteValue('local', core, 'foo');
  });
});
