import { ipcRenderer, contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  db: {
    getAllDocs: () =>
      new Promise((resolve) => {
        ipcRenderer.once('db:all-docs', (event, data) => {
          resolve(data);
        });
        ipcRenderer.send('db:getAllDocs');
      }),

    add: async (type, data) => {
      ipcRenderer.send('db:add', { type, data });
    },

    update: async (id, data) => {
      ipcRenderer.send('db:update', { id, data });
    },

    delete: async (id) => {
      ipcRenderer.send('db:delete', id);
    },
  },
});
