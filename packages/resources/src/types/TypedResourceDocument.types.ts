import {
  ResourceDocument,
  RDRootChanges,
  RDDeleteUpdateData,
  RDRestoreUpdateData,
  RDParentsUpdateData,
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
export type TRDBaseData = Object & {
  [K in keyof ResourceDocument<TRDRootData>]?: never;
};

/**
 * The type specific custom resource document data.
 */
export type TRDTypeData<TBaseData> = Object & {
  [K in keyof ResourceDocument<TRDRootData & TBaseData>]?: never;
};

export type TypedResourceDocument<
  TBaseData extends TRDBaseData = {},
  TTypeData extends TRDTypeData<TBaseData> = {},
> = ResourceDocument &
  TRDRootData &
  Omit<TBaseData & TTypeData, keyof ResourceDocument<TRDRootData>>;

export type TypedResourceDocumentData<
  TBaseData extends TRDBaseData = {},
  TTypeData extends TRDTypeData<TBaseData> = {},
> = Omit<TypedResourceDocument<TBaseData, TTypeData>, keyof ResourceDocument>;

export type ToData<TData extends TRDBaseData | TRDTypeData<{}>> = Omit<
  TData,
  keyof ResourceDocument & TRDRootData
>;

/**
 * When updating a resource document, the update data can consist
 * of part of the custom data, the delete update data, or the
 * restore update data.
 */
export type TRDUpdateData<
  TBaseData extends TRDBaseData = {},
  TTypeData extends TRDTypeData<TBaseData> = {},
> =
  | Partial<TBaseData & TTypeData>
  | RDDeleteUpdateData
  | RDRestoreUpdateData
  | RDParentsUpdateData;

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
