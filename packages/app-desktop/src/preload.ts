import { ipcRenderer, contextBridge } from 'electron';

contextBridge.exposeInMainWorld('db', {
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
});

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
