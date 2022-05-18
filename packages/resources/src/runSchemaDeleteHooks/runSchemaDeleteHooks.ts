import { Core } from '@minddrop/core';
import { ResourceApisStore } from '../ResourceApisStore';
import {
  RDSchema,
  TRDSchema,
  ResourceDocument,
  ResourceReference,
} from '../types';

/**
 * Runs schema hooks on deleted resource documents.
 *
 * @param core - A MindDrop core instance.
 * @param schema - The resource document schema.
 * @param document - The created resource document.
 */
export function runSchemaDeleteHooks(
  core: Core,
  schema: RDSchema<any> | TRDSchema<any, any>,
  document: ResourceDocument,
): void {
  // Create a resource reference for the document
  const parentRef: ResourceReference = {
    resource: document.resource,
    id: document.id,
  };

  // Remove the document as a parent from resources referenced
  // via 'resource-id' and 'resource-ids' fields with the
  // 'addAsParent' option set to `true`.
  Object.keys(schema).forEach((key) => {
    const validator = schema[key];

    if (validator.type === 'resource-id' && validator.addAsParent) {
      // Get the referenced resource API
      const resource = ResourceApisStore.get(validator.resource);

      // Get the referenced document ID
      const referencedDocumentId = document[key] as string | undefined;

      if (referencedDocumentId) {
        // Add the document as a parent on the referenced document
        resource.removeParents(core, document[key], [parentRef]);
      }
    } else if (validator.type === 'resource-ids' && validator.addAsParent) {
      // Get the referenced resource API
      const resource = ResourceApisStore.get(validator.resource);

      // Get the referenced document IDs
      const referencedDocumentIds = document[key] as string[] | undefined;

      if (referencedDocumentIds) {
        // Add the document as a parent on each of the referenced documents
        referencedDocumentIds.forEach((id) => {
          resource.removeParents(core, id, [parentRef]);
        });
      }
    }
  });
}
