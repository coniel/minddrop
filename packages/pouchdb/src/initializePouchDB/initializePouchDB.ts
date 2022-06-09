import { serializeResouceDocument } from '../serializeResouceDocument';
import { getAllDocs } from '../getAllDocs';
import { ResourceDB } from '../types';
import { DBApi } from '../types';

/**
 * Returns a simplified API for managing documents
 * in a given PouchDB database.
 *
 * @param db - The PouchDB database instance.
 * @returns Simplified database API.
 */
export function initializePouchdb(db: ResourceDB): DBApi {
  return {
    getAll: () => getAllDocs(db),
    add: (document) => {
      // Add the new document to the database
      db.put(serializeResouceDocument(document));
    },
    update: async (document) => {
      // Get the document from the database
      const dbDocument = await db.get(document.id);

      // Update the document in the database
      await db.put(
        serializeResouceDocument({
          ...dbDocument,
          ...document,
        }),
      );
    },
    delete: async (id) => {
      // Get the document from the database
      const dbDocument = await db.get(id);

      // Delete the document in the database
      await db.put({
        ...dbDocument,
        _deleted: true,
      });
    },
  };
}
