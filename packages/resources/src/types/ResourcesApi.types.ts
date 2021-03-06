import { Core } from '@minddrop/core';
import { ResourceDocument, RDData } from './ResourceDocument.types';
import { ResourceConfig } from './ResourceConfig.types';
import { ResourceApi } from './ResourceApi.types';
import {
  TypedResourceDocument,
  TRDBaseData,
} from './TypedResourceDocument.types';
import { TypedResourceApi } from './TypedResourceApi.types';
import { TypedResourceConfig } from './TypedResourceConfig.types';
import { ResourceStore } from './ResourceStore.types';
import { ConfigsStore, ConfigsStoreOptions } from './ConfigsStore.types';
import { ResourceStorageAdapterConfig } from './ResourceStorageAdapterConfig.types';
import {
  RegisterResourceEvent,
  RegisterResourceEventCallback,
  RegisterResourceStorageAdapterEvent,
  RegisterResourceStorageAdapterEventCallback,
  UnregisterResourceEvent,
  UnregisterResourceEventCallback,
  UnregisterResourceStorageAdapterEvent,
  UnregisterResourceStorageAdapterEventCallback,
} from './ResourceEvents.types';
import { ResourceDeserializers } from './ResourceDeserializers.types';

export interface ResourcesApi {
  /**
   * Creates a new resource store.
   *
   * @returns The resource store.
   */
  createResourceStore<
    TDocument extends ResourceDocument,
  >(): ResourceStore<TDocument>;

  /**
   * Creates a store for storing configuration objects.
   *
   * @params options - The store options.
   * @returns A configs store.
   */
  createConfigsStore<TConfig>(
    options: ConfigsStoreOptions,
  ): ConfigsStore<TConfig>;

  /**
   * Creates a new resource, returning its API.
   *
   * @param config - The resource configuration.
   * @returns A resource API.
   */
  create<
    TData extends RDData = {},
    TCreateData extends Partial<Record<keyof TData, any>> & RDData = {},
    TUpdateData extends Partial<Record<keyof TData, any>> & RDData = {},
    TResourceDocument extends ResourceDocument<TData> = ResourceDocument<TData>,
  >(
    config: ResourceConfig<TData, TResourceDocument>,
    customStore?: ResourceStore<TResourceDocument>,
  ): ResourceApi<TData, TCreateData, TUpdateData>;

  /**
   * Creates a new typed resource type, returning its API.
   *
   * @param config - The resource configuration.
   * @returns A typed resource API.
   */
  createTyped<
    TBaseData extends TRDBaseData = {},
    TCreateData extends Partial<Record<keyof TBaseData, any>> &
      TRDBaseData = {},
    TUpdateData extends Partial<Record<keyof TBaseData, any>> &
      TRDBaseData = {},
    TCustomTypeConfigOptions = {},
  >(
    config: TypedResourceConfig<TBaseData, TypedResourceDocument<TBaseData>>,
    customStore?: ResourceStore<TypedResourceDocument<TBaseData>>,
  ): TypedResourceApi<
    TBaseData,
    TCreateData,
    TUpdateData,
    TCustomTypeConfigOptions
  >;

  /**
   * Registers a resource.
   *
   * @param core - A MindDrop core instance.
   * @param api - The API of the resource to register.
   */
  register(
    core: Core,
    api: (ResourceApi | TypedResourceApi) | (ResourceApi | TypedResourceApi)[],
  ): void;

  /**
   * Unregisters a resource.
   *
   * @param core - A MindDrop core instance.
   * @param api - The API of the resource to register.
   */
  unregister(
    core: Core,
    api: (ResourceApi | TypedResourceApi) | (ResourceApi | TypedResourceApi)[],
  ): void;

  /**
   * Generates a new resource document containing
   * the provided data.
   *
   * @param resource - The resource name.
   * @param data - The resource document data.
   * @returns A new resource document.
   */
  generateDocument<
    TData extends RDData,
    TResourceDocument extends ResourceDocument = ResourceDocument<TData>,
  >(
    resource: string,
    data: TData,
  ): TResourceDocument;

  /**
   * Returns a resource's API given the resource ID.
   *
   * @param resourceId - The resource ID.
   * @returns - The resource API.
   *
   * @throws ResourceNotRegisteredError
   * Thrown if the requested resource is not registered.
   */
  get(resourceId: string): ResourceApi | TypedResourceApi;

  /**
   * Returns resource APIs given an array of resource IDs.
   *
   * @param resourceIds - The resource IDs.
   * @returns - The resource API.
   *
   * @throws ResourceNotRegisteredError
   * Thrown if one or more of the requested resources are not registered.
   */
  get(resourceIds: string[]): (ResourceApi | TypedResourceApi)[];

  /**
   * Returns all registered resource APIs.
   *
   * @returns All registered resource APIs.
   */
  getAll(): (ResourceApi | TypedResourceApi)[];

  /**
   * Clears the store of all registered resource API.
   *
   * **Intended for use in tests only.**
   */
  clear(): void;

  /**
   * Registers a new resource storage adapter.
   *
   * Dispatches a 'resources:storage-adapter:register'
   * event.
   *
   * @param core - A MindDrop core instance.
   * @param config - The sotrage adapter config to register.
   */
  registerStorageAdapter(
    core: Core,
    config: ResourceStorageAdapterConfig,
  ): void;

  /**
   * Unregisters a resource storage adapter.
   *
   * Dispatches a 'resources:storage-adapter:unregister'
   * event.
   *
   * @param core - A MindDrop core instance.
   * @param config - The storage adapter config to unregister.
   */
  unregisterStorageAdapter(
    core: Core,
    config: ResourceStorageAdapterConfig,
  ): void;

  deserializeDocument<
    TData extends RDData = {},
    TRawDocument extends
      | ResourceDocument
      | TypedResourceDocument = ResourceDocument,
  >(
    document: TRawDocument,
    deserializers: ResourceDeserializers,
  ): ResourceDocument<TData>;

  /* ********************************** */
  /* *** addEventListener overloads *** */
  /* ********************************** */

  // Add 'resources:resource:register' event listener
  addEventListener(
    core: Core,
    type: RegisterResourceEvent,
    callback: RegisterResourceEventCallback,
  ): void;

  // Add 'resources:resource:unregister' event listener
  addEventListener(
    core: Core,
    type: UnregisterResourceEvent,
    callback: UnregisterResourceEventCallback,
  ): void;

  // Add 'resources:storage-adapter:register' event listener
  addEventListener(
    core: Core,
    type: RegisterResourceStorageAdapterEvent,
    callback: RegisterResourceStorageAdapterEventCallback,
  ): void;

  // Add 'resources:storage-adapter:unregister' event listener
  addEventListener(
    core: Core,
    type: UnregisterResourceStorageAdapterEvent,
    callback: UnregisterResourceStorageAdapterEventCallback,
  ): void;

  /* ************************************* */
  /* *** removeEventListener overloads *** */
  /* ************************************* */

  // Remove 'resources:resource:register' event listener
  removeEventListener(
    core: Core,
    type: RegisterResourceEvent,
    callback: RegisterResourceEventCallback,
  ): void;

  // Remove 'resources:resource:unregister' event listener
  removeEventListener(
    core: Core,
    type: UnregisterResourceEvent,
    callback: UnregisterResourceEventCallback,
  ): void;

  // Remove 'resources:storage-adapter:register' event listener
  removeEventListener(
    core: Core,
    type: RegisterResourceStorageAdapterEvent,
    callback: RegisterResourceStorageAdapterEventCallback,
  ): void;

  // Remove 'resources:storage-adapter:unregister' event listener
  removeEventListener(
    core: Core,
    type: UnregisterResourceStorageAdapterEvent,
    callback: UnregisterResourceStorageAdapterEventCallback,
  ): void;
}
