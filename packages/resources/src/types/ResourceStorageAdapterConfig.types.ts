import { Core } from '@minddrop/core';
import { ResourceDocument, RDUpdate } from './ResourceDocument.types';

export interface ResourceStorageAdapterConfig {
  /**
   * A unique ID.
   */
  id: string;

  /**
   * Called on app startup to initialize the
   * storage adapter.
   *
   * @param core - A MindDrop core instance.
   */
  initialize?(core: Core): void | Promise<void>;

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
