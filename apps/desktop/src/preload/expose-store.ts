import { ipcRenderer, contextBridge } from 'electron';

function getStoreValue(key: string): Promise<string> {
  return ipcRenderer.invoke('store:value:get', key);
}

// Expose the getStoreValue function in the renderer
contextBridge.exposeInMainWorld('getStoreValue', getStoreValue);
