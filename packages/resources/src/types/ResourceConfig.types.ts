import { ResourceDataSchema } from './ResourceValidation.types';
import { Core } from '@minddrop/core';
import {
  ResourceDocument,
  ResourceDocumentCustomData,
  ResourceDocumentUpdate,
} from './ResourceDocument.types';

export interface ResourceConfig<TData extends ResourceDocumentCustomData> {
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
  dataSchema: ResourceDataSchema<TData>;

  /**
   * The default data used when creating a new document.
   * The data supplied in the `create` call is merged into
   * the default data, overwriting any overlaping values.
   *
   * For more advanced needs, such as adjusting the default
   * data based on the data provided to the `create` method,
   * use the `onCreate` callback.
   */
  defaultData?: Partial<TData>;

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
  onCreate?(
    core: Core,
    document: ResourceDocument<TData>,
  ): ResourceDocument<TData>;

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
  onUpdate?(core: Core, update: ResourceDocumentUpdate<TData>): Partial<TData>;

  /**
   * Callback fired when a single document is fetched using the
   * `get` method. Allows for performing modifications to the
   * document before it is returned.
   *
   * @param document The requested document.
   * @returns The requested document.
   */
  onGetOne?(document: ResourceDocument<TData>): ResourceDocument<TData>;

  /**
   * Callback fired when multiple documents are fetched using
   * the `get` method. Allows for performing modifications to
   * the documents before they are returned.
   *
   * @param documents A `{ [id]: ResourceDocument }` map of the requested documents.
   * @returns A `{ [id]: ResourceDocument }` map of the requested documents.
   */
  onGetMany?(
    documents: Record<string, ResourceDocument<TData>>,
  ): Record<string, ResourceDocument<TData>>;

  /**
   * Callback fired when all documents are fetched using
   * the `getAll` method. Allows for performing modifications to
   * the documents before they are returned.
   *
   * @param documents A `{ [id]: ResourceDocument }` map of the all the documents.
   * @returns A `{ [id]: ResourceDocument }` map of the all the documents.
   */
  onGetAll?(
    documents: Record<string, ResourceDocument<TData>>,
  ): Record<string, ResourceDocument<TData>>;

  /**
   * Callback fired when the store is cleared. Only called
   * within tests. Allows for performing side effects such
   * as clearning other related data.
   */
  onClear?(): void;
}
