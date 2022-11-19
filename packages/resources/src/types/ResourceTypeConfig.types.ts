import { Core } from '@minddrop/core';
import { ConfigsStore } from './ConfigsStore.types';
import { TRDTypeDataSchema } from './ResourceValidation.types';
import {
  TRDBaseData,
  TRDTypeData,
  TypedResourceDocument,
  TRDUpdate,
} from './TypedResourceDocument.types';

export type ResourceTypeConfig<
  TBaseData extends TRDBaseData = {},
  TTypeData extends TRDTypeData<TBaseData> = {},
  TCustomOptions = {},
> = TCustomOptions & {
  /**
   * A unique identifier for the resource type composed
   * using the extension ID and resource type:
   * `[extension-id]:[resource-type]`.
   */
  type: string;

  /**
   * The schema used to validate the resource
   * document data.
   */
  dataSchema?: TRDTypeDataSchema<TBaseData, TTypeData>;

  /**
   * The default data used when creating a new document.
   * The data supplied in the `create` call is merged into
   * the default data, overwriting any overlaping values.
   *
   * For more advanced needs, such as adjusting the default
   * data based on the data provided to the `create` method,
   * use the `onCreate` callback.
   */
  defaultData?: Partial<TTypeData>;

  /**
   * Callback fired when a resource document of this type is
   * created. Called before the document is inserted into the
   * store and database. Allows for performing modifications
   * and validation on the document data before creation.
   *
   * Must return the new document of this resource type.
   *
   * @param core - A MindDrop core instance.
   * @param document - The new document.
   * @returns The new document, with modifications.
   */
  onCreate?(
    core: Core,
    document: TypedResourceDocument<TBaseData, TTypeData>,
  ): TypedResourceDocument<TBaseData, TTypeData>;

  /**
   * Callback fired when a resource document of this type is
   * updated. Called before the document changes are set to
   * the store and database. Allows for performing modifications
   * and validation on the document before it is updated.
   *
   * @param core - A MindDrop core instance.
   * @param update - The resource update.
   * @returns The updated document data.
   */
  onUpdate?(
    core: Core,
    update: TRDUpdate<TBaseData, TTypeData>,
  ): Partial<TBaseData & TTypeData>;

  /**
   * Callback fired when a resource document of another type is
   * converted to this type. Allows for preserving and modifying
   * data when converting from a known type.
   *
   * Should return conversion specific data to be set on the
   * document, or an empty object if no data was converted.
   *
   * When a typed document is converted, the document's current
   * type scpecific data is removed and replaced by the new
   * type's `defaultData`, `onCreate` data, and `onConvert`
   * data, merged in that order.
   *
   * @param core - A MindDrop core instance.
   * @param document - The resource document being converted.
   * @returns The new document type data.
   */
  onConvert?(
    core: Core,
    document: TypedResourceDocument<TBaseData, TTypeData>,
  ): Partial<TBaseData & TTypeData>;

  /**
   * Callback fired when a document of this type is retrieved
   * from the store. Allows for performing modifications to the
   * document before it is returned. When multiple documents are
   * fetched at once, the callback is called on each returned
   * document.
   *
   * @param document - The requested document.
   * @returns The requested document.
   */
  onGet?(
    document: TypedResourceDocument<TBaseData, TTypeData>,
  ): TypedResourceDocument<TBaseData, TTypeData>;

  /**
   * Callback fired when the store is cleared. Only called
   * within tests. Allows for performing side effects such
   * as clearning other related data.
   */
  onClear?(): void;
};

export type RegisteredResourceTypeConfig<
  TBaseData extends TRDBaseData = {},
  TTypeData extends TRDTypeData<TBaseData> = {},
  TCustomOptions = {},
> = ResourceTypeConfig<TBaseData, TTypeData, TCustomOptions> & {
  /**
   * The ID of the extension that registered the resource type.
   */
  extension: string;
};

export type ResourceTypeConfigsStore<
  TBaseData extends TRDBaseData = {},
  TTypeData extends TRDTypeData<TBaseData> = {},
  TCustomOptions = {},
> = ConfigsStore<
  RegisteredResourceTypeConfig<TBaseData, TTypeData, TCustomOptions>
>;
