import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { getStoreValue } from '../getStoreValue';
import { setStore } from '../setStore';
import { usePersistentStore } from '../usePersistentStore';
import { setValue } from './setValue';

const core = initializeCore({ appId: 'app', extensionId: 'test' });

describe('setValue', () => {
  afterEach(() => {
    act(() => {
      usePersistentStore.getState().clearChache('global');
      usePersistentStore.getState().clearChache('local');
    });
  });

  it('sets a value in an existing store', () => {
    act(() => {
      setStore('global', core, { foo: 'bar' });
      setValue('global', core, 'bar', 'foo');
    });

    expect(getStoreValue('global', core, 'bar')).toBe('foo');
  });

  it('sets a value in a non-existing store', () => {
    act(() => {
      setValue('global', core, 'bar', 'foo');
    });

    expect(getStoreValue('global', core, 'bar')).toBe('foo');
  });

  it("dispatches a 'persistent-store:update-global' event", (done) => {
    const data = { bar: 'foo' };

    function callback(payload) {
      expect(payload.data).toEqual({ test: data });
      done();
    }

    core.addEventListener('persistent-store:update-global', callback);

    act(() => {
      setValue('global', core, 'bar', 'foo');
    });
  });

  it("dispatches a 'persistent-store:update-local' event", (done) => {
    const data = { bar: 'foo' };

    function callback(payload) {
      expect(payload.data).toEqual({ test: data });
      done();
    }

    core.addEventListener('persistent-store:update-local', callback);

    act(() => {
      setValue('local', core, 'bar', 'foo');
    });
  });
});
