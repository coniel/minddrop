import { Core } from '@minddrop/core';
import { ResourceApisStore } from '../ResourceApisStore';
import {
  RDSchema,
  TRDSchema,
  ResourceDocument,
  ResourceReference,
} from '../types';

/**
 * Runs schema hooks on updated resource documents.
 *
 * @param core - A MindDrop core instance.
 * @param schema - The resource document schema.
 * @param document - The created resource document.
 */
export function runSchemaUpdateHooks(
  core: Core,
  schema: RDSchema<any> | TRDSchema<any, any>,
  originalDocument: ResourceDocument,
  updatedDocument: ResourceDocument,
): void {
  // Create a resource reference for the document
  const parentRef: ResourceReference = {
    resource: originalDocument.resource,
    id: originalDocument.id,
  };

  // Remove the document as a parent from resources referenced
  // via 'resource-id' and 'resource-ids' fields with the
  // 'addAsParent' option set to `true`.
  Object.keys(schema).forEach((key) => {
    const validator = schema[key];

    if (validator.type === 'resource-id' && validator.addAsParent) {
      // Get the referenced resource API
      const resource = ResourceApisStore.get(validator.resource);

      // Check if the value has changed
      if (updatedDocument[key] !== originalDocument[key]) {
        if (originalDocument[key]) {
          // Remove the document as a parent from the old child
          resource.removeParents(core, originalDocument[key], [parentRef]);
        }

        if (updatedDocument[key]) {
          // Add the document as a parent on the new child
          resource.addParents(core, updatedDocument[key], [parentRef]);
        }
      }
    } else if (validator.type === 'resource-ids' && validator.addAsParent) {
      // Get the referenced resource API
      const resource = ResourceApisStore.get(validator.resource);

      // Get the original and updated resource IDs
      const original: string[] = originalDocument[key] || [];
      const updated: string[] = updatedDocument[key] || [];

      // Get the added and removed resource IDs
      const added = !originalDocument[key]
        ? updated
        : updated.filter((id) => !original.includes(id));
      const removed = !updatedDocument[key]
        ? original
        : original.filter((id) => !updated.includes(id));

      // Add the document as a parent on added child resources
      added.forEach((id) => {
        resource.addParents(core, id, [parentRef]);
      });

      // Remove the document as a parent from removed child resources
      removed.forEach((id) => {
        resource.removeParents(core, id, [parentRef]);
      });
    }
  });
}
