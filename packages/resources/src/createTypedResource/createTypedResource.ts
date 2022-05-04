import { Core } from '@minddrop/core';
import { createConfigsStore } from '../createConfigsStore';
import { createResource } from '../createResource';
import { createResourceStore } from '../createResourceStore';
import { createTypedResourceDocument } from '../createTypedResourceDocument';
import { deleteTypedResourceDocument } from '../deleteTypedResourceDocument';
import { getTypedResourceTypeConfig } from '../getTypedResourceTypeConfig';
import { registerResourceType } from '../registerResourceType';
import { restoreTypedResourceDocument } from '../restoreTypedResourceDocument';
import {
  ResourceConfig,
  ResourceTypeConfig,
  TypedResourceApi,
  TypedResourceConfig,
  TypedResourceDocument,
  TypedResourceDocumentTypeCustomData,
  TypedResourceDocumentBaseCustomData,
} from '../types';
import { unregisterResourceType } from '../unregisterResourceType';
import { updateTypedResourceDocument } from '../updateTypedResourceDocument';

/**
 * Creates a new typed resource type, returning its API.
 *
 * @param config - The resource configuration.
 * @returns A typed resource API.
 */
export function createTypedResource<
  TBaseData extends TypedResourceDocumentBaseCustomData,
  TCreateData extends Partial<TBaseData> & TypedResourceDocumentBaseCustomData,
  TUpdateData extends Partial<TBaseData> & TypedResourceDocumentBaseCustomData,
>(
  config: TypedResourceConfig<TBaseData, TypedResourceDocument<TBaseData>>,
): TypedResourceApi<TBaseData, TCreateData, TUpdateData> {
  // Create a resource store
  const store = createResourceStore<TypedResourceDocument<TBaseData>>();

  // Create a resource
  const Api = createResource<TBaseData, TCreateData, TUpdateData>(
    config as ResourceConfig<TBaseData, TypedResourceDocument<TBaseData>>,
    store,
  );

  // Create a store for the type configurations
  const typeConfigsStore = createConfigsStore<ResourceTypeConfig<TBaseData>>({
    idField: 'type',
  });

  return {
    ...Api,
    create: <
      TTypeCreateData = {},
      TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData> = {},
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
      TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData> = {},
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
    delete: <
      TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData> = {},
    >(
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
    restore: <
      TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData> = {},
    >(
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
    deletePermanently: <
      TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData> = {},
    >(
      core: Core,
      documentId: string,
    ) =>
      Api.deletePermanently(core, documentId) as TypedResourceDocument<
        TBaseData,
        TTypeData
      >,
    getAll: <
      TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData> = {},
    >() =>
      Api.getAll() as Record<
        string,
        TypedResourceDocument<TBaseData, TTypeData>
      >,
    register: <
      TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData>,
    >(
      core: Core,
      typeConfig: ResourceTypeConfig<TBaseData, TTypeData>,
    ) =>
      registerResourceType<TBaseData, TTypeData>(
        core,
        config,
        typeConfigsStore,
        typeConfig,
      ),
    unregister: (core, typeConfig) =>
      unregisterResourceType(core, config, typeConfigsStore, typeConfig),
    getTypeConfig: <TTypeConfig extends ResourceTypeConfig<TBaseData>>(
      type: string,
    ) =>
      getTypedResourceTypeConfig(
        config.resource,
        typeConfigsStore,
        type,
      ) as TTypeConfig,
    getAllTypeConfigs: typeConfigsStore.getAll,
    typeConfigsStore,
  };
}
