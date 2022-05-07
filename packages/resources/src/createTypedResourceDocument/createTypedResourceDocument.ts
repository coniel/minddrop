import { Core } from '@minddrop/core';
import { ResourceTypeNotRegisteredError } from '../errors';
import { generateResourceDocument } from '../generateResourceDocument';
import {
  TypedResourceConfig,
  ResourceStore,
  ResourceTypeConfigsStore,
  TypedResourceDocument,
  RegisteredResourceTypeConfig,
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
  TTypeData,
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
  let document: TypedResourceDocument<TBaseData, TTypeData>;

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
  let baseDocument = generateResourceDocument<
    TBaseData,
    TypedResourceDocument<TBaseData>
  >(completeData);

  if (config.onCreate) {
    // Call the resource config's `onCreate` callback if defined
    baseDocument = config.onCreate(core, baseDocument);
  }

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

    // Merge the type's default data into the document and add the
    // type to create the typed document.
    document = {
      ...baseDocument,
      ...typeDefaultData,
      type,
    } as TypedResourceDocument<TBaseData, TTypeData>;
  }

  if (typeConfig.onCreate) {
    // Call the type config's `onCreate` callback if defined
    document = typeConfig.onCreate(core, document);
  }

  // Validate the document
  validateTypedResourceDocument(
    config.resource,
    config.dataSchema,
    typeConfig.dataSchema,
    document,
  );

  // Add the document to the store
  store.set(document);

  // Dispatch a `[resource]:create` event
  core.dispatch(`${config.resource}:create`, document);

  // Return the new document
  return document;
}
