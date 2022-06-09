/* eslint-disable no-console */
import { ResourceStorageAdaptersStore } from '../ResourceStorageAdaptersStore';
import { ResourceDocumentChangesStore } from '../types';

// Debounce timer
let timer: ReturnType<typeof setTimeout>;

/**
 * Runs storage adapters in a debounced manner by calling
 * their create, update, and delete, methods with recently
 * created, updated, and deleted documents after 1000 ms of
 * inactivity.
 *
 * @param store - The resource document changes store.
 */
export function runStorageAdapters(store: ResourceDocumentChangesStore): void {
  // Clear the timeout to debounce the run
  clearTimeout(timer);

  // Run the storage adapters after a timeout
  timer = setTimeout(() => {
    // Get the data from the store
    const { created, updated, deleted } = store;

    // Clear the store
    store.clear();

    // Get all registered storage adapters
    const adapters = ResourceStorageAdaptersStore.getAll();

    adapters.forEach((adapter) => {
      // Create `created` documents
      Object.values(created).forEach((document) => {
        try {
          adapter.create(document);
        } catch (error) {
          console.error(error);
        }
      });

      // Update `updated` documents
      Object.keys(updated).forEach((id) => {
        try {
          adapter.update(id, updated[id]);
        } catch (error) {
          console.error(error);
        }
      });

      // Delete `deleted` documents
      deleted.forEach((document) => {
        try {
          adapter.delete(document);
        } catch (error) {
          console.error(error);
        }
      });
    });
  }, 1000);
}
