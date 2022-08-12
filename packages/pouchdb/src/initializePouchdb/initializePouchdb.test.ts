/* eslint-disable no-underscore-dangle */
import { Resources } from '@minddrop/resources';
import PouchDB from 'pouchdb';
import { deserializeResourceDocument } from '../deserializeResourceDocument';
import { serializeResouceDocument } from '../serializeResouceDocument';
import { ResourceDB } from '../types';
import { initializePouchdb } from './initializePouchdb';

interface Data {
  foo: string;
}

const document1 = Resources.generateDocument<Data>('tests:test', {
  foo: 'document-1',
});
const document2 = Resources.generateDocument<Data>('tests:test', {
  foo: 'document-2',
});

describe('initiaizePouchdb', () => {
  let db: ResourceDB;

  beforeEach(async () => {
    // Create a PouchDB instance
    db = new PouchDB('initiaizePouchdb');

    // Load a test document into the database
    await db.put(serializeResouceDocument(document1));
  });

  afterEach(async () => {
    // Destroy the PouchDB instance
    await db.destroy();

    // Clear all mock
    jest.clearAllMocks();
  });

  it('adds new documents to the database', async () => {
    // Initialize a database API instance
    const api = initializePouchdb(db);

    // Add the document to the database
    api.add(document2);

    // Get the document from the database
    const dbDocument = await db.get(document2.id);

    // Should have inserted the document
    expect(deserializeResourceDocument(dbDocument)).toEqual(
      expect.objectContaining(document2),
    );
    // Database document should be serialized
    expect(dbDocument._id).toBe(document2.id);
    expect(dbDocument.id).not.toBeDefined();
  });

  it('updates documents in the database', (done) => {
    // Initialize a database API instance
    const api = initializePouchdb(db);

    // Update a document in the database
    api.update<Data>({ ...document1, foo: 'updated' });

    setTimeout(async () => {
      // Get the document from the database
      const dbDocument = await db.get<Data>(document1.id);

      // Database document should be updated
      expect(deserializeResourceDocument(dbDocument)).toEqual(
        expect.objectContaining({ ...document1, foo: 'updated' }),
      );
      // Database document should be serialized
      expect(dbDocument._id).toBe(document1.id);
      expect(dbDocument.id).not.toBeDefined();
      done();
    }, 200);
  });

  it('deletes documents in the database', (done) => {
    // Initialize a database API instance
    const api = initializePouchdb(db);

    // Delete a document from the database
    api.delete(document1.id);

    setTimeout(async () => {
      try {
        // Atempt to get the deleted document
        await db.get(document1.id);
      } catch (err) {
        // Should throw an error
        expect(err.message).toBe('missing');
        done();
      }
    }, 200);
  });
});
