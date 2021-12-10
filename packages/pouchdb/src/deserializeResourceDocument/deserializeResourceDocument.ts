/* eslint-disable no-underscore-dangle */
import { ResourceDocument, DBResourceDocument } from '../types';

/**
 * Deserializes a PouchDB resource document into its
 * original form.
 *
 * @param resource The document to deserialize.
 * @returns Deserialized document.
 */
export function deserializeResourceDocument(
  doc: DBResourceDocument,
): ResourceDocument {
  const cleaned = { ...doc, id: doc._id };

  delete cleaned._id;
  delete cleaned._rev;
  delete cleaned._deleted;
  delete cleaned.resourceType;

  return cleaned;
}
