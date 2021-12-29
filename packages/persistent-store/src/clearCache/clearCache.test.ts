import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { setStore } from '../setStore';
import { usePersistentStore } from '../usePersistentStore';
import { clearCache } from './clearCache';

const core = initializeCore({ appId: 'app', extensionId: 'test' });

describe('clearCache', () => {
  it('clears the store', () => {
    act(() => {
      setStore('global', core, { foo: 'bar' });
      clearCache('global');
    });

    expect(usePersistentStore.getState().global).toEqual({});
  });
});
