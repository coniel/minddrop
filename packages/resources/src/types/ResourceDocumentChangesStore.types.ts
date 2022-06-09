import { ResourceDocument, RDUpdate } from './ResourceDocument.types';

export interface ResourceDocumentChangesStore {
  /**
   * A `{ [id]: ResourceDocument }` map of created
   * resource documents.
   */
  created: Record<string, ResourceDocument>;

  /**
   * The IDs of created resource documents in the
   * order in which they were created.
   */
  creationOrder: string[];

  /**
   * A `{ [id]: RDChanges }` map of updated resource
   * documents.
   */
  updated: Record<string, RDUpdate>;

  /**
   * The permanently deleted resource documents
   * in the order in which they were deleted.
   */
  deleted: ResourceDocument[];

  /**
   * Adds a created document to the created
   * documents map.
   *
   * @param document - The document to add.
   */
  addCreated(document: ResourceDocument): void;

  /**
   * Adds document changes to the updated documents
   * map.
   *
   * @param id - The ID of the updated element.
   * @param changes - The document changes.
   */
  addUpdated(id: string, changes: RDUpdate): void;

  /**
   * Adds a deleted document to the list of
   * deleted documents.
   *
   * @param document - The deleted document.
   */
  addDeleted(document: ResourceDocument): void;

  /**
   * Clears the store.
   */
  clear(): void;
}
