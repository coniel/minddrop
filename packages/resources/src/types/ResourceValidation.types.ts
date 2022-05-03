import { ContentColor } from '@minddrop/core';
import {
  BaseFieldValidator,
  StringValidator,
  NumberValidator,
  BooleanValidator,
  DateValidator,
  NullValidator,
  EnumValidator,
  SetValidator,
  RecordValidator,
  ArrayValidator,
  ObjectValidator,
  MultiTypeValidator,
} from '@minddrop/utils';
import {
  ResourceDocument,
  ResourceDocumentCustomData,
} from './ResourceDocument.types';
import {
  TypedResourceDocument,
  TypedResourceDocumentBaseCustomData,
  TypedResourceDocumentTypeCustomData,
} from './TypedResourceDocument.types';

export interface ResourceIdValidator {
  /**
   * The field value type.
   */
  type: 'resource-id';

  /**
   * The resource type for which the field stores
   * the ID.
   */
  resource: string;
}

export interface ResourceIdsValidator {
  /**
   * The field value type.
   */
  type: 'resource-ids';

  /**
   * The resource type for which the field stores
   * the IDs.
   */
  resource: string;
}

export interface ResourceReferenceValidator {
  /**
   * The field value type.
   */
  type: 'resource-reference';
}

export interface ResourceReferencesValidator {
  /**
   * The field value type.
   */
  type: 'resource-references';

  /**
   * When `true`, the array can be empty.
   * `true` by default.
   */
  allowEmpty?: boolean;
}

export interface ContentColorValidator {
  /**
   * The field value type.
   */
  type: 'content-color';

  /**
   * The content colors which are allowed.
   * Omit to allow all colors.
   */
  allowedColors?: ContentColor[];
}

export interface BaseResourceFieldValidator extends BaseFieldValidator {
  /**
   * Whether the field is static. Static fields
   * cannot be updated. Defaults to `false`.
   */
  static?: boolean;
}

export type ResourceFieldValidator = (
  | StringValidator
  | NumberValidator
  | BooleanValidator
  | DateValidator
  | NullValidator
  | EnumValidator
  | SetValidator
  | RecordValidator
  | ArrayValidator
  | ObjectValidator
  | MultiTypeValidator<ResourceFieldValidator>
  // Resource validator types
  | ResourceIdValidator
  | ResourceIdsValidator
  | ResourceReferenceValidator
  | ResourceReferencesValidator
  | ContentColorValidator
) &
  BaseResourceFieldValidator;

/**
 * The schema for resource documents.
 */
export type ResourceDocumentSchema<TData extends ResourceDocumentCustomData> =
  Record<keyof ResourceDocument<TData>, ResourceFieldValidator>;

/**
 * The schema for the custom data of resource
 * documents.
 */
export type ResourceDocumentDataSchema<
  TData extends ResourceDocumentCustomData = {},
> = Record<keyof TData, ResourceFieldValidator>;

/**
 * The schema for typed resource documents.
 */
export type TypedResourceDocumentSchema<
  TBaseData extends TypedResourceDocumentBaseCustomData,
  TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData>,
> = Record<
  keyof TypedResourceDocument<TBaseData, TTypeData>,
  ResourceFieldValidator
>;

/**
 * The schema for the base custom data of typed
 * resource documents.
 */
export type TypedResourceBaseDocumentDataSchema<
  TBaseData extends TypedResourceDocumentBaseCustomData,
> = Record<keyof TBaseData, ResourceFieldValidator> &
  Partial<Record<keyof TypedResourceDocument<{}, {}>, never>>;

/**
 * The schema for the type specific custom data
 * of typed resource documents.
 */
export type TypedResourceTypeDocumentDataSchema<
  TBaseData extends TypedResourceDocumentBaseCustomData,
  TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData>,
> = Record<keyof TTypeData, ResourceFieldValidator> &
  Partial<Record<keyof TypedResourceDocument<TBaseData, {}>, never>>;

/**
 * The combined base and type scpecific custom
 * data schema for a typed resource document.
 */
export type TypedResourceDocumentDataSchema<
  TBaseData extends TypedResourceDocumentBaseCustomData = {},
  TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData> = {},
> = TypedResourceBaseDocumentDataSchema<TBaseData> &
  TypedResourceTypeDocumentDataSchema<TBaseData, TTypeData> &
  Partial<Record<keyof TypedResourceDocument<{}, {}>, never>>;
