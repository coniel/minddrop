import { runStorageAdapters } from '../runStorageAdapters';
import { ResourceDocumentChangesStore as ChangesStore } from '../types';

export const ResourceDocumentChangesStore: ChangesStore = {
  created: {},
  creationOrder: [],
  updated: {},
  deleted: [],

  addCreated: (document) => {
    // Add the document to `created`
    ResourceDocumentChangesStore.created[document.id] = document;

    // Add the document ID to the end of `creationOrder`
    ResourceDocumentChangesStore.creationOrder = [
      ...ResourceDocumentChangesStore.creationOrder,
      document.id,
    ];

    // Run storage adapters
    runStorageAdapters(ResourceDocumentChangesStore);
  },

  addUpdated: (id, update) => {
    if (ResourceDocumentChangesStore.created[id]) {
      // If the document was newly created, update
      // the `created` document's data.
      ResourceDocumentChangesStore.created[id] = update.after;
    } else {
      // Add the document update to `updated`
      ResourceDocumentChangesStore.updated[id] = update;
    }

    // Run storage adapters
    runStorageAdapters(ResourceDocumentChangesStore);
  },

  addDeleted: (document) => {
    ResourceDocumentChangesStore.deleted.push(document);

    if (ResourceDocumentChangesStore.created[document.id]) {
      // If the document was newly created, remove
      // it from `created`.
      delete ResourceDocumentChangesStore.created[document.id];
    }

    if (ResourceDocumentChangesStore.updated[document.id]) {
      // If the document was recently updated, remove
      // the update from `updated`.
      delete ResourceDocumentChangesStore.updated[document.id];
    }

    // Run storage adapters
    runStorageAdapters(ResourceDocumentChangesStore);
  },

  clear: () => {
    // Clear created documents
    ResourceDocumentChangesStore.created = {};
    // Clear creation order
    ResourceDocumentChangesStore.creationOrder = [];
    // Clear updated documents
    ResourceDocumentChangesStore.updated = {};
    // Clear deleted document IDs
    ResourceDocumentChangesStore.deleted = [];
  },
};
