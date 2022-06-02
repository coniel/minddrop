import {
  TRDTypeDataSchema,
  TRDTypeData,
  TypedResourceDocument,
  TypedResourceApi,
} from '@minddrop/resources';

export interface BaseGlobalPersistentStoreData {
  /**
   * The ID of the extension to which the data
   * belongs.
   */
  extension: string;
}

export type GlobalPersistentStoreDataSchema<
  TData extends TRDTypeData<BaseGlobalPersistentStoreData> = {},
> = TRDTypeDataSchema<BaseGlobalPersistentStoreData, TData>;

export type GlobalPersistentStoreData =
  TRDTypeData<BaseGlobalPersistentStoreData>;

export type GlobalPersistentStoreDocument<
  TData extends GlobalPersistentStoreData = {},
> = TypedResourceDocument<BaseGlobalPersistentStoreData, TData>;

export type GlobalPersistentStoreResourceApi<
  TData extends GlobalPersistentStoreData = {},
> = TypedResourceApi<BaseGlobalPersistentStoreData, {}, {}, TData>;
