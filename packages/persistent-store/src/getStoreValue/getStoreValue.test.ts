import { act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { getStoreValue } from './getStoreValue';
import { usePersistentStore } from '../usePersistentStore';

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

describe('getStoreValue', () => {
  afterEach(() => {
    act(() => {
      usePersistentStore.getState().clearScope('global');
      usePersistentStore.getState().clearScope('local');
    });
  });

  it('returns the value', () => {
    const data = { app: { foo: 'foo' } };

    act(() => {
      usePersistentStore.getState().load('local', data);
    });

    const result = getStoreValue('local', core, 'foo');

    expect(result).toEqual(data.app.foo);
  });

  it('returns undefined if store does not exist', () => {
    const result = getStoreValue('global', core, 'foo');

    expect(result).toBeUndefined();
  });

  it('returns default value if store does not exist', () => {
    const result = getStoreValue('global', core, 'foo', 'bar');

    expect(result).toEqual('bar');
  });

  it('returns default value if value is not set', () => {
    const data = { app: {} };

    act(() => {
      usePersistentStore.getState().load('local', data);
    });

    const result = getStoreValue('global', core, 'foo', 'bar');

    expect(result).toEqual('bar');
  });
});
