import {
  ResourceDocument,
  RDRootChanges,
  RDDeleteUpdateData,
  RDRestoreUpdateData,
} from './ResourceDocument.types';

/**
 * Note: the TRD prefix stands for TypedResourceDocument.
 */

/**
 * Typed resource document data common to all typed resource
 * documents.
 */
export interface TRDRootData {
  /**
   * The resource type identifier.
   */
  type: string;
}

/**
 * The custom data for the base resource document
 * which is shared by all types.
 */
export type TRDBaseData = Object &
  Partial<Record<keyof TypedResourceDocument<{}, {}>, never>>;

/**
 * The type specific custom resource document data.
 */
export type TRDTypeData<TBaseData> = Object &
  Partial<Record<keyof (TypedResourceDocument<{}, {}> & TBaseData), never>>;

export type TypedResourceDocument<
  TBaseData extends TRDBaseData = {},
  TTypeData extends TRDTypeData<TBaseData> = {},
> = ResourceDocument<TRDRootData & TBaseData & TTypeData>;

/**
 * When updating a resource document, the update data can consist
 * of part of the custom data, the delete update data, or the
 * restore update data.
 */
export type TRDUpdateData<
  TBaseData extends TRDBaseData = {},
  TTypeData extends TRDTypeData<TBaseData> = {},
> = Partial<TBaseData & TTypeData> | RDDeleteUpdateData | RDRestoreUpdateData;

/**
 * When updating a resource document, the changes consist of the
 * base document changes (which are set for every update), and
 * the custom data changes or delete/restore data changes.
 */
export type TRDChanges<
  TBaseData extends TRDBaseData = {},
  TTypeData extends TRDTypeData<TBaseData> = {},
> = RDRootChanges & TRDUpdateData<TBaseData, TTypeData>;

/**
 * Describes the changes made to an updated resource document.
 */
export interface TRDUpdate<
  TBaseData extends TRDBaseData = {},
  TTypeData extends TRDTypeData<TBaseData> = {},
> {
  /**
   * The resource document before it was changed.
   */
  before: TypedResourceDocument<TBaseData, TTypeData>;

  /**
   * The resource document after it was changed.
   */
  after: TypedResourceDocument<TBaseData, TTypeData>;

  /**
   * The changes applied to the resource document.
   */
  changes: TRDChanges<TBaseData, TTypeData>;
}

/**
 * A `[id]: TypedResourceDocument` map.
 */
export type TypedResourceDocumentMap<
  TDocument extends TypedResourceDocument = TypedResourceDocument,
> = Record<string, TDocument>;
