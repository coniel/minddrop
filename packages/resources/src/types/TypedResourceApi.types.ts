import { Core } from '@minddrop/core';
import { ResourceApi } from './ResourceApi.types';
import {
  ResourceTypeConfig,
  TypedResourceTypeConfigsStore,
} from './ResourceTypeConfig.types';
import {
  TypedResourceDocument,
  TypedResourceDocumentBaseCustomData,
  TypedResourceDocumentTypeCustomData,
} from './TypedResourceDocument.types';

/**
 * The API for a typed resource.
 *
 * @param TBaseData The resource's custom data.
 * @param TCreateData The data that can be supplied to the `create` method when creating a new resource document. Should be a subset of `TBaseData`.
 * @param TUpdateData The data that can be supplied to the `update` method when updating a resource document. Should be a subset of `TBaseData`.
 */
export interface TypedResourceApi<
  TBaseData extends TypedResourceDocumentBaseCustomData,
  TCreateData extends Partial<TBaseData> & TypedResourceDocumentBaseCustomData,
  TUpdateData extends Partial<TBaseData> & TypedResourceDocumentBaseCustomData,
> extends Omit<ResourceApi<TBaseData, TCreateData, TUpdateData>, 'create'> {
  /**
   * Registers a new resource type and dispatches a
   * `[resource]:register-type` event.
   *
   * @param core - A MindDrop core instance.
   * @param config - The config of the resource type to register.
   *
   * @throws InvalidResourceSchemaError
   * Thrown if the type's data schema is invalid.
   */
  register<
    TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData> = {},
  >(
    core: Core,
    config: ResourceTypeConfig<TBaseData, TTypeData>,
  ): void;

  /**
   * Unregisters a resource type and dispatches a
   * `[resource]:unregister-type` event.
   *
   * @param core - A MindDrop core instance.
   * @param config - The config of the resource type to unregister.
   *
   * @throws ResourceTypeNotRegistered
   * Thrown if the resource type is not registered.
   */
  unregister<
    TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData> = {},
  >(
    core: Core,
    config: ResourceTypeConfig<TBaseData, TTypeData>,
  ): void;

  /**
   * Returns a registered type's config object.
   *
   * @param type - The type for which to get the config.
   *
   * @throws ResourceTypeNotRegisteredError
   * Thrown if the type is not registered.
   */
  getTypeConfig<
    TTypeConfig extends ResourceTypeConfig<TBaseData> = ResourceTypeConfig<TBaseData>,
  >(
    type: string,
  ): TTypeConfig;

  /**
   * Returns all registered resource type configs for this resource.
   *
   * @returns An array of resource type configs.
   */
  getAllTypeConfigs(): ResourceTypeConfig[];

  /**
   * Creates a new resource document of the given typeand dispatches a
   * `[resource]:create` event. The document is validated before
   * creation. Returns the new document.
   *
   * @param core - A MindDrop core instance.
   * @param data - The data required to create a document.
   * @returns The new resource document.
   *
   * @throws ResourceTypeNotRegisteredError
   * Thrown if the resource type is not registered.
   *
   * @throws ResourceDocumentValidationError
   * Thrown if the resulting document is invalid.
   */
  create<
    TTypeCreateData = {},
    TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData> = {},
  >(
    core: Core,
    type: string,
    data?: TCreateData & TTypeCreateData,
  ): TypedResourceDocument<TBaseData, TTypeData>;

  /**
   * Updates a resource document and dispatches a `[resource]:update`
   * event. The document is validated before being updated. Returns
   * the updated document.
   *
   * - Throws a `ResourceDocumentNotFoundError` if the document does
   *   not exist.
   * - Throws a `ResourceDocumentValidationError` if the resulting
   *   document is invalid.
   *
   * @param core A MindDrop core instance.
   * @param documentId The ID of the document to update.
   * @param data The data required to create a document.
   * @returns The updated resource document.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the resource document does not exist.
   *
   * @throws ResourceTypeNotRegisteredError
   * Thrown if the resource type is not registered.
   *
   * @throws ResourceDocumentValidationError
   * Thrown if the resulting document is invalid.
   */
  update<
    TTypeUpdateData = {},
    TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData> = {},
  >(
    core: Core,
    documentId: string,
    data: TUpdateData & TTypeUpdateData,
  ): TypedResourceDocument<TBaseData, TTypeData>;

  /**
   * Soft-deletes a resource document and dispatches a
   * `[resource]:delete` event. Returns the deleted document.
   *
   * Deleted documents can be restored using the `restore` method.
   *
   * @param core A MindDrop core instance.
   * @param documentId The ID of the document to delete.
   * @returns The deleted resource document.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the resource document does not exist.
   */
  delete<TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData> = {}>(
    core: Core,
    documentId: string,
  ): TypedResourceDocument<TBaseData, TTypeData>;

  /**
   * Restores a soft-deleted resource document and dispatches a
   * `[resource]:restore` event. Returns the restored document.
   *
   * Deleted documents can be restored using the `restore` method.
   *
   * @param core A MindDrop core instance.
   * @param documentId The ID of the document to restore.
   * @returns The restored resource document.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the resource document does not exist.
   */
  restore<
    TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData> = {},
  >(
    core: Core,
    documentId: string,
  ): TypedResourceDocument<TBaseData, TTypeData>;

  /**
   * Permanently deletes a resource document and dispatches a
   * `[resource]:delete-permanently` event. Returns the deleted
   * document.
   *
   * Permanently deleted documents cannot be restored.
   *
   * @param core A MindDrop core instance.
   * @param documentId The ID of the document to delete permanently.
   * @returns The restored resource document.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the resource document does not exist.
   */
  deletePermanently<
    TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData> = {},
  >(
    core: Core,
    documentId: string,
  ): TypedResourceDocument<TBaseData, TTypeData>;

  /**
   * Retrieves one or more resource documents by ID.
   *
   * If provided a single ID, returns the requested document.
   * If provided an array of IDs, retrieves a
   * `{ [id]: ResourceDocument }` map of the requested documents.
   *
   * @param documentId The ID(s) of the document to retrieve.
   * @returns The requested document(s).
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the resource document does not exist.
   */
  get<TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData> = {}>(
    documentId: string,
  ): TypedResourceDocument<TBaseData, TTypeData>;
  get<TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData> = {}>(
    documentIds: string[],
  ): Record<string, TypedResourceDocument<TBaseData, TTypeData>>;

  /**
   * Returns a `{ [id]: ResourceDocument }` map containing all of
   * the resource documents.
   *
   * @returns All of the resource documents.
   */
  getAll<
    TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData> = {},
  >(): Record<string, TypedResourceDocument<TBaseData, TTypeData>>;

  /**
   * The resource type config's store. Intended for use in tests
   * only.
   */
  typeConfigsStore: TypedResourceTypeConfigsStore<TBaseData>;
}
