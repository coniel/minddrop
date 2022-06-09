import { ResourceDocument } from '@minddrop/resources';
import { deserializeResourceDocument } from '../deserializeResourceDocument';
import { ResourceDB } from '../types';

/**
 * Retrieves all documents from a PouchDB database
 * and returns them in deserialized form.
 *
 * @param db - A PouchDB database cotaining DBResourceDocuemnts.
 * @returns - A promise which resolves to an array of resource documents.
 */
export async function getAllDocs(db: ResourceDB): Promise<ResourceDocument[]> {
  // Get all documents from the database
  const allDocs = await db.allDocs({ include_docs: true });

  // Return the documents in deserialized form
  return allDocs.rows.map((row) => deserializeResourceDocument(row.doc));
}
