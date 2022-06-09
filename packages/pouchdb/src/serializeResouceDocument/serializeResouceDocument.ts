import { ResourceDocument, RDData } from '@minddrop/resources';
import { DBResourceDocument } from '../types';

/**
 * Serializes a document for PouchDB compatibility.
 *
 * @param resource - The document to serialize.
 * @param type - The resource type.
 * @returns Serialized document.
 */
export function serializeResouceDocument<TData extends RDData = {}>(
  documet: ResourceDocument<TData>,
): DBResourceDocument {
  const serialized = {
    ...documet,
    _id: documet.id,
  };

  delete serialized.id;

  return serialized;
}
