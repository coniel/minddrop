import { Core } from '@minddrop/core';
import { ResourceTypeNotRegisteredError } from '../errors';
import { generateResourceDocument } from '../generateResourceDocument';
import { ResourceDocumentChangesStore } from '../ResourceDocumentChangesStore';
import { runSchemaCreateHooks } from '../runSchemaCreateHooks';
import {
  TypedResourceConfig,
  ResourceStore,
  ResourceTypeConfigsStore,
  TypedResourceDocument,
  RegisteredResourceTypeConfig,
  TRDTypeData,
} from '../types';
import { validateTypedResourceDocument } from '../validateTypedResourceDocument';

/**
 * Creates a new resource document of the given type
 * and dispatches a `[resource]:create` event.
 *
 * @param core - A MindDrop core instance.
 * @param store - The resource store.
 * @param typeConfigsStore - The resource type configs store.
 * @param config - The resource config.
 * @param type - The resource type.
 * @param data - The document creation data.
 * @returns A new resource document.
 *
 * @throws ResourceValidationError
 * Thrown if the document data is invalid.
 */
export function createTypedResourceDocument<
  TBaseData,
  TTypeData extends TRDTypeData<TBaseData>,
  TBaseCreateData,
  TTypeCreateData,
>(
  core: Core,
  store: ResourceStore<TypedResourceDocument<TBaseData>>,
  typeConfigsStore: ResourceTypeConfigsStore<TBaseData>,
  config: TypedResourceConfig<TBaseData, TypedResourceDocument<TBaseData>>,
  type: string,
  data?: TBaseCreateData & TTypeCreateData,
): TypedResourceDocument<TBaseData, TTypeData> {
  let document: TypedResourceDocument<TBaseData, TTypeData | {}>;

  // Get the type's config object
  const typeConfig =
    typeConfigsStore.get<RegisteredResourceTypeConfig<TBaseData, TTypeData>>(
      type,
    );

  // Ensure that the resource type is registered
  if (!typeConfig) {
    throw new ResourceTypeNotRegisteredError(config.resource, type);
  }

  // Merge the base resource's default data and the provided data
  // to create the base document data.
  const completeData = {
    ...config.defaultData,
    ...data,
  } as unknown as TBaseData;

  // Generate a base document using the complete data
  document = generateResourceDocument<
    TBaseData,
    TypedResourceDocument<TBaseData>
  >(config.resource, completeData);

  if (config.onCreate) {
    // Call the resource config's `onCreate` callback if defined
    document = config.onCreate(core, { ...document, type });
  }

  // Add the type to create the typed document
  let typedDocument = {
    ...document,
    type,
  } as unknown as TypedResourceDocument<TBaseData, TTypeData>;

  if (typeConfig.defaultData) {
    // Get the type's default data for fields which were not
    // provided in the `data` argument.
    const typeDefaultData = Object.keys(typeConfig.defaultData).reduce(
      (defaultData, key) =>
        !data || !data[key]
          ? { ...defaultData, [key]: typeConfig.defaultData[key] }
          : defaultData,
      {},
    );

    // Merge the type's default data into the document
    typedDocument = {
      ...typedDocument,
      ...typeDefaultData,
    } as unknown as TypedResourceDocument<TBaseData, TTypeData>;
  }

  if (typeConfig.onCreate) {
    // Call the type config's `onCreate` callback if defined
    typedDocument = typeConfig.onCreate(core, typedDocument);
  }

  // Validate the document
  validateTypedResourceDocument(
    config.resource,
    config.dataSchema,
    typeConfig.dataSchema,
    typedDocument,
  );

  // Add the document to the resource store
  store.set(typedDocument);

  // Add the document to the changes store as a
  // created document.
  ResourceDocumentChangesStore.addCreated(typedDocument);

  // Run schema create hooks
  runSchemaCreateHooks(
    core,
    { ...config.dataSchema, ...typeConfig.dataSchema },
    typedDocument,
  );

  // Dispatch a `[resource]:create` event
  core.dispatch(`${config.resource}:create`, typedDocument);

  // Return the new document
  return typedDocument;
}
