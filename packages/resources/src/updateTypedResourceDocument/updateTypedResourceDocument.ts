import { Core } from '@minddrop/core';
import { createUpdate } from '@minddrop/utils';
import {
  RDDeleteUpdateData,
  ResourceStore,
  ResourceTypeConfigsStore,
  RDRestoreUpdateData,
  RDParentsUpdateData,
  TRDBaseData,
  TRDTypeData,
  TypedResourceDocument,
  TypedResourceConfig,
  TRDUpdate,
} from '../types';
import {
  createChanges,
  validateExternalUpdateData,
} from '../updateResourceDocument';
import { getResourceDocument } from '../getResourceDocument';
import { getTypedResourceTypeConfig } from '../getTypedResourceTypeConfig';
import { validateTypedResourceDocument } from '../validateTypedResourceDocument';
import { runSchemaUpdateHooks } from '../runSchemaUpdateHooks';

/**
 * Updates a typed resource document and dispatches a
 * `[resource]:update` event.
 *
 * @param core - A MindDrop core instance.
 * @param store - The resource store.
 * @param typeConfigsStore - The resource type configs store.
 * @param config - The resource config.
 * @param documentId - The ID of the document to update.
 * @param data - The update data.
 * @param isInternalUpdate - Whether the function is being called internally within the API.
 * @returns The updated resource document.
 *
 * @throws ResourceNotFoundError
 * Thrown if the resource document does not exist.
 *
 * @throws ResourceValidationError
 * Thrown if the resulting resource data is invalid.
 */
export function updateTypedResourceDocument<
  TBaseData extends TRDBaseData,
  TTypeData extends TRDTypeData<TBaseData>,
>(
  core: Core,
  store: ResourceStore<TypedResourceDocument<TBaseData>>,
  typeConfigsStore: ResourceTypeConfigsStore<TBaseData, TTypeData>,
  config: TypedResourceConfig<TBaseData, TypedResourceDocument<TBaseData>>,
  documentId: string,
  data: RDDeleteUpdateData | RDRestoreUpdateData | RDParentsUpdateData,
  isInternalUpdate: true,
): TypedResourceDocument<TBaseData, TTypeData>;
export function updateTypedResourceDocument<
  TBaseData extends TRDBaseData,
  TTypeData extends TRDTypeData<TBaseData>,
  TBaseUpdateData extends Partial<TBaseData>,
  TTypeUpdateData extends Partial<TTypeData>,
>(
  core: Core,
  store: ResourceStore<TypedResourceDocument<TBaseData>>,
  typeConfigsStore: ResourceTypeConfigsStore<TBaseData, TTypeData>,
  config: TypedResourceConfig<TBaseData, TypedResourceDocument<TBaseData>>,
  documentId: string,
  data: TBaseUpdateData & TTypeUpdateData,
): TypedResourceDocument<TBaseData, TTypeData>;
export function updateTypedResourceDocument<
  TBaseData extends TRDBaseData,
  TTypeData extends TRDTypeData<TBaseData>,
  TBaseUpdateData extends Partial<TBaseData>,
  TTypeUpdateData extends Partial<TTypeData>,
>(
  core: Core,
  store: ResourceStore<TypedResourceDocument<TBaseData, TTypeData>>,
  typeConfigsStore: ResourceTypeConfigsStore<TBaseData, TTypeData>,
  config: TypedResourceConfig<TBaseData, TypedResourceDocument<TBaseData>>,
  documentId: string,
  data:
    | (TBaseUpdateData & TTypeUpdateData)
    | RDDeleteUpdateData
    | RDRestoreUpdateData,
  isInternalUpdate?: true,
): TypedResourceDocument<TBaseData, TTypeData> {
  // Get the document from the store
  const document = getResourceDocument(store, config, documentId, true);
  // Get the type config
  const typeConfig = getTypedResourceTypeConfig(
    config.resource,
    typeConfigsStore,
    document.type,
  );

  // Get the type specific and base document update data
  const typeData: Partial<TTypeData> = {};
  const baseData:
    | Partial<TBaseData>
    | RDDeleteUpdateData
    | RDRestoreUpdateData = {};
  Object.keys(data).forEach((key) => {
    if (typeConfig.dataSchema && typeConfig.dataSchema[key]) {
      typeData[key] = data[key];
    } else {
      baseData[key] = data[key];
    }
  });

  if (!isInternalUpdate) {
    // Ensure that external updates do not include any
    // restricted fields.
    validateExternalUpdateData(data);
  }

  // Create an update using the provided base data and default
  // update data.
  let baseUpdate = createUpdate(
    document,
    createChanges(baseData),
  ) as TRDUpdate<TBaseData>;

  if (config.onUpdate) {
    // Call the config's `onUpdate` method which will return
    // a possibly modidfied version of the update data.
    const modifiedData = config.onUpdate(core, baseUpdate);

    // Recreate the update using the modified data
    baseUpdate = createUpdate(document, createChanges(modifiedData));
  }

  // Create an update using the document with updated base data
  // and the provided type specific data.
  const documentWithBaseUpdate = baseUpdate.after as TypedResourceDocument<
    TBaseData,
    TTypeData
  >;
  let update = createUpdate(documentWithBaseUpdate, typeData) as TRDUpdate<
    TBaseData,
    TTypeData
  >;

  if (typeConfig.onUpdate) {
    // Call the config's `onUpdate` method which will return
    // a possibly modidfied version of the update data.
    const modifiedData = typeConfig.onUpdate(core, update);

    update = createUpdate(documentWithBaseUpdate, {
      ...modifiedData,
      revision: baseUpdate.after.revision,
      updatedAt: baseUpdate.after.updatedAt,
    });
  }

  // Validate the updated document, providing the original
  // document to validate static fields.
  validateTypedResourceDocument(
    config.resource,
    config.dataSchema,
    typeConfig.dataSchema,
    update.after,
    document,
  );

  // Set the updated document in the store
  store.set(update.after);

  // Run schema update hooks
  runSchemaUpdateHooks(
    core,
    { ...config.dataSchema, ...typeConfig.dataSchema },
    document,
    update.after,
  );

  // Dispatch a `[resource]:update` event
  core.dispatch(`${config.resource}:update`, {
    before: document,
    after: update.after,
    changes: {
      ...baseUpdate.changes,
      ...update.changes,
    },
  });

  // Return the updated document
  return update.after;
}
