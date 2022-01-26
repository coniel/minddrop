import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { useLocalPersistentStoreValue } from './useLocalPersistentStoreValue';
import { usePersistentStore } from '../usePersistentStore';

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

describe('useLocalStoreValue', () => {
  afterEach(() => {
    act(() => {
      usePersistentStore.getState().clearScope('local');
    });
  });

  it("returns the value from the extension's local data", () => {
    const { result } = renderHook(() =>
      useLocalPersistentStoreValue(core, 'foo'),
    );

    const data = { app: { foo: 'foo' } };

    act(() => {
      usePersistentStore.getState().load('local', data);
    });

    expect(result.current).toEqual(data.app.foo);
  });
});
