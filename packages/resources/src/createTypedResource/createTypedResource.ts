import { Core } from '@minddrop/core';
import { addParentsToTypedResourceDocument } from '../addParentsToTypedResourceDocument';
import { createConfigsStore } from '../createConfigsStore';
import { createResource } from '../createResource';
import { createResourceStore } from '../createResourceStore';
import { createTypedResourceDocument } from '../createTypedResourceDocument';
import { deleteTypedResourceDocument } from '../deleteTypedResourceDocument';
import { filterTypedResourceDocuments } from '../filterTypedResourceDocuments';
import { getTypedResourceTypeConfig } from '../getTypedResourceTypeConfig';
import { registerResourceType } from '../registerResourceType';
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
): TypedResourceApi<
  TBaseData,
  TCreateData,
  TUpdateData,
  TCustomTypeConfigOptions
> {
  // Create a resource store
  const store = createResourceStore<TypedResourceDocument<TBaseData>>();

  // Create a resource
  const Api = createResource<TBaseData, TCreateData, TUpdateData>(
    config as ResourceConfig<TBaseData, TypedResourceDocument<TBaseData>>,
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
      TTypeCreateData = {},
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
      TTypeUpdateData = {},
      TTypeData extends TRDTypeData<TBaseData> = {},
    >(
      core: Core,
      documentId: string,
      data: TBaseData & TTypeUpdateData,
    ) =>
      updateTypedResourceDocument<
        TBaseData,
        TTypeData,
        TBaseData,
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
    getAllTypeConfigs: <TTypeData extends TRDTypeData<TBaseData> = {}>() =>
      typeConfigsStore.getAll() as RegisteredResourceTypeConfig<
        TBaseData,
        TTypeData,
        TCustomTypeConfigOptions
      >[],
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
    },
    typeConfigsStore,
  };
}
