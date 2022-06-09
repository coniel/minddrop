import { Core } from '@minddrop/core';
import { ResourceStorageAdaptersStore } from '../ResourceStorageAdaptersStore';
import { ResourceApisStore } from '../ResourceApisStore';
import { Resources } from '../Resources';

/**
 * Runs the resources extension.
 *
 * Initializes all registered storage adapters and
 * loads resource documents into registered resources.
 */
export async function onRun(core: Core): Promise<void> {
  // Get all registered storage adapters
  const storageAdapters = ResourceStorageAdaptersStore.getAll();

  await Promise.all(
    storageAdapters
      // Ignore adapters without a `initialize` callback
      .filter((adapter) => adapter.initialize)
      .map((adapter) =>
        adapter.initialize({
          set: (document) => {
            // Get the document resource API
            const resource = Resources.get(document.resource);

            if (resource.store.get(document.id)) {
              // If the document is present in the store,
              // set the modified version.
              resource.store.set(core, document);
            } else {
              // If the document is not present in the
              // store, add it in.
              resource.store.add(core, document);
            }
          },
          remove: (document) => {
            // Get the document resource API
            const resource = Resources.get(document.resource);

            // Remove the document from the store
            resource.store.remove(core, document.id);
          },
        }),
      ),
  );

  // Get all documents from the last registered storage adapter
  const allDocuments = await storageAdapters.slice(-1)[0].getAll();

  // Group documents by resource type
  const resourceDocuments = allDocuments.reduce(
    (rDocs, document) => ({
      ...rDocs,
      [document.resource]: rDocs[document.resource]
        ? [...rDocs[document.resource], document]
        : [document],
    }),
    {},
  );

  // Load documents into the appropriate resource
  ResourceApisStore.getAll().forEach((resource) => {
    resource.store.load(core, resourceDocuments[resource.resource] || []);
  });

  Resources.addEventListener(
    core,
    'resources:resource:register',
    ({ data }) => {
      async function loadResourceDocuments() {
        // Get all documents from the last registered storage adapter
        const allDocuments = await storageAdapters.slice(-1)[0].getAll();

        data.store.load(
          core,
          allDocuments.filter(
            (document) => document.resource === data.resource,
          ),
        );
      }

      loadResourceDocuments();
    },
  );
}

/**
 * Diables the resources extension.
 *
 * Clears all related stores and event listeners.
 */
export function onDisable(core: Core): void {
  // Clear the storage adapters store
  ResourceStorageAdaptersStore.clear();

  // Clear the resources store
  ResourceApisStore.clear();

  // Clear event liteners
  core.removeAllEventListeners();
}
