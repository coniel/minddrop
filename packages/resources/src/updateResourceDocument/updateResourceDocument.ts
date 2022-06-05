import { Core } from '@minddrop/core';
import { createUpdate, generateId } from '@minddrop/utils';
import {
  ResourceDocumentNotFoundError,
  ResourceValidationError,
} from '../errors';
import { runSchemaUpdateHooks } from '../runSchemaUpdateHooks';
import {
  RDDeleteUpdateData,
  ResourceConfig,
  ResourceDocument,
  RDChanges,
  RDData,
  RDUpdateData,
  ResourceStore,
  RDRestoreUpdateData,
  RDParentsUpdateData,
} from '../types';
import { validateResourceDocument } from '../validation';

/**
 * Generates a reource document changes object from
 * the provided data.
 *
 * @param data The update data.
 * @returns Resource document changes.
 */
export function createChanges<TData>(
  data: RDUpdateData<TData>,
): RDChanges<TData> {
  return {
    revision: generateId(),
    ...data,
    updatedAt: new Date(),
  };
}

/**
 * Validates data from external updates, ensuring that
 * internal update only fields are not included.
 *
 * @param data - The update data
 *
 * @throws ResourceValidationError
 * Thrown if the update data contains restricted fields.
 */
export function validateExternalUpdateData<TData>(data: TData) {
  // Ensure that the update data does not contain properties which
  // can only be updated by the internal API.
  const internalFields = Object.keys(data).filter((key) =>
    ['updatedAt', 'deleted', 'deletedAt', 'parents'].includes(key),
  );

  if (internalFields.length) {
    // Throw an `ResourceValidationError` if the data contains any
    // internal only properties.
    throw new ResourceValidationError(
      `${
        internalFields.length > 1 ? 'properties' : 'property'
      } '${internalFields.join("', '")}' cannot be updated directly`,
    );
  }
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
 * @param isInternalUpdate Whether the function is being called internally within the API.
 */
export function updateResourceDocument<
  TData extends RDData,
  TResourceDocument extends ResourceDocument<TData> = ResourceDocument<TData>,
>(
  core: Core,
  store: ResourceStore<TResourceDocument>,
  config: ResourceConfig<TData, TResourceDocument>,
  documentId: string,
  data: RDDeleteUpdateData | RDRestoreUpdateData | RDParentsUpdateData,
  isInternalUpdate: true,
): TResourceDocument;
export function updateResourceDocument<
  TData extends RDData,
  TResourceDocument extends ResourceDocument<TData>,
>(
  core: Core,
  store: ResourceStore<TResourceDocument>,
  config: ResourceConfig<TData, TResourceDocument>,
  documentId: string,
  data: Partial<TData>,
): TResourceDocument;
export function updateResourceDocument<
  TData extends RDData,
  TResourceDocument extends ResourceDocument<TData>,
>(
  core: Core,
  store: ResourceStore<TResourceDocument>,
  config: ResourceConfig<TData, TResourceDocument>,
  documentId: string,
  data: RDUpdateData<TData>,
  isInternalUpdate?: true,
): TResourceDocument {
  // Get the document from the store
  const document = store.get(documentId);

  if (!document) {
    // Throw a `ResourceDocumentNotFoundError` if the document
    // does not exist.
    throw new ResourceDocumentNotFoundError(config.resource, documentId);
  }

  if (!isInternalUpdate) {
    // Ensure that external updates do not include any
    // restricted fields.
    validateExternalUpdateData(data);
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
  // document to validate static fields.
  validateResourceDocument(
    config.resource,
    config.dataSchema,
    update.after,
    update.before,
  );

  // Set the updated document in the store
  store.set(update.after);

  // Run schema update hooks
  runSchemaUpdateHooks(core, config.dataSchema, update.before, update.after);

  // Dispatch a `[resource]:update` event
  core.dispatch(`${config.resource}:update`, update);

  // Return the updated document
  return update.after;
}
