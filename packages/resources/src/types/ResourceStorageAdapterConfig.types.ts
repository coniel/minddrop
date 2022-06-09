import { ResourceDocument, RDUpdate } from './ResourceDocument.types';

export interface ResourceStorageAdapterSyncApi {
  /**
   * Callback to be fired when a resource document
   * is added or updated.
   *
   * @param document - The document to set.
   */
  set: (document: ResourceDocument) => void;

  /**
   * Callback to be fired when a resource document
   * is removed.
   *
   * @param document - The document to remove.
   */
  remove: (document: ResourceDocument) => void;
}

export interface ResourceStorageAdapterConfig {
  /**
   * A unique ID.
   */
  id: string;

  /**
   * Called on app startup to initialize the
   * storage adapter.
   *
   * @param syncApi - The API used to sync resource document changes.
   */
  initialize?(syncApi: ResourceStorageAdapterSyncApi): void | Promise<void>;

  /**
   * Called to retrieve all docuemnts from storage.
   *
   * Should return an array containing all resource
   * documents.
   *
   * @retuns An array of resource documents.
   */
  getAll(): ResourceDocument[] | Promise<ResourceDocument[]>;

  /**
   * Called when a new document is created.
   *
   * @param document - The new document.
   */
  create(document: ResourceDocument): void | Promise<void>;

  /**
   * Called when a document is updated.
   *
   * @param documentId - The ID of the updated document.
   * @param update - The document update object.
   */
  update(documentId: string, update: RDUpdate): void | Promise<void>;

  /**
   * Called when a document is permanently deleted.
   *
   * @param document - The deleted document.
   */
  delete(document: ResourceDocument): void | Promise<void>;
}
