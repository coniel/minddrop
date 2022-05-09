import { UseBoundStore } from 'zustand';

export interface ResourceStoreInternalApi<TResourceDocument extends object> {
  /**
   * A `{ [id]: Resource }` map of resource documents.
   */
  documents: Record<string, TResourceDocument>;

  /**
   * A `{ [id]: revisionId[] }` map of each resource
   * document's past and current revision IDs, created
   * during the current session.
   */
  revisions: Record<string, string[]>;

  /**
   * Loads documents into the store.
   *
   * @param documents The documents to load.
   */
  loadDocuments(documents: TResourceDocument[]): void;

  /**
   * Sets a document in the store.
   *
   * @param document The document to set.
   */
  setDocument(document: TResourceDocument): void;

  /**
   * Removes a document from the store.
   *
   * @param documentId The ID of the document to remove.
   */
  removeDocument(documentId: string): void;

  /**
   * Clears all documents from the store.
   */
  clearDocuments(): void;
}

export interface ResourceStore<TDocument extends object> {
  useStore: UseBoundStore<ResourceStoreInternalApi<TDocument>>;

  /**
   * Retrieves a resource document by ID.
   *
   * @param id The ID of the resource document to get.
   */
  get(id: string): TDocument;

  /**
   * Returns a `{ [id]: Resource }` map of the requested
   * resources. Omits any requested resources which do not
   * exist.
   *
   * @param ids The IDs of the resource documents to get.
   */
  get(id: string[]): Record<string, TDocument>;

  /**
   * Returns all resource documents.
   */
  getAll(): Record<string, TDocument>;

  /**
   * Loads the resource documents into the store.
   *
   * @param documents The documents to load.
   */
  load(documents: TDocument[]): void;

  /**
   * Sets a resource document in the store.
   *
   * @param document The document to set.
   */
  set(document: TDocument): void;

  /**
   * Removes a resource document from the store.
   *
   * @param id The ID of the document to remove.
   */
  remove(id: string): void;

  /**
   * Clears all resource documents from the store.
   */
  clear(): void;

  /**
   * Returns a boolean indicating whether a given
   * revision of a resource document is currently
   * or has previously been in the store.
   *
   * @param documentId The ID of the document for which to check.
   * @param revisionId The revision ID to check for.
   */
  containsRevision(documentId: string, revisionId: string): boolean;

  /**
   * A hook which returns a resource document by ID.
   *
   * @param id The ID of the resource document to retrieve.
   */
  useResource(id: string): TDocument | null;

  /**
   * A hook which returns an `{ [id]: Resource | null }` map
   * of the requested resources (or null if a resource
   * document does not exist).
   *
   * @param ids The IDs of the resources to retrieve.
   */
  useResources(ids: string[]): Record<string, TDocument | null>;

  /**
   * A hook which returns a `{ [id]: Resource }` map of all
   * the resource documents.
   */
  useAllResources(): Record<string, TDocument>;
}
