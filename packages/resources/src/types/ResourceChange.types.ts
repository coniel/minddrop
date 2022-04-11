import { ResourceDocument } from './ResourceDocument.types';

export interface BaseResourceDocumentChanges {
  /**
   * The document's new revision ID.
   */
  revision: string;

  /**
   * The timestamp at which the update occured.
   */
  updatedAt: Date;
}

export type ResourceDocumentChanges<TData> = BaseResourceDocumentChanges &
  Partial<TData>;

export interface ResourceDocumentUpdate<TData> {
  /**
   * The resource document before it was changed.
   */
  before: ResourceDocument<TData>;

  /**
   * The resource document after it was changed.
   */
  after: ResourceDocument<TData>;

  /**
   * The changes applied to the resource document.
   */
  changes: ResourceDocumentChanges<TData>;
}
