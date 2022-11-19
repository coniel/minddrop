import { deserializeResourceDocument } from '@minddrop/pouchdb';
import { ResourceStorageAdapterConfig } from '@minddrop/resources';
import { ipcRenderer, contextBridge } from 'electron';

const ResourceStorageAdapter: ResourceStorageAdapterConfig = {
  id: 'minddrop:resource-storage-adapter:pouchdb',
  initialize: (syncApi) => {
    // Listen to 'db:set' events
    ipcRenderer.on('db:set', (event, data) =>
      // Set the added/updated document
      syncApi.set(deserializeResourceDocument(JSON.parse(data))),
    );

    // Listen to 'db:remove' events
    ipcRenderer.on('db:remove', (event, data) => {
      // Remove the deleted document
      syncApi.remove(deserializeResourceDocument(JSON.parse(data)));
    });
  },
  getAll: () =>
    new Promise((resolve) => {
      // Listen for the 'db:all-docs' response
      ipcRenderer.once('db:all-docs', (event, data) => {
        resolve(data);
      });

      // Send a 'db:getAll' request
      ipcRenderer.send('db:getAll');
    }),
  create: async (document) => {
    ipcRenderer.send('db:create', document);
  },
  update: async (id, update) => {
    ipcRenderer.send('db:update', update.after);
  },
  delete: async (document) => {
    ipcRenderer.send('db:delete', document.id);
  },
};

// Expose the adapter in the renderer
contextBridge.exposeInMainWorld(
  'ResourceStorageAdapter',
  ResourceStorageAdapter,
);
