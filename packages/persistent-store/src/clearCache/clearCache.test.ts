import { initializeCore } from '@minddrop/core';
import { setStore } from '../setStore';
import { usePersistentStore } from '../usePersistentStore';
import { clearCache } from './clearCache';

const appCore = initializeCore({ appId: 'app', extensionId: 'app' });
const extensionCore = initializeCore({ appId: 'app', extensionId: 'test' });

describe('clearCache', () => {
  it('clears the global store', () => {
    // Set the app global store
    setStore('global', appCore, { foo: 'bar' });
    // Set an extension's global store
    setStore('global', extensionCore, { foo: 'bar' });

    // Clear the global store
    clearCache('global');

    // Should clear all global store data
    expect(usePersistentStore.getState().global.data).toEqual({});
  });

  it('clears the local store', () => {
    // Set the app local store
    setStore('local', appCore, { foo: 'bar' });
    // Set an extension's local store
    setStore('local', extensionCore, { foo: 'bar' });

    // Clear the local store
    clearCache('local');

    // Should clear all local store data
    expect(usePersistentStore.getState().local.data).toEqual({});
  });
});
