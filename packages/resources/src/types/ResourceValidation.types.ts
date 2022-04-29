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

export type ResourceDocumentSchema<TData extends ResourceDocumentCustomData> =
  Record<keyof ResourceDocument<TData>, ResourceFieldValidator>;

export type ResourceDocumentDataSchema<
  TData extends ResourceDocumentCustomData,
> = Record<keyof TData, ResourceFieldValidator>;
