import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { FieldValue } from '@minddrop/utils';
import { setStore } from '../setStore';
import { usePersistentStore } from '../usePersistentStore';
import { deleteStore } from './deleteStore';

const core = initializeCore({ appId: 'app', extensionId: 'test' });

describe('deleteStore', () => {
  afterEach(() => {
    act(() => {
      usePersistentStore.getState().clearScope('global');
      usePersistentStore.getState().clearScope('local');
    });
  });

  it("deletes the enxtension's store", () => {
    const data = { bar: 'foo', foo: 'bar' };

    act(() => {
      setStore('global', core, data);
      deleteStore('global', core);
    });

    expect(usePersistentStore.getState().global.test).toBeUndefined();
  });

  it("dispatches a 'persistent-store:update-global' event", (done) => {
    const data = { bar: 'foo', foo: 'bar' };

    function callback(payload) {
      expect(payload.data.test).toEqual(FieldValue.delete());
      done();
    }

    act(() => {
      setStore('global', core, data);
      core.addEventListener('persistent-store:update-global', callback);
      deleteStore('global', core);
    });
  });

  it("dispatches a 'persistent-store:update-local' event", (done) => {
    const data = { bar: 'foo', foo: 'bar' };

    function callback(payload) {
      expect(payload.data.test).toEqual(FieldValue.delete());
      done();
    }

    act(() => {
      setStore('local', core, data);
      core.addEventListener('persistent-store:update-local', callback);
      deleteStore('local', core);
    });
  });
});
