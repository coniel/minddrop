import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { FieldValue } from '@minddrop/utils';
import { getStoreValue } from '../getStoreValue';
import { setStore } from '../setStore';
import { usePersistentStore } from '../usePersistentStore';
import { setValue } from './setValue';

const core = initializeCore({ appId: 'app', extensionId: 'test' });
const core2 = initializeCore({ appId: 'app', extensionId: 'extension2' });

describe('setValue', () => {
  afterEach(() => {
    act(() => {
      usePersistentStore.getState().clearScope('global');
      usePersistentStore.getState().clearScope('local');
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

  it('supports FieldValues', () => {
    act(() => {
      setValue('global', core, 'foo', FieldValue.arrayUnion('foo'));
    });

    expect(getStoreValue('global', core, 'foo')).toEqual(['foo']);
  });

  it("dispatches a 'persistent-store:update-global' event", (done) => {
    const value = FieldValue.arrayUnion('foo');

    function callback(payload) {
      expect(payload.data).toEqual({
        before: { extension2: { bar: 'bar' } },
        after: {
          id: 'global-persistent-store',
          test: { foo: ['foo'] },
          extension2: { bar: 'bar' },
        },
        changes: { test: { foo: value } },
      });
      done();
    }

    act(() => {
      setValue('global', core2, 'bar', 'bar');
    });

    core.addEventListener('persistent-store:update-global', callback);

    act(() => {
      setValue('global', core, 'foo', value);
    });
  });

  it("dispatches a 'persistent-store:update-local' event", (done) => {
    const value = FieldValue.arrayUnion('foo');

    function callback(payload) {
      expect(payload.data).toEqual({
        before: {},
        after: { id: 'app', test: { foo: ['foo'] } },
        changes: { test: { foo: value } },
      });
      done();
    }

    core.addEventListener('persistent-store:update-local', callback);

    act(() => {
      setValue('local', core, 'foo', value);
    });
  });
});
