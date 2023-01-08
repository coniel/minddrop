import { Core } from '@minddrop/core';
/* import { createUpdate, InvalidParameterError } from '@minddrop/utils'; */
import {
  ResourceStore,
  ResourceTypeConfigsStore,
  TRDBaseData,
  TRDTypeData,
  TypedResourceDocument,
  TypedResourceConfig,
  TypedResourceDocumentData,
  ResourceConfig,
  ResourceDocument,
  TRDBaseDataSchema,
} from '../types';
/* import { ResourceDocumentChangesStore } from '../ResourceDocumentChangesStore'; */
/* import { */
/*   createChanges, */
/*   validateExternalUpdateData, */
/* } from '../updateResourceDocument'; */
import { getResourceDocument } from '../getResourceDocument';
import { getTypedResourceTypeConfig } from '../getTypedResourceTypeConfig';
/* import { validateTypedResourceDocument } from '../validateTypedResourceDocument'; */
import { runSchemaDeleteHooks } from '../runSchemaDeleteHooks';
import {
  generateResourceDocumentSchema,
  validateResourceDocument,
} from '../validation';
import {
  createChanges,
  validateExternalUpdateData,
} from '../updateResourceDocument';
import { createUpdate, FieldValue } from '@minddrop/utils';
import { validateTypedResourceDocument } from '../validateTypedResourceDocument';
import { ResourceDocumentChangesStore } from '../ResourceDocumentChangesStore';
import { runSchemaCreateHooks } from '../runSchemaCreateHooks';

/**
 * Converts a typed resource document from one type to another.
 * Dispatches a `[resource]:update` event.
 *
 * @param core - A MindDrop core instance.
 * @param store - The resource store.
 * @param typeConfigsStore - The resource type configs store.
 * @param config - The resource config.
 * @param documentId - The ID of the document to update.
 * @param newType - The type to which the resource document is being converted.
 * @returns The updated resource document.
 *
 * @throws ResourceNotFoundError
 * Thrown if the resource document does not exist.
 *
 * @throws ResourceValidationError
 * Thrown if the resulting resource data is invalid.
 */
export function convertTypedResourceDocument<
  TBaseData extends TRDBaseData,
  TTypeData extends TRDTypeData<TBaseData>,
>(
  core: Core,
  store: ResourceStore<TypedResourceDocument<TBaseData>>,
  typeConfigsStore: ResourceTypeConfigsStore<TBaseData, TTypeData>,
  config: TypedResourceConfig<TBaseData, TypedResourceDocument<TBaseData>>,
  documentId: string,
  newType: string,
): TypedResourceDocument<TBaseData, TTypeData> {
  // Get the resource document
  const document = getResourceDocument<
    TypedResourceDocumentData<TBaseData>,
    TypedResourceDocument<TBaseData>
  >(
    store,
    config as ResourceConfig<
      TypedResourceDocumentData<TBaseData>,
      TypedResourceDocument<TBaseData>
    >,
    documentId,
  );

  // Get original resource type config
  const originalTypeConfig = getTypedResourceTypeConfig(
    document.resource,
    typeConfigsStore,
    document.type,
  );

  // Get new resource type config
  const newTypeConfig = getTypedResourceTypeConfig(
    document.resource,
    typeConfigsStore,
    newType,
  );

  // Generate a schema for the core data
  const coreSchema = generateResourceDocumentSchema({});
  // Get the resource's base data schema
  const baseScehma = config.dataSchema || {};
  // Create a combined schema
  const coreAndBaseSchema = {
    ...coreSchema,
    ...baseScehma,
  } as TRDBaseDataSchema<TBaseData>;

  // Clone the document's core data
  const originalCoreData = Object.keys(document).reduce(
    (data, key) => (coreSchema[key] ? { ...data, [key]: document[key] } : data),
    {} as ResourceDocument<TBaseData>,
  );

  // Clone the document's base data
  const originalBaseData = Object.keys(document).reduce(
    (data, key) => (baseScehma[key] ? { ...data, [key]: document[key] } : data),
    {} as ResourceDocument<TBaseData>,
  );

  let newTypeData: Partial<TBaseData & TTypeData> = {};

  // Merge in the type's default data if provided
  if (newTypeConfig.defaultData) {
    newTypeData = { ...newTypeData, ...newTypeConfig.defaultData };
  }

  if (newTypeConfig.onCreate) {
    // Generate default type data using the new type's `onCreate`
    // callback if provided.
    const onCreateData = newTypeConfig.onCreate(core, {
      ...originalCoreData,
      ...originalBaseData,
      ...newTypeData,
    } as TypedResourceDocument<TBaseData, TTypeData>);

    // Pick out fields defined in base `dataSchema` and type
    // `dataSchema` from the data returned by `onCreate` so as
    // not to overwrite core values such as `createdAt` which
    // are also returned by `onCreate`.
    const dataFields = Object.keys(onCreateData).reduce(
      (data, key) =>
        (config.dataSchema && config.dataSchema[key]) ||
        (newTypeConfig.dataSchema && newTypeConfig.dataSchema[key])
          ? { ...data, [key]: onCreateData[key] }
          : data,
      {},
    );

    // Merge picked `onCreate` data into converted data
    newTypeData = {
      ...newTypeData,
      ...dataFields,
    };
  }

  if (newTypeConfig.onConvert) {
    // Generate conversion specific data using the new type's
    // `onConvert` callback if provided, passing in the original
    // document.
    newTypeData = {
      ...newTypeData,
      ...newTypeConfig.onConvert(core, document),
    };
  }

  // Ensure that no protected core fields such as `updatedAt`
  // were modified when creating the new docuemnt data.
  validateExternalUpdateData(newTypeData);

  // Set the new type
  newTypeData = {
    ...newTypeData,
    type: newType,
  };

  // Delete all type fields from the original document
  const clearOriginalTypeData = originalTypeConfig.dataSchema
    ? Object.keys(originalTypeConfig.dataSchema).reduce(
        (data, key) => ({
          ...data,
          [key]: FieldValue.delete(),
        }),
        {},
      )
    : {};

  // Create an update object which deletes original type data and
  // merges the converted data into cloned base and core data.
  const update = createUpdate<
    TypedResourceDocument<TBaseData, TTypeData>,
    TypedResourceDocument<TBaseData, TTypeData>
  >(
    document as TypedResourceDocument<TBaseData, TTypeData>,
    createChanges({
      ...clearOriginalTypeData,
      ...originalBaseData,
      ...newTypeData,
    }) as TypedResourceDocument<TBaseData, TTypeData>,
  );

  // Get the core and base resource data from the converted
  // document.
  const convertedCoreAndBaseData = Object.keys(update.after).reduce(
    (data, key) =>
      coreAndBaseSchema[key] ? { ...data, [key]: update.after[key] } : data,
    {} as TypedResourceDocument<TBaseData, TTypeData>,
  );

  // Validate the converted document's core and base data,
  // providing the original document's core and base data
  // to verify that no static fields such as 'createdAt'
  // have been modified.
  validateResourceDocument(
    config.resource,
    coreAndBaseSchema,
    convertedCoreAndBaseData,
    { ...originalCoreData, ...originalBaseData },
  );

  // Validate the converted document
  validateTypedResourceDocument(
    config.resource,
    coreAndBaseSchema,
    newTypeConfig.dataSchema,
    update.after,
  );

  // Set the converted document in the resource store
  store.set(update.after);

  // Add the document update to the document changes store
  ResourceDocumentChangesStore.addUpdated(documentId, update);

  // Run schema delete hooks on the original document
  runSchemaDeleteHooks(
    core,
    {
      ...baseScehma,
      ...(originalTypeConfig.dataSchema || {}),
    },
    document,
  );

  // Run schema create hooks on the converted document
  runSchemaCreateHooks(
    core,
    {
      ...baseScehma,
      ...(newTypeConfig.dataSchema || {}),
    },
    update.after,
  );

  // Dispatch a `[resource]:update` event
  core.dispatch(`${config.resource}:update`, update);

  // Return the converted document
  return update.after;
}
