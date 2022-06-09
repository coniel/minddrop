import PouchDB from 'pouchdb';
import { Resources } from '@minddrop/resources';
import { serializeResouceDocument } from '../serializeResouceDocument';
import { DBResourceDocument, ResourceDB } from '../types';
import { getAllDocs } from './getAllDocs';

const document1 = Resources.generateDocument('tests:test', {});
const document2 = Resources.generateDocument('tests:test', {});

describe('getAllDocs', () => {
  let db: ResourceDB;

  beforeEach(() => {
    // Create a PouchDB instance
    db = new PouchDB<DBResourceDocument>(`getAllDocs-${new Date().getTime()}`);
  });

  afterEach(async () => {
    // Destroy the PouchDB instance
    await db.destroy();
  });

  it('retuns all resource docs in deserialized form', async () => {
    // Load test documents into the database
    await Promise.all([
      db.put(serializeResouceDocument(document1)),
      db.put(serializeResouceDocument(document2)),
    ]);

    // Get all documts
    const documents = await getAllDocs(db);

    // Should return an array containing all documents
    // in deserialized form.
    expect(documents.length).toBe(2);
    expect(documents.find((doc) => doc.id === document1.id)).toEqual(document1);
  });
});
