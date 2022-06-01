import { ContentColor } from '@minddrop/core';
import {
  BaseValidator,
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
import { ResourceReference } from './ResourceReference.types';
import { ResourceDocument, RDData } from './ResourceDocument.types';
import {
  TypedResourceDocument,
  TRDBaseData,
  TRDTypeData,
} from './TypedResourceDocument.types';

export interface ResourceIdValidator
  extends BaseValidator<'resource-id', string> {
  /**
   * The field value type.
   */
  type: 'resource-id';

  /**
   * The resource type for which the field stores
   * the ID.
   */
  resource: string;

  /**
   * When `true`, the resource is added as a parent
   * on the referenced resource.
   */
  addAsParent?: boolean;
}

export interface ResourceIdsValidator
  extends BaseValidator<'resource-ids', string[]> {
  /**
   * The field value type.
   */
  type: 'resource-ids';

  /**
   * The resource type for which the field stores
   * the IDs.
   */
  resource: string;

  /**
   * When `true`, the resource is added as a parent
   * on the referenced resources.
   */
  addAsParent?: boolean;
}

export interface ResourceReferenceValidator
  extends BaseValidator<'resource-reference', ResourceReference> {
  /**
   * The field value type.
   */
  type: 'resource-reference';
}

export interface ResourceReferencesValidator
  extends BaseValidator<'resource-references', ResourceReference[]> {
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

export interface ContentColorValidator
  extends BaseValidator<'content-color', ContentColor> {
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
  | ArrayValidator<ResourceFieldValidator>
  | ObjectValidator<ResourceFieldValidator>
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
 * Note:
 * The RD prefix stands for ResourceDocument.
 * The TRD prefix stands for TypedResourceDocument.
 */

/**
 * The schema for resource documents.
 */
export type RDSchema<TData extends RDData = {}> = Record<
  keyof ResourceDocument<TData>,
  ResourceFieldValidator
>;

/**
 * The schema for the custom data of resource
 * documents.
 */
export type RDDataSchema<TData extends RDData = {}> = Record<
  keyof TData,
  ResourceFieldValidator
>;

/**
 * The schema for typed resource documents.
 */
export type TRDSchema<
  TBaseData extends TRDBaseData = {},
  TTypeData extends TRDTypeData<TBaseData> = {},
> = Record<
  keyof TypedResourceDocument<TBaseData, TTypeData>,
  ResourceFieldValidator
>;

/**
 * The schema for the base custom data of typed
 * resource documents.
 */
export type TRDBaseDataSchema<TBaseData extends TRDBaseData> = Record<
  keyof TBaseData,
  ResourceFieldValidator
> &
  Partial<Record<keyof TypedResourceDocument<{}, {}>, never>>;

/**
 * The schema for the type specific custom data
 * of typed resource documents.
 */
export type TRDTypeDataSchema<
  TBaseData extends TRDBaseData,
  TTypeData extends TRDTypeData<TBaseData>,
> = Record<keyof TTypeData, ResourceFieldValidator> &
  Partial<Record<keyof TypedResourceDocument<TBaseData, {}>, never>>;

/**
 * The combined base and type scpecific custom
 * data schema for a typed resource document.
 */
export type TRDDataSchema<
  TBaseData extends TRDBaseData = {},
  TTypeData extends TRDTypeData<TBaseData> = {},
> = TRDBaseDataSchema<TBaseData> &
  TRDTypeDataSchema<TBaseData, TTypeData> &
  Partial<Record<keyof TypedResourceDocument<{}, {}>, never>>;
