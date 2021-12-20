import { initializeCore } from '@minddrop/core';
import { renderHook, act } from '@minddrop/test-utils';
import { onRun } from './persistent-store-extension';
import { PersistentStoreDocument } from '../types';
import { usePersistentStore } from '../usePersistentStore';

const core = initializeCore({
  appId: 'app',
  extensionId: 'persistent-store',
});

describe('persistent-store-extension', () => {
  describe('onRun', () => {
    afterEach(() => {
      core.unregisterResource('persistent-store:stores');
      act(() => {
        usePersistentStore.getState().clearChache('global');
        usePersistentStore.getState().clearChache('local');
      });
    });

    describe('global store resource', () => {
      it('loads data into the global store', () => {
        const { result } = renderHook(() => usePersistentStore().global);
        const data = { app: { topics: ['topic-id'] } };
        const doc: PersistentStoreDocument = {
          id: 'global-id',
          data,
        };

        onRun(core);

        act(() => {
          // Get the registered connector and run its onLoad method,
          // simulating an onLoad event from the srorage-adapter.
          const connector = core
            .getResourceConnectors()
            .find((c) => c.type === 'persistent-store:global-stores');
          connector.onLoad([doc]);
        });

        expect(result.current).toEqual(data);
      });

      it('works with no docs', () => {
        const { result } = renderHook(() => usePersistentStore().global);

        onRun(core);

        act(() => {
          // Get the registered connector and run its onLoad method,
          // simulating an onLoad event from the srorage-adapter.
          const connector = core
            .getResourceConnectors()
            .find((c) => c.type === 'persistent-store:global-stores');
          connector.onLoad([]);
        });

        expect(result.current).toEqual({});
      });
    });

    describe('local store resource', () => {
      it('loads data into the local store', () => {
        const { result } = renderHook(() => usePersistentStore().local);
        const data = { app: { sidebarWidth: 300 } };
        const doc1: PersistentStoreDocument = {
          id: 'other-app-id',
          data: {},
        };
        const doc2: PersistentStoreDocument = {
          id: core.appId,
          data,
        };

        onRun(core);

        act(() => {
          // Get the registered connector and run its onLoad method,
          // simulating an onLoad event from the srorage-adapter.
          const connector = core
            .getResourceConnectors()
            .find((c) => c.type === 'persistent-store:local-stores');
          connector.onLoad([doc1, doc2]);
        });

        expect(result.current).toEqual(data);
      });

      it('works with no store docs', () => {
        const { result } = renderHook(() => usePersistentStore().local);

        onRun(core);

        act(() => {
          // Get the registered connector and run its onLoad method,
          // simulating an onLoad event from the srorage-adapter.
          const connector = core
            .getResourceConnectors()
            .find((c) => c.type === 'persistent-store:local-stores');
          connector.onLoad([]);
        });

        expect(result.current).toEqual({});
      });
    });
  });
});
