import { TRDBaseDataSchema } from './ResourceValidation.types';
import { Core } from '@minddrop/core';
import {
  TRDBaseData,
  TypedResourceDocument,
  TRDUpdate,
  TRDUpdateData,
} from './TypedResourceDocument.types';

export interface TypedResourceConfig<
  TBaseData extends TRDBaseData = {},
  TResourceDocument extends TypedResourceDocument<TBaseData> = TypedResourceDocument<TBaseData>,
> {
  /**
   * A unique identifier for the resource composed
   * using the extension ID and resource type:
   * `[extension-id]:[resource-name]`.
   */
  resource: string;

  /**
   * The schema used to validate the resource
   * document data.
   */
  dataSchema?: TRDBaseDataSchema<TBaseData>;

  /**
   * The default data used when creating a new document.
   * The data supplied in the `create` call is merged into
   * the default data, overwriting any overlaping values.
   *
   * For more advanced needs, such as adjusting the default
   * data based on the data provided to the `create` method,
   * use the `onCreate` callback.
   */
  defaultData?: Partial<TBaseData>;

  /**
   * Callback fired when a resource is created.
   * Called before the document is inserted into the store and
   * database. Allows for performing modifications and
   * validation on the document data before creation.
   *
   * Must return the new document.
   *
   * @param document The new document.
   * @returns The new document, with modifications.
   */
  onCreate?(core: Core, document: TResourceDocument): TResourceDocument;

  /**
   * Callback fired when a resource is updated.
   * Called before the document changes are set to the store
   * and database. Allows for performing modifications and
   * validation on the document before it is updated.
   *
   * Must return the updated document.
   *
   * @param update The resource update.
   */
  onUpdate?(core: Core, update: TRDUpdate<TBaseData>): TRDUpdateData<TBaseData>;

  /**
   * Callback fired when a document is retrieved from the store.
   * Allows for performing modifications to the document before
   * it is returned. When multiple documents are fetched at once,
   * the callback is called on each returned document.
   *
   * @param document The requested document.
   * @returns The requested document.
   */
  onGet?(document: TResourceDocument): TResourceDocument;

  /**
   * Callback fired when the store is cleared. Only called
   * within tests. Allows for performing side effects such
   * as clearning other related data.
   */
  onClear?(): void;
}
