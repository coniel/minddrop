import { ContentColor } from './Color.types';
import { ParentReference } from './ParentReference.types';
import {
  ArrayValidator,
  BooleanValidator,
  DateValidator,
  EnumValidator,
  EnumValue,
  FieldValidator,
  NumberValidator,
  ObjectValidator,
  SetValidator,
  SetValue,
  StringValidator,
} from './Validation.types';

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

export interface ParentReferenceValidator {
  /**
   * The field value type.
   */
  type: 'parent-reference';
}

export interface ParentReferencesValidator {
  /**
   * The field value type.
   */
  type: 'parent-references';
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

export interface ResourceFieldValidator<TType = any>
  extends FieldValidator<TType> {
  /**
   * Whether the field is protected. Protected fields
   * cannot be updated. Defaults to `false`.
   */
  protected?: boolean;
}

export type ResourceStringFieldValidator = StringValidator &
  ResourceFieldValidator<string>;
export type ResourceNumberFieldValidator = NumberValidator &
  ResourceFieldValidator<number>;
export type ResourceBooleanFieldValidator = BooleanValidator &
  ResourceFieldValidator<boolean>;
export type ResourceDateFieldValidator = DateValidator &
  ResourceFieldValidator<Date>;
export type ResourceEnumFieldValidator = EnumValidator &
  ResourceFieldValidator<EnumValue>;
export type ResourceSetFieldValidator = SetValidator &
  ResourceFieldValidator<SetValue>;
export type ResourceArrayFieldValidator = ArrayValidator &
  ResourceFieldValidator<unknown[]>;
export type ResourceObjectFieldValidator = ObjectValidator &
  ResourceFieldValidator<Object>;
export type ResourceResourceIdFieldValidator = ResourceIdValidator &
  ResourceFieldValidator<string>;
export type ResourceResourceIdsFieldValidator = ResourceIdsValidator &
  ResourceFieldValidator<string[]>;
export type ResourceParentReferenceFieldValidator = ParentReferenceValidator &
  ResourceFieldValidator<ParentReference>;
export type ResourceParentReferencesFieldValidator = ParentReferencesValidator &
  ResourceFieldValidator<ParentReference[]>;
export type ResourceContentColorFieldValidator = ContentColorValidator &
  ResourceFieldValidator<ContentColor>;

export type ResourceSchemaFieldValidator =
  | ResourceStringFieldValidator
  | ResourceNumberFieldValidator
  | ResourceBooleanFieldValidator
  | ResourceDateFieldValidator
  | ResourceEnumFieldValidator
  | ResourceSetFieldValidator
  | ResourceArrayFieldValidator
  | ResourceObjectFieldValidator
  | ResourceResourceIdFieldValidator
  | ResourceResourceIdsFieldValidator
  | ResourceParentReferenceFieldValidator
  | ResourceParentReferencesFieldValidator
  | ResourceContentColorFieldValidator;

export type ResourceSchema = Record<string, ResourceSchemaFieldValidator>;
