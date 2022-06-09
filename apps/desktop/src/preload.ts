import { ResourceStorageAdapterConfig } from '@minddrop/resources';
import { ipcRenderer, contextBridge } from 'electron';

const pouchdbStorageAdapter: ResourceStorageAdapterConfig = {
  id: 'minddrop:pouchdb',
  initialize: (syncApi) => {
    // Listen to 'db:set' events
    ipcRenderer.on('db:set', (event, data) => {
      // Set the added/updated document
      return syncApi.set(JSON.parse(data));
    });

    // Listen to 'db:remove' events
    ipcRenderer.on('db:remove', (event, data) => {
      // Remove the deleted document
      syncApi.remove(JSON.parse(data));
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

contextBridge.exposeInMainWorld(
  'resourceStorageAdapter',
  pouchdbStorageAdapter,
);

contextBridge.exposeInMainWorld('files', {
  getAttachmentsPath: () => ipcRenderer.sendSync('files:getAttachmentsPath'),

  get: (id) =>
    new Promise((resolve) => {
      const callback = (event, data) => {
        if (data.id === id) {
          resolve(data);
          ipcRenderer.removeListener('files:got', callback);
        }
      };

      ipcRenderer.on('files:got', callback);

      ipcRenderer.send('files:get', id);
    }),

  create: (file, id) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      ipcRenderer.send('files:create', { base64: reader.result, id });
    };
  },
});
