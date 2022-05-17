import {
  FieldValueDelete,
  FieldValueArrayUnion,
  FieldValueArrayRemove,
} from '@minddrop/utils';
import { ResourceReference } from './ResourceReference.types';

/**
 * Note: the RD prefix stands for ResourceDocument.
 */

/**
 * Resource document data common to all documents.
 */
export interface RDRootData {
  /**
   * The name of the resource.
   */
  resource: string;

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
   * References to the document's parent documents.
   */
  parents?: ResourceReference[];

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

export type RDData = Object &
  Partial<Record<keyof ResourceDocument<{}>, never>>;

/**
 * A resource document consists of the base resource document
 * data, and custom data.
 */
export type ResourceDocument<TData extends RDData = {}> = RDRootData & TData;

/**
 * When updating a resource document, the following properties
 * are always updated.
 */
export interface RDRootChanges {
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
export interface RDDeleteUpdateData {
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
export interface RDRestoreUpdateData {
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
 * Data used to update a resource documen't parents.
 */
export interface RDParentsUpdateData {
  /**
   * Parents can only be updated using field value mutators.
   */
  parents: FieldValueArrayUnion | FieldValueArrayRemove;
}

/**
 * When updating a resource document, the update data can consist
 * of part of the custom data, the delete update data, or the
 * restore update data.
 */
export type RDUpdateData<TData extends RDData> =
  | Partial<TData>
  | RDDeleteUpdateData
  | RDRestoreUpdateData
  | RDParentsUpdateData;

/**
 * When updating a resource document, the changes consist of the
 * base document changes (which are set for every update), and
 * the custom data changes or delete/restore data changes.
 */
export type RDChanges<TData extends RDData> = RDRootChanges &
  RDUpdateData<TData>;

/**
 * Describes the changes made to an updated resource document.
 */
export interface RDUpdate<
  TData extends RDData,
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
  changes: RDChanges<TData>;
}

/**
 * A `[id]: ResourceDocument` map.
 */
export type ResourceDocumentMap<
  TDocument extends ResourceDocument = ResourceDocument,
> = Record<string, TDocument>;
