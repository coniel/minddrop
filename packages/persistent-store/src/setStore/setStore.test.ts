import { initializeCore } from '@minddrop/core';
import { cleanup } from '../test-utils';
import { getStore } from '../getStore';
import { usePersistentStore } from '../usePersistentStore';
import { setStore } from './setStore';

const appCore = initializeCore({ appId: 'app', extensionId: 'app' });
const extensionCore = initializeCore({ appId: 'app', extensionId: 'test' });

describe('setStore', () => {
  afterEach(cleanup);

  it("sets an extension's store", () => {
    // The existing store data
    const store = { id: 'doc-id', data: { app: { foo: 'foo' } } };
    // The new extension's store data
    const data = { foo: 'foo' };

    // Load in the existing store data
    usePersistentStore.getState().load('global', store);

    // Set the extension's store
    setStore('global', extensionCore, data);

    // Should set the extension's store
    expect(getStore('global', extensionCore)).toEqual(data);
    // Should preserve the existing store data
    expect(getStore('global', appCore)).toEqual(store.data.app);
  });

  it("dispatches a 'persistent-store:update-global' event", (done) => {
    // The original global store
    const before = usePersistentStore.getState().global;

    // Listen to 'persistent-store:update-global' events
    extensionCore.addEventListener(
      'persistent-store:update-global',
      (payload) => {
        // The updated global store
        const after = usePersistentStore.getState().global;

        // Payload data should be an update object
        expect(payload.data.before).toEqual(before);
        expect(payload.data.after).toEqual(after);
        done();
      },
    );

    // Set a new extension's global store
    setStore('global', extensionCore, { foo: 'foo' });
  });

  it("dispatches a 'persistent-store:update-local' event", (done) => {
    // The original local store
    const before = usePersistentStore.getState().local;

    // Listen to 'persistent-store:update-local' events
    extensionCore.addEventListener(
      'persistent-store:update-local',
      (payload) => {
        // The updated local store
        const after = usePersistentStore.getState().local;

        // Payload data should be an update object
        expect(payload.data.before).toEqual(before);
        expect(payload.data.after).toEqual(after);
        done();
      },
    );

    // Set a new extension's local store
    setStore('local', extensionCore, { foo: 'foo' });
  });
});
