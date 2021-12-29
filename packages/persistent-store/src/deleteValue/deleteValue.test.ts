import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { getStoreValue } from '../getStoreValue';
import { setStore } from '../setStore';
import { usePersistentStore } from '../usePersistentStore';
import { deleteValue } from './deleteValue';

const core = initializeCore({ appId: 'app', extensionId: 'test' });

describe('deleteValue', () => {
  afterEach(() => {
    act(() => {
      usePersistentStore.getState().clearChache('global');
      usePersistentStore.getState().clearChache('local');
    });
  });

  it('deletes a value from the store', () => {
    act(() => {
      setStore('global', core, { foo: 'bar' });
      deleteValue('global', core, 'foo');
    });

    expect(getStoreValue('global', core, 'foo')).toBeUndefined();
  });

  it("dispatches a 'persistent-store:update-global' event", (done) => {
    const data = { bar: 'foo', foo: 'bar' };

    function callback(payload) {
      expect(payload.data).toEqual({ test: { bar: 'foo' } });
      done();
    }

    core.addEventListener('persistent-store:update-global', callback);

    act(() => {
      setStore('global', core, data);
      deleteValue('global', core, 'foo');
    });
  });

  it("dispatches a 'persistent-store:update-local' event", (done) => {
    const data = { bar: 'foo', foo: 'bar' };

    function callback(payload) {
      expect(payload.data).toEqual({ test: { bar: 'foo' } });
      done();
    }

    core.addEventListener('persistent-store:update-local', callback);

    act(() => {
      setStore('local', core, data);
      deleteValue('local', core, 'foo');
    });
  });
});
