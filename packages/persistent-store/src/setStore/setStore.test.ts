import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { getStore } from '../getStore';
import { usePersistentStore } from '../usePersistentStore';
import { setStore } from './setStore';

const core = initializeCore({ appId: 'app', extensionId: 'test' });
const core2 = initializeCore({ appId: 'app', extensionId: 'app' });

describe('setStore', () => {
  afterEach(() => {
    act(() => {
      usePersistentStore.getState().clearScope('global');
      usePersistentStore.getState().clearScope('local');
    });
  });

  it("sets an extension's store", () => {
    const existingData = { app: { foo: 'foo' } };
    const data = { foo: 'foo' };

    act(() => {
      usePersistentStore.getState().load('global', existingData);
      setStore('global', core, data);
    });

    const result = getStore('global', core);
    const existing = getStore('global', core2);

    expect(result).toEqual(data);
    expect(existing).toEqual(existingData.app);
  });

  it("dispatches a 'persistent-store:update-global' event", (done) => {
    const data = { foo: 'foo' };

    function callback(payload) {
      expect(payload.data).toEqual({ test: data });
      done();
    }

    core.addEventListener('persistent-store:update-global', callback);

    act(() => {
      setStore('global', core, data);
    });
  });

  it("dispatches a 'persistent-store:update-local' event", (done) => {
    const data = { foo: 'foo' };

    function callback(payload) {
      expect(payload.data).toEqual({ test: data });
      done();
    }

    core.addEventListener('persistent-store:update-local', callback);

    act(() => {
      setStore('local', core, data);
    });
  });
});
