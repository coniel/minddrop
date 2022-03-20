import { initializeCore } from '@minddrop/core';
import { cleanup } from '../test-utils';
import { onRun } from './persistent-store-extension';
import { usePersistentStore } from '../usePersistentStore';

const core = initializeCore({
  appId: 'app',
  extensionId: 'persistent-store',
});

describe('persistent-store-extension', () => {
  describe('onRun', () => {
    afterEach(cleanup);

    describe('global store resource', () => {
      it('loads data into the global store', () => {
        // The global store document
        const doc = {
          id: 'global-persistent-store',
          data: { app: { topics: ['topic-id'] } },
        };

        // Run the extension
        onRun(core);

        // Get the registered resource connector
        const connector = core
          .getResourceConnectors()
          .find((c) => c.type === 'persistent-store:global-stores');

        // Call the resource connector's onLoad method with the global store
        // document, simulating an onLoad event from the storage-adapter.
        connector.onLoad([doc]);

        // Should load the global store document into the store
        expect(usePersistentStore.getState().global).toEqual(doc);
      });

      it('works with no docs', () => {
        // Run the extension
        onRun(core);

        // Get the registered resource connector
        const connector = core
          .getResourceConnectors()
          .find((c) => c.type === 'persistent-store:global-stores');

        // Call the resource connector's onLoad method with no documents,
        // simulating an onLoad event from the storage-adapter.
        connector.onLoad([]);

        // Should keep default data in the store
        expect(usePersistentStore.getState().global).toEqual({
          id: null,
          data: {},
        });
      });

      it('updates the store on change', () => {
        // The updated global store document
        const updated = {
          id: 'global-persistent-store',
          data: { app: { topics: ['topic-id', 'topic-2-id'] } },
        };

        // Run the extension
        onRun(core);

        // Get the registered resource connector
        const connector = core
          .getResourceConnectors()
          .find((c) => c.type === 'persistent-store:global-stores');

        // Call the resource connector's onChange method with an updated global
        // store document, simulating an onChange event from the storage-adapter.
        connector.onChange(updated, false);

        // Should set the updated global store document in the store
        expect(usePersistentStore.getState().global).toEqual(updated);
      });
    });

    describe('local store resource', () => {
      it('loads data into the local store', () => {
        // The local store document for another application instance
        const doc1 = {
          id: 'other-app-id',
          data: {},
        };
        // The local store document for this application instance
        const doc2 = {
          id: core.appId,
          data: { app: { sidebarWidth: 300 } },
        };

        // Run the extension
        onRun(core);

        // Get the registered resource connector and run its onLoad method,
        // simulating an onLoad event from the storage-adapter.
        const connector = core
          .getResourceConnectors()
          .find((c) => c.type === 'persistent-store:local-stores');

        // Call the resource connector's onLoad method with multiple local store
        // documents, simulating an onLoad event from the storage-adapter.
        connector.onLoad([doc1, doc2]);

        // Should load the appropriate local store document into the store
        expect(usePersistentStore.getState().local).toEqual(doc2);
      });

      it('works with no store docs', () => {
        // Run the extension
        onRun(core);

        // Get the registered resource connector
        const connector = core
          .getResourceConnectors()
          .find((c) => c.type === 'persistent-store:local-stores');

        // Call the resource connector's onLoad method with no documents,
        // simulating an onLoad event from the storage-adapter.
        connector.onLoad([]);

        // Should keep default data in the store
        expect(usePersistentStore.getState().local).toEqual({
          id: null,
          data: {},
        });
      });
    });
  });
});
