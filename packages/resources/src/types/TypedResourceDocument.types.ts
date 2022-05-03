import {
  ResourceDocument,
  BaseResourceDocumentChanges,
  DeleteUpdateData,
  RestoreUpdateData,
} from './ResourceDocument.types';

/**
 * The custom data for the base resource document
 * which is shared by all types.
 */
export type TypedResourceDocumentBaseCustomData = Object &
  Partial<Record<keyof TypedResourceDocument<{}, {}>, never>>;

/**
 * The type specific custom resource document data.
 */
export type TypedResourceDocumentTypeCustomData<TBaseData> = Object &
  Partial<Record<keyof (TypedResourceDocument<{}, {}> & TBaseData), never>>;

export type TypedResourceDocument<
  TBaseData extends TypedResourceDocumentBaseCustomData = {},
  TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData> = {},
> = ResourceDocument<TBaseData & TTypeData> & {
  /**
   * The resource type identifier.
   */
  type: string;
};

/**
 * When updating a resource document, the update data can consist
 * of part of the custom data, the delete update data, or the
 * restore update data.
 */
export type TypedResourceDocumentUpdateData<
  TBaseData extends TypedResourceDocumentBaseCustomData = {},
  TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData> = {},
> = Partial<TBaseData & TTypeData> | DeleteUpdateData | RestoreUpdateData;

/**
 * When updating a resource document, the changes consist of the
 * base document changes (which are set for every update), and
 * the custom data changes or delete/restore data changes.
 */
export type TypedResourceDocumentChanges<
  TBaseData extends TypedResourceDocumentBaseCustomData = {},
  TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData> = {},
> = BaseResourceDocumentChanges &
  TypedResourceDocumentUpdateData<TBaseData, TTypeData>;

/**
 * Describes the changes made to an updated resource document.
 */
export interface TypedResourceDocumentUpdate<
  TBaseData extends TypedResourceDocumentBaseCustomData = {},
  TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData> = {},
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
  changes: TypedResourceDocumentChanges<TBaseData, TTypeData>;
}
