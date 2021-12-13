import { deserializeResourceDocument } from '../deserializeResourceDocument';
import { DBResourceDocument, GroupedResources } from '../types';

/**
 * Groups docuemnts by resource type and deserializes them.
 *
 * @param docs The documents to group.
 * @returns A `{ resourceType: ResourceDocument }` map of the documents.
 */
export function groupDocsByResourceType(
  docs: DBResourceDocument[],
): GroupedResources {
  return docs.reduce((map, doc) => {
    const nextMap = { ...map };

    // If this is the first doc of this type,
    // create an array for the type.
    if (!map[doc.resourceType]) {
      nextMap[doc.resourceType] = [];
    }

    // Clean and add the doc to the type array
    nextMap[doc.resourceType].push(deserializeResourceDocument(doc));

    return nextMap;
  }, {});
}
