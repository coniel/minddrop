import { app, ipcMain } from 'electron';
import PouchDB from 'pouchdb';
import {
  DBResourceDocument,
  initializePouchDB,
  ResourceDocument,
} from '@minddrop/pouchdb';

export function initializeDatabase() {
  const appDataDirectory = app.getPath('userData');
  let dbFilePath = `${appDataDirectory}/db/`;

  if (process.env.NODE_ENV === 'development') {
    dbFilePath = '.db';
  }

  // Create the database
  const db = new PouchDB<DBResourceDocument>(dbFilePath);
  // Initialize the database API
  const dbApi = initializePouchDB(db);

  // Fetch all documents listener
  ipcMain.on('db:getAllDocs', async (event) => {
    const docs = await dbApi.getAllDocs();
    event.reply('db:all-docs', docs);
  });

  // Add document listener
  ipcMain.on(
    'db:add',
    async (event, payload: { type: string; data: ResourceDocument }) => {
      dbApi.add(payload.type, payload.data);
    },
  );

  // Update document listener
  ipcMain.on(
    'db:update',
    async (event, payload: { id: string; data: ResourceDocument }) => {
      dbApi.update(payload.id, payload.data);
    },
  );

  // Delete document listener
  ipcMain.on('db:delete', async (event, id) => {
    dbApi.delete(id);
  });
}
