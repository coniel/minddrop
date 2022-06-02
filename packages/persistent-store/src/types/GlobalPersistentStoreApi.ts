import { Core } from 'packages/core/dist';
import { TRDTypeData, TypedResourceApi } from '@minddrop/resources';
import {
  BaseGlobalPersistentStoreData,
  GlobalPersistentStoreDataSchema,
} from './GlobalPersistentStore';

export interface GlobalPersistentStoreApi {
  /**
   * Retrieves a value from the global persistent store.
   *
   * If the value is not set, returns the provided default
   * value or `null`.
   *
   * @param core - A MindDrop core instance.
   * @param key - The key of the value to retrieve.
   * @param defaultValue - The value returned if the key is not set.
   * @returns The requested value, default value, or `null`.
   */
  get<TValue = unknown>(
    core: Core,
    key: string,
    defaultValue?: TValue,
  ): TValue | null;

  /**
   * Sets a value in the global persistent store.
   *
   * @param core - A MindDrop core instance.
   * @param key - The key of the value to set.
   * @param value - The value to set.
   *
   * @throws ResourceValidationError
   * Thrown if the value is invalid.
   */
  set<TValue = unknown>(core: Core, key: string, value: TValue): void;

  /**
   * Initializes the extension's global persistent store.
   *
   * Must be called only once in the extension's `onRun`
   * method.
   *
   * @param core - A MindDrop core instance.
   * @param schema - The store's data schema.
   * @param defaultData - The default data set when first creating the store document.
   */
  initialize<
    TStoreData extends TRDTypeData<BaseGlobalPersistentStoreData> = {},
  >(
    core: Core,
    schema: GlobalPersistentStoreDataSchema<TStoreData>,
    defaultData: TStoreData,
  ): void;

  /**
   * The global persistent store documents store.
   */
  store: TypedResourceApi['store'];

  /**
   * The global persistent store type configs store.
   */
  typeConfigsStore: TypedResourceApi['typeConfigsStore'];
}
