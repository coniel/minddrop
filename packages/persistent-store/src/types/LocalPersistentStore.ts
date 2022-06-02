import {
  TRDTypeDataSchema,
  TRDTypeData,
  TypedResourceDocument,
  TypedResourceApi,
} from '@minddrop/resources';

export interface BaseLocalPersistentStoreData {
  /**
   * The ID of the application instance to which
   * the data belongs.
   */
  app: string;

  /**
   * The ID of the extension to which the data
   * belongs.
   */
  extension: string;
}

export type LocalPersistentStoreDataSchema<
  TData extends TRDTypeData<BaseLocalPersistentStoreData> = {},
> = TRDTypeDataSchema<BaseLocalPersistentStoreData, TData>;

export type LocalPersistentStoreData =
  TRDTypeData<BaseLocalPersistentStoreData>;

export type LocalPersistentStoreDocument<
  TData extends LocalPersistentStoreData = {},
> = TypedResourceDocument<BaseLocalPersistentStoreData, TData>;

export type LocalPersistentStoreResourceApi<
  TData extends LocalPersistentStoreData = {},
> = TypedResourceApi<BaseLocalPersistentStoreData, {}, {}, TData>;
