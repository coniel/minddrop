import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { usePersistentStore } from '../usePersistentStore';

export const core = initializeCore({ appId: 'app', extensionId: 'app' });

export function cleanup() {
  act(() => {
    // Unregister the resource connectors
    core.unregisterResource('persistent-store:local-stores');
    core.unregisterResource('persistent-store:global-stores');

    // Clear the store
    usePersistentStore.getState().clearScope('global');
    usePersistentStore.getState().clearScope('local');
  });
}
