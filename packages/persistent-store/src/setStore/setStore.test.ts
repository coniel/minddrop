import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { getStore } from '../getStore';
import { usePersistentStore } from '../usePersistentStore';
import { setStore } from './setStore';

const core = initializeCore({ appId: 'app', extensionId: 'test' });
const core2 = initializeCore({ appId: 'app', extensionId: 'app' });

describe('setStore', () => {
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
});
