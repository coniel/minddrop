import { DBResourceDocument, ResourceDocument } from '../types';

/**
 * Serializes a document for PouchDB compatibility.
 *
 * @param resource The document to serialize.
 * @param type The resource type.
 * @returns Serialized document.
 */
export function serializeResouceDocument(
  resource: ResourceDocument,
  type: string,
): DBResourceDocument {
  const serialized = {
    ...resource,
    _id: resource.id,
    resourceType: type,
  };

  delete serialized.id;

  return serialized;
}
