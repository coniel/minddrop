import { FieldValueDelete } from '@minddrop/utils';

/**
 * Resource document data common to all documents.
 */
export interface BaseResourceDocumentData {
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
   * The timestamp at which the resource document was
   * createed.
   */
  createdAt: Date;

  /**
   * The timestamp at which the resource document was
   * last updated.
   */
  updatedAt: Date;

  /**
   * When `true`, the document is deleted.
   */
  deleted?: true;

  /**
   * The timestamp at which the document was deleted.
   * Only set if `deleted` is true.
   */
  deletedAt?: Date;
}

export type ResourceDocumentCustomData = Object &
  Partial<Record<keyof ResourceDocument<{}>, never>>;

/**
 * A resource document consists of the base resource document
 * data, and custom data.
 */
export type ResourceDocument<TData extends ResourceDocumentCustomData = {}> =
  BaseResourceDocumentData & TData;

/**
 * When updating a resource document, the following properties
 * are always updated.
 */
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

/**
 * When soft-deleting a resource document, the following
 * properties are updated.
 */
export interface DeleteUpdateData {
  /**
   * Marks the document as deleted.
   */
  deleted: true;

  /**
   * The timestamp at which the document was deleted.
   */
  deletedAt: Date;
}

/**
 * When restoring a soft-deleted resource document, the following
 * properties are updated.
 */
export interface RestoreUpdateData {
  /**
   * Removes the deleted property so that the document is no longer
   * marked as deleted.
   */
  deleted: FieldValueDelete;

  /**
   * Removes the deletedAt property which is only allowed to be
   * present when the document is deleted.
   */
  deletedAt: FieldValueDelete;
}

/**
 * When updating a resource document, the update data can consist
 * of part of the custom data, the delete update data, or the
 * restore update data.
 */
export type ResourceDocumentUpdateData<
  TData extends ResourceDocumentCustomData,
> = Partial<TData> | DeleteUpdateData | RestoreUpdateData;

/**
 * When updating a resource document, the changes consist of the
 * base document changes (which are set for every update), and
 * the custom data changes or delete/restore data changes.
 */
export type ResourceDocumentChanges<TData extends ResourceDocumentCustomData> =
  BaseResourceDocumentChanges & ResourceDocumentUpdateData<TData>;

/**
 * Describes the changes made to an updated resource document.
 */
export interface ResourceDocumentUpdate<
  TData extends ResourceDocumentCustomData,
  TResourceDocument extends ResourceDocument<TData>,
> {
  /**
   * The resource document before it was changed.
   */
  before: TResourceDocument;

  /**
   * The resource document after it was changed.
   */
  after: TResourceDocument;

  /**
   * The changes applied to the resource document.
   */
  changes: ResourceDocumentChanges<TData>;
}
