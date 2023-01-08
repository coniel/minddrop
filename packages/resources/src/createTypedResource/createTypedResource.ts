import { Core } from '@minddrop/core';
import { addParentsToTypedResourceDocument } from '../addParentsToTypedResourceDocument';
import { convertTypedResourceDocument } from '../convertTypedResourceDocument';
import { createConfigsStore } from '../createConfigsStore';
import { createResource } from '../createResource';
import { createResourceStore } from '../createResourceStore';
import { createTypedResourceDocument } from '../createTypedResourceDocument';
import { deleteTypedResourceDocument } from '../deleteTypedResourceDocument';
import { filterTypedResourceDocuments } from '../filterTypedResourceDocuments';
import { getAllResourceTypeConfigs } from '../getAllResourceTypeConfigs';
import { getResourceDocument } from '../getResourceDocument';
import { getTypedResourceTypeConfig } from '../getTypedResourceTypeConfig';
import { registerResourceType } from '../registerResourceType';
import { removeParentsFromTypedResourceDocument } from '../removeParentsFromTypedResourceDocument';
import { restoreTypedResourceDocument } from '../restoreTypedResourceDocument';
import {
  ResourceConfig,
  ResourceTypeConfig,
  RegisteredResourceTypeConfig,
  TypedResourceApi,
  TypedResourceConfig,
  TypedResourceDocument,
  TRDTypeData,
  TRDBaseData,
  TypedResourceDocumentFilters,
  ResourceReference,
  ResourceStore,
  ResourceTypeConfigFilters,
  TypedResourceDocumentData,
} from '../types';
import { unregisterResourceType } from '../unregisterResourceType';
import { updateTypedResourceDocument } from '../updateTypedResourceDocument';
import { useAllTypedResourceDocuments } from '../useAllTypedResourceDocuments';
import { useTypedResourceDocument } from '../useTypedResourceDocument';
import { useTypedResourceDocuments } from '../useTypedResourceDocuments';

/**
 * Creates a new typed resource type, returning its API.
 *
 * @param config - The resource configuration.
 * @returns A typed resource API.
 */
export function createTypedResource<
  TBaseData extends TRDBaseData,
  TCreateData extends Partial<Record<keyof TBaseData, any>> & TRDBaseData,
  TUpdateData extends Partial<Record<keyof TBaseData, any>> & TRDBaseData,
  TCustomTypeConfigOptions = {},
>(
  config: TypedResourceConfig<TBaseData, TypedResourceDocument<TBaseData>>,
  customStore?: ResourceStore<TypedResourceDocument<TBaseData>>,
): TypedResourceApi<
  TBaseData,
  TCreateData,
  TUpdateData,
  TCustomTypeConfigOptions
> {
  // Create a resource store
  const store =
    customStore || createResourceStore<TypedResourceDocument<TBaseData>>();

  // Create a resource
  const Api = createResource<
    TypedResourceDocumentData<TBaseData>,
    TCreateData,
    TUpdateData
  >(
    config as ResourceConfig<
      TypedResourceDocumentData<TBaseData>,
      TypedResourceDocument<TBaseData>
    >,
    store,
  );

  // Create a store for the type configurations
  const typeConfigsStore = createConfigsStore<
    RegisteredResourceTypeConfig<TBaseData, {}, TCustomTypeConfigOptions>
  >({
    idField: 'type',
  });

  return {
    ...Api,
    create: <
      TTypeCreateData extends Partial<TRDTypeData<TBaseData>> = {},
      TTypeData extends TRDTypeData<TBaseData> = {},
    >(
      core: Core,
      type: string,
      data: TCreateData & TTypeCreateData,
    ) =>
      createTypedResourceDocument<
        TBaseData,
        TTypeData,
        TCreateData,
        TTypeCreateData
      >(core, store, typeConfigsStore, config, type, data),
    update: <
      TTypeUpdateData extends Partial<TRDTypeData<TBaseData>> = {},
      TTypeData extends TRDTypeData<TBaseData> = {},
    >(
      core: Core,
      documentId: string,
      data: TUpdateData & TTypeUpdateData,
    ) =>
      updateTypedResourceDocument<
        TBaseData,
        TTypeData,
        Partial<TBaseData>,
        TTypeUpdateData
      >(core, store, typeConfigsStore, config, documentId, data),
    delete: <TTypeData extends TRDTypeData<TBaseData> = {}>(
      core: Core,
      documentId: string,
    ) =>
      deleteTypedResourceDocument<TBaseData, TTypeData>(
        core,
        store,
        typeConfigsStore,
        config,
        documentId,
      ),
    restore: <TTypeData extends TRDTypeData<TBaseData> = {}>(
      core: Core,
      documentId: string,
    ) =>
      restoreTypedResourceDocument<TBaseData, TTypeData>(
        core,
        store,
        typeConfigsStore,
        config,
        documentId,
      ),
    deletePermanently: <TTypeData extends TRDTypeData<TBaseData> = {}>(
      core: Core,
      documentId: string,
    ) =>
      Api.deletePermanently(core, documentId) as TypedResourceDocument<
        TBaseData,
        TTypeData
      >,
    convert: <TTypeData extends TRDTypeData<TBaseData> = {}>(
      core: Core,
      documentId: string,
      newType: string,
    ) =>
      convertTypedResourceDocument<TBaseData, TTypeData>(
        core,
        store,
        typeConfigsStore,
        config,
        documentId,
        newType,
      ),
    addParents: <TTypeData extends TRDTypeData<TBaseData> = {}>(
      core: Core,
      documentId: string,
      parentReferences: ResourceReference[],
    ) =>
      addParentsToTypedResourceDocument<TBaseData, TTypeData>(
        core,
        store,
        typeConfigsStore,
        config,
        documentId,
        parentReferences,
      ),
    removeParents: <TTypeData extends TRDTypeData<TBaseData> = {}>(
      core: Core,
      documentId: string,
      parentReferences: ResourceReference[],
    ) =>
      removeParentsFromTypedResourceDocument<TBaseData, TTypeData>(
        core,
        store,
        typeConfigsStore,
        config,
        documentId,
        parentReferences,
      ),
    get: <TTypeData extends TRDTypeData<TBaseData> = {}>(
      documentId: string | string[],
    ) =>
      getResourceDocument<
        TypedResourceDocumentData<TBaseData, TTypeData>,
        TypedResourceDocument<TBaseData, TTypeData>
      >(
        store as ResourceStore<TypedResourceDocument<TBaseData, TTypeData>>,
        config as unknown as ResourceConfig<
          TypedResourceDocumentData<TBaseData, TTypeData>,
          TypedResourceDocument<TBaseData, TTypeData>
        >,
        documentId as string,
      ),
    getAll: <TTypeData extends TRDTypeData<TBaseData> = {}>() =>
      Api.getAll() as Record<
        string,
        TypedResourceDocument<TBaseData, TTypeData>
      >,
    register: <TTypeData extends TRDTypeData<TBaseData>>(
      core: Core,
      typeConfig: ResourceTypeConfig<
        TBaseData,
        TTypeData,
        TCustomTypeConfigOptions
      >,
    ) =>
      registerResourceType<TBaseData, TTypeData, TCustomTypeConfigOptions>(
        core,
        config,
        typeConfigsStore,
        typeConfig,
      ),
    unregister: (core, typeConfig) =>
      unregisterResourceType(core, config, typeConfigsStore, typeConfig),
    getTypeConfig: <TTypeData extends TRDTypeData<TBaseData> = {}>(
      type: string,
    ) =>
      getTypedResourceTypeConfig(
        config.resource,
        typeConfigsStore,
        type,
      ) as RegisteredResourceTypeConfig<
        TBaseData,
        TTypeData,
        TCustomTypeConfigOptions
      >,
    getAllTypeConfigs: <TTypeData extends TRDTypeData<TBaseData> = {}>(
      filters: ResourceTypeConfigFilters,
    ) =>
      getAllResourceTypeConfigs<TBaseData, TTypeData, TCustomTypeConfigOptions>(
        typeConfigsStore,
        filters,
      ),
    filter: filterTypedResourceDocuments,
    hooks: {
      useDocument: <TTypeData extends TRDTypeData<TBaseData> = {}>(
        documentId: string,
      ) => useTypedResourceDocument<TBaseData, TTypeData>(store, documentId),
      useDocuments: <TTypeData extends TRDTypeData<TBaseData> = {}>(
        documentIds: string[],
        filters: TypedResourceDocumentFilters,
      ) =>
        useTypedResourceDocuments<TBaseData, TTypeData>(
          store,
          documentIds,
          filters,
        ),
      useAllDocuments: <TTypeData extends TRDTypeData<TBaseData> = {}>(
        filters: TypedResourceDocumentFilters,
      ) => useAllTypedResourceDocuments<TBaseData, TTypeData>(store, filters),
      useTypeConfig: <TTypeData extends TRDTypeData<TBaseData> = {}>(
        type: string,
      ) =>
        typeConfigsStore.useConfig<
          RegisteredResourceTypeConfig<
            TBaseData,
            TTypeData,
            TCustomTypeConfigOptions
          >
        >(type),
      useTypeConfigs: <TTypeData extends TRDTypeData<TBaseData> = {}>(
        types: string[],
      ) =>
        typeConfigsStore.useConfigs<
          RegisteredResourceTypeConfig<
            TBaseData,
            TTypeData,
            TCustomTypeConfigOptions
          >
        >(types),
      useAllTypeConfigs: <TTypeData extends TRDTypeData<TBaseData> = {}>() =>
        typeConfigsStore.useAllConfigs<
          RegisteredResourceTypeConfig<
            TBaseData,
            TTypeData,
            TCustomTypeConfigOptions
          >
        >(),
    },
    typeConfigsStore,
  };
}
