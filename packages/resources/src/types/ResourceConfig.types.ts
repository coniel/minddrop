import { ResourceSchema } from './ResourceValidation.types';
import { Core } from '@minddrop/core';
import { ResourceDocument } from './ResourceDocument.types';

export interface ResourceConfig<TData> {
  /**
   * A unique identifier for the type of the resource
   * composed using the extension ID and resource type:
   * [extensionId]:[resourceType].
   */
  type: string;

  /**
   * The version number of the API. Should be incremented
   * every time changes are made to the API. Used to version
   * the resource documents, in case data migrations need to
   * be performed on documents created by specific API versions.
   */
  apiVersion: number;

  /**
   * The resource schema used to validate the resource
   * documents.
   */
  schema: ResourceSchema<TData>;

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
   * @param data The resource update data.
   */
  onUpdate?(document: ResourceDocument<TData>): ResourceDocument<TData>;

  /**
   * Callback fired when a resource is soft deleted.
   * Called before the soft deletion is performed in the store
   * and database. Allows for performing cleanup operations
   * before a resource is soft deleted.
   */
  onDelete?(document: ResourceDocument<TData>): ResourceDocument<TData>;

  /**
   * Callback fired when a resource is permanently deleted.
   * Called before the document is deleted from the store
   * and database. Allows for performing cleanup operations
   * before a resource is deleted.
   */
  onDeletePermanently?(document: ResourceDocument<TData>): void;

  /**
   * Callback fired when a resource is restored after from being
   * soft deleted. Called before the restoration is performed in
   * the store and database. Allows for performing modifications
   * to the restore document before it is restored.
   */
  onRestore?(document: ResourceDocument<TData>): ResourceDocument<TData>;

  /**
   * Callback fired when a single document is fetched using the
   * `get` method. Allows for performing modifications to the
   * document before it is returned.
   *
   * Returning `null` will cause the function to throw a
   * `ResourceDocumentNotFoundError`.
   *
   * @param document The document which was retrieved, `null` if it does not exist.
   * @param documentId The ID of the requested document.
   * @returns The requested document or `null`.
   */
  onGetOne?(
    document: ResourceDocument<TData> | null,
    documentId: string,
  ): ResourceDocument<TData> | null;

  /**
   * Callback fired when multiple documents are fetched using
   * the `get` method. Allows for performing modifications to
   * the documents before they are returned.
   *
   * If a requested document does not exist, it's value is set
   * to `null` in the `documents` parameter.
   *
   * Returning a map containing any `null` values will cause the
   * function to throw a `ResourceDocumentNotFoundError`.
   *
   * @param documents A `{ [id]: ResourceDocument | null }` map of the requested documents (`null` if document does not exist).
   * @param documentIds The IDs of the requested documents.
   * @returns A `{ [id]: ResourceDocument | null }` map of the requested documents (`null` if document does not exist).
   */
  onGetMany?(
    documents: Record<string, ResourceDocument<TData>>,
    documentIds: string[],
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
   * Callback fired when resource documents are loaded into
   * the store from the database. Called before the documents
   * are loaded into the store. Allows for performing side
   * effects when documents are loaded into the store.
   *
   * @param documents The loaded docuemnts.
   */
  onLoad?(documents: ResourceDocument<TData>[]): void;

  /**
   * Callback fired when a resource documents is set in the
   * store from the database (as a result of being created/
   * updated outside the current app window during runtime).
   * Called before the document is set in the store. Allows
   * for performing side effects when documents are set in
   * the store.
   *
   * @param document The set document.
   */
  onSet?(document: ResourceDocument<TData>): void;

  /**
   * Callback fired when a resource documents is removed from
   * the store (as a result of being permanently deleted from
   * outside the current app window during runtime). Called
   * before the document is removed from the store. Allows for
   * performing side effects when documents are removed from
   * the store.
   *
   * @param document The removed document.
   */
  onRemove?(document: ResourceDocument<TData>): void;

  /**
   * Callback fired when the store is cleared. Only called
   * within tests. Allows for performing side effects such
   * as clearning other related data.
   */
  onClear?(): void;
}
