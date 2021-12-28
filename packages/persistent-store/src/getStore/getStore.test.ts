import { act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { getStore } from './getStore';
import { usePersistentStore } from '../usePersistentStore';

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

describe('getStore', () => {
  afterEach(() => {
    act(() => {
      usePersistentStore.getState().clearChache('global');
      usePersistentStore.getState().clearChache('local');
    });
  });

  it("returns the extension's data from the store scope", () => {
    const data = { app: { foo: 'foo' } };

    act(() => {
      usePersistentStore.getState().load('local', data);
    });

    const result = getStore('local', core);

    expect(result).toEqual(data.app);
  });

  it('returns an empty object if extension data is not set', () => {
    const result = getStore('global', core);

    expect(result).toEqual({});
  });
});
