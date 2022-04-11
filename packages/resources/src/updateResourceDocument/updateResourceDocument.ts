import { Core } from '@minddrop/core';
import { createUpdate, generateId } from '@minddrop/utils';
import { ResourceDocumentNotFoundError } from '../errors';
import {
  ResourceConfig,
  ResourceDocument,
  ResourceDocumentChanges,
  ResourceStore,
} from '../types';
import { validateResourceDocument } from '../validation';

/**
 * Generates a reource document changes object from
 * the provided data.
 *
 * @param data The update data.
 * @returns Resource document changes.
 */
function createChanges<TData>(
  data: Partial<TData>,
): ResourceDocumentChanges<TData> {
  return {
    ...data,
    revision: generateId(),
    updatedAt: new Date(),
  };
}

/**
 * Updates a resource document and dispatches a
 * `[resource]:update` event.
 *
 * @param core A MindDrop core instance.
 * @param store The resource store.
 * @param config The resource config.
 * @param documentId The ID of the document to update.
 * @param data The update data.
 */
export function updateResourceDocument<TData>(
  core: Core,
  store: ResourceStore<ResourceDocument<TData>>,
  config: ResourceConfig<TData>,
  documentId: string,
  data: Partial<TData>,
): ResourceDocument<TData> {
  // Get the document from the store
  const document = store.get(documentId);

  if (!document) {
    // Throw a `ResourceNotFoundError` if the document does not exist
    throw new ResourceDocumentNotFoundError(config.resource, documentId);
  }

  // Create an update using the provided data and default
  // update data.
  let update = createUpdate(document, createChanges(data));

  if (config.onUpdate) {
    // Call the config's `onUpdate` method which will return
    // a possibly modidfied version of the update data.
    const modifiedData = config.onUpdate(core, update);

    // Recreate the update using the modified data
    update = createUpdate(document, createChanges(modifiedData));
  }

  // Validate the updated document, providing the original
  // document to validate protected fields.
  validateResourceDocument(
    config.resource,
    config.dataSchema,
    update.after,
    update.before,
  );

  // Set the updated document in the store
  store.set(update.after);

  // Dispatch a `[resource]:update` event
  core.dispatch(`${config.resource}:update`, update);

  // Return the updated document
  return update.after;
}
