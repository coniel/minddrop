export interface Validator {
  type: string;
}

export type ValidatorFunction<TType = unknown> = (
  validator: Validator,
  value: TType,
  customValidators?: Record<string, ValidatorFunction>,
) => boolean;

export interface StringValidator {
  /**
   * The field value type.
   */
  type: 'string';

  /**
   * Whether an empty string value is allowed.
   * Defaults to `false`.
   */
  allowEmpty?: boolean;
}

export interface NumberValidator {
  /**
   * The field value type.
   */
  type: 'number';

  /**
   * The mininmum allowed value (inclusive).
   */
  min?: number;

  /**
   * The maximum allowed value (inclusive).
   */
  max?: number;
}

export interface BooleanValidator {
  /**
   * The field value type.
   */
  type: 'boolean';
}

export interface DateValidator {
  /**
   * The field value type.
   */
  type: 'date';
}

// The values allowed in an enum
export type EnumValue = string | boolean | number | null;

export interface EnumValidator {
  /**
   * The field value type.
   */
  type: 'enum';

  /**
   * The possible enum values. Validation will fail if the
   * field's value is not equal to one of these values.
   */
  options: EnumValue[];
}

// The values allowed in a set
export type SetValue = string | boolean | number | null;

export interface SetValidator {
  /**
   * The field value type.
   */
  type: 'set';

  /**
   * The possible set values. Validation will fail if the
   * field contains a value which is not listed here.
   */
  options: SetValue[];

  /**
   * Whether an empty set is allowed.
   * Defaults to `true`.
   */
  allowEmpty?: boolean;
}

export interface ArrayValidator<TItemType = unknown> {
  /**
   * The field value type.
   */
  type: 'array';

  /**
   * The field validator used to validate the array items.
   * Can be omited if using the `itemValidatorFn` instead.
   */
  items?: Validator;

  /**
   * A function used to validate the items. Called on each
   * of the array items. Can be omited if using the `items`
   * validator instead.
   */
  itemValidatorFn?(item: TItemType): void;

  /**
   * Whether an empty array is allowed.
   * Defaults to `true`.
   */
  allowEmpty?: boolean;
}

export interface ObjectValidator {
  /**
   * The field value type.
   */
  type: 'object';

  /**
   * The schema used to validate the object.
   */
  schema: Schema;
}

export interface FieldValidator<TType = unknown> extends Validator {
  /**
   * Whether the field is required.
   * Defaults to `false`.
   */
  required?: boolean;

  /**
   * Whether the field value can be set to `null`.
   * Defaults to `false`.
   */
  allowNull?: boolean;

  /**
   * A custom validation function called after the
   * regular validation is performed.
   *
   * Must throw a `ValidationError` if the validation
   * fails.
   *
   * @param value The value of the field being validated.
   * @param previousValue The original value of the field, only present if it is being updated.
   */
  validatorFn?(value: TType, object: object): void;

  /**
   * Required only if one of more of the following
   * fields are present.
   */
  requiredWith?: string[];

  /**
   * Required only if one or more of the following
   * fields are not present.
   */
  requiredWithout?: string[];

  /**
   * Forbiden if one or more of the following fields
   * are present.
   */
  forbidenWith?: string[];

  /**
   * Forbiden if one or more of the following fields
   * are not present.
   */
  forbidenWithout?: string[];
}

export type PrimitiveValidator =
  | StringValidator
  | NumberValidator
  | BooleanValidator
  | DateValidator
  | EnumValidator
  | SetValidator
  | ArrayValidator
  | ObjectValidator;

export type StringFieldValidator = StringValidator & FieldValidator<string>;
export type NumberFieldValidator = NumberValidator & FieldValidator<number>;
export type BooleanFieldValidator = BooleanValidator & FieldValidator<boolean>;
export type DateFieldValidator = DateValidator & FieldValidator<Date>;
export type EnumFieldValidator = EnumValidator & FieldValidator<EnumValue>;
export type SetFieldValidator = SetValidator & FieldValidator<SetValue>;
export type ArrayFieldValidator<TItemType = unknown> =
  ArrayValidator<TItemType> & FieldValidator<TItemType[]>;
export type ObjectFieldValidator = ObjectValidator & FieldValidator<Object>;

export type SchemaFieldValidator =
  | StringFieldValidator
  | NumberFieldValidator
  | BooleanFieldValidator
  | DateFieldValidator
  | EnumFieldValidator
  | SetFieldValidator
  | ArrayFieldValidator
  | ObjectFieldValidator;

export type Schema<TCustomValidator extends FieldValidator = FieldValidator> =
  Record<string, SchemaFieldValidator | TCustomValidator>;
