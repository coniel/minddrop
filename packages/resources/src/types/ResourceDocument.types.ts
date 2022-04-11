export interface ResourceDocumentData {
  /**
   * The resource document's ID.
   */
  id: string;

  /**
   * The resource document's revision. Changed every
   * time the resource is updated in the database.
   */
  revision: string;

  /**
   * The resource API's version number at the time the
   * document was created or last mutated.
   */
  apiVersion: number;

  /**
   * The resource extension API's version number at the
   * time the document was created, converted or last
   * mutated.
   */
  extensionApiVersion?: number;

  /**
   * The timestamp at which the resource document was
   * createed.
   */
  createdAt: Date;

  /**
   * The timestamp at which the resource document was
   * last updated.
   */
  updatedAt: Date;
}

export type ResourceDocument<TData extends Object = {}> = ResourceDocumentData &
  TData;
