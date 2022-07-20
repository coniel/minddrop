import { app, ipcMain, BrowserWindow } from 'electron';
import PouchDB from 'pouchdb';
import { ResourceDocument } from '@minddrop/resources';
import { DBResourceDocument, initializePouchdb } from '@minddrop/pouchdb';

export function initializeDatabase(window: BrowserWindow) {
  const appDataDirectory = app.getPath('userData');
  let dbFilePath = `${appDataDirectory}/db/`;

  if (process.env.NODE_ENV === 'development') {
    dbFilePath = '.db';
  }

  // Create the database
  const db = new PouchDB<DBResourceDocument>(dbFilePath);
  // Initialize the database API
  const api = initializePouchdb(db);

  // Fetch all documents listener
  ipcMain.on('db:getAll', async (event) => {
    const docs = await api.getAll();
    event.reply('db:all-docs', docs);
  });

  // Add document listener
  ipcMain.on('db:create', async (event, document: ResourceDocument) => {
    api.add(document);
  });

  // Update document listener
  ipcMain.on('db:update', async (event, document: ResourceDocument) => {
    api.update(document);
  });

  // Delete document listener
  ipcMain.on('db:delete', async (event, id) => {
    api.delete(id);
  });

  db.changes<DBResourceDocument>({
    since: 'now',
    live: true,
    include_docs: true,
  }).on('change', (change) => {
    const { doc } = change;

    if (change.deleted) {
      // Remove the deleted document
      return window.webContents.send('db:remove', JSON.stringify(doc));
    }

    // Set the added/updated document
    return window.webContents.send('db:set', JSON.stringify(doc));
  });
}
