import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { useGlobalPersistentStoreValue } from './useGlobalPersistentStoreValue';
import { usePersistentStore } from '../usePersistentStore';

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

describe('useGlobalStoreValue', () => {
  afterEach(() => {
    act(() => {
      usePersistentStore.getState().clearScope('global');
    });
  });

  it("returns the value from the extension's global data", () => {
    const { result } = renderHook(() =>
      useGlobalPersistentStoreValue(core, 'foo'),
    );

    const data = { app: { foo: 'foo' } };

    act(() => {
      usePersistentStore.getState().load('global', data);
    });

    expect(result.current).toEqual(data.app.foo);
  });

  it('returns the default value if the value is not set', () => {
    const { result } = renderHook(() =>
      useGlobalPersistentStoreValue(core, 'bar', 'foo'),
    );

    expect(result.current).toEqual('foo');
  });
});
