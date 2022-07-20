import { Core } from '@minddrop/core';
import { FieldValidator, FieldValue } from '@minddrop/utils';
import { ResourceApisStore } from '../ResourceApisStore';
import {
  ResourceStore,
  ResourceConfig,
  ResourceDocument,
  ResourceIdsValidator,
  RDData,
} from '../types';
import { updateResourceDocument } from '../updateResourceDocument';

/**
 * Ensures that a document's referenced resource IDs
 * point to existing documentsm removing any invalid
 * references.
 *
 * @param core - A MindDrop core instance.
 * @param store - The resource store.
 * @param config - The resource config.
 * @param documentId - The ID of the document to normalize.
 */
export function normalizeResourceDocument<
  TData extends RDData,
  TResourceDocument extends ResourceDocument<TData> = ResourceDocument<TData>,
>(
  core: Core,
  store: ResourceStore<TResourceDocument>,
  config: ResourceConfig<TData, TResourceDocument>,
  documentId: string,
): void {
  // Update to apply to the document
  const update: Partial<TData> = {};

  // Get the document to normalize
  const document = store.get(documentId);

  // Get the keys of 'resource-ids' type fields
  const resourceIdsFields = Object.entries(config.dataSchema).reduce(
    (fields, [key, validator]: [string, FieldValidator]) =>
      validator.type === 'resource-ids' ? [...fields, key] : fields,
    [],
  );

  resourceIdsFields.forEach((field) => {
    if (!document[field]) {
      // Do nothing if the field is not present
      return;
    }

    // Get the child resource config
    const childResource = ResourceApisStore.get(
      (config.dataSchema[field] as ResourceIdsValidator).resource,
    );

    // The IDs of child referenced documents which do not exist
    const missingChildren: string[] = [];

    if (childResource) {
      // Ensure that each referenced child document exists.
      // If not, add the ID to the missing children list.
      (document[field] as string[]).forEach((childId) => {
        if (!childResource.store.get(childId)) {
          missingChildren.push(childId);
        }
      });
    }

    if (missingChildren.length) {
      // If the field contains missing children, update
      // the field removing them.
      update[field] = FieldValue.arrayRemove(missingChildren);
    }
  });

  // Get the keys of 'resource-id' type fields
  const resourceIdFields = Object.entries(config.dataSchema).reduce(
    (fields, [key, validator]: [string, FieldValidator]) =>
      validator.type === 'resource-id' ? [...fields, key] : fields,
    [],
  );

  resourceIdFields.forEach((field) => {
    if (!document[field]) {
      // Do nothing if the field is not present
      return;
    }

    // Get the child resource config
    const childResource = ResourceApisStore.get(
      (config.dataSchema[field] as ResourceIdsValidator).resource,
    );

    // Ensure that the referenced child document exists.
    // If not, remove the field from the document.
    if (childResource && !childResource.store.get(document[field])) {
      update[field] = FieldValue.delete();
    }
  });

  if (Object.keys(update).length) {
    // If there are updates to apply, update the document
    updateResourceDocument(
      core,
      store,
      config,
      document.id,
      update,
      false,
      true,
    );
  }
}
