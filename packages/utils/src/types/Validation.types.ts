export interface BaseValidator<
  TType extends string = string,
  TDataType = unknown,
> {
  /**
   * The value type.
   */
  type: TType;

  /**
   * A custom validation function called after the
   * regular validation is performed.
   *
   * Must throw a `ValidationError` if the validation
   * fails.
   *
   * @param value The value of the field being validated.
   */
  validatorFn?(value: TDataType, object?: object): void;
}

export interface MultiTypeValidator<
  TValidator extends Validator = Validator,
  TDataType = unknown,
> extends Omit<BaseValidator<string, TDataType>, 'type'> {
  /**
   * Validators validating the allowed types.
   */
  type: TValidator[];
}

export type ValidatorFunction<TType = unknown> = (
  validator: Validator,
  value: TType,
  customValidators?: Record<string, ValidatorFunction>,
) => void;

export type Validator<TType extends string = string, TDataType = unknown> =
  | BaseValidator<TType, TDataType>
  | MultiTypeValidator;

export interface StringValidator extends BaseValidator<'string', string> {
  /**
   * Whether an empty string value is allowed.
   * Defaults to `false`.
   */
  allowEmpty?: boolean;
}

export interface NumberValidator extends BaseValidator<'number', number> {
  /**
   * The mininmum allowed value (inclusive).
   */
  min?: number;

  /**
   * The maximum allowed value (inclusive).
   */
  max?: number;
}

export interface BooleanValidator extends BaseValidator<'boolean', boolean> {}

export interface DateValidator extends BaseValidator<'date', Date> {}

export interface NullValidator extends BaseValidator<'null', null> {}

// The values allowed in an enum
export type EnumValue = string | boolean | number | null;

export interface EnumValidator extends BaseValidator<'enum', EnumValue> {
  /**
   * The possible enum values. Validation will fail if the
   * field's value is not equal to one of these values.
   */
  options: EnumValue[];
}

// The values allowed in a set
export type SetValue = string | boolean | number | null;

export interface SetValidator extends BaseValidator<'set', SetValue> {
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

export interface ArrayValidator<
  TItemValidator extends Validator = CoreValidator,
  TItemType = unknown,
> extends BaseValidator<'array', TItemType[]> {
  /**
   * The validator used to validate the array items.
   * Can be omited if using the `itemValidatorFn` instead.
   */
  items?: TItemValidator | MultiTypeValidator<TItemValidator>;

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

export interface RecordValidator<
  TValueValidator extends BaseValidator | MultiTypeValidator = CoreValidator,
> extends BaseValidator<'record', object> {
  /**
   * The validator used to validate the record values.
   */
  values: TValueValidator;

  /**
   * Whether an empty record is allowed.
   * Defaults to `true`.
   */
  allowEmpty?: boolean;
}

export interface ObjectValidator<
  TValidator extends FieldValidator = CoreFieldValidator,
> extends BaseValidator<'object', object> {
  /**
   * The schema used to validate the object.
   */
  schema: Schema<TValidator>;
}

export interface ValidatorValidator<TValidator extends Validator = Validator>
  extends BaseValidator<'validator', TValidator> {
  /**
   * The types of validators allowed. If omitted, any
   * type is allowed.
   */
  allowedTypes?: string[];

  /**
   * When `true`, the validator can be a multi-type
   * validator.
   *
   * Default is `false`.
   */
  allowMultiType?: boolean;

  /**
   * When `true`, options not listed in the validator's
   * options schema will not cause validation to fail.
   *
   * Default is `true`.
   */
  ignoreExtraneousOptions?: boolean;

  /**
   * A `{ [validator-type]: Schema }` record of validator
   * options schemas for the allowed validator types.
   *
   * If present, the validator's options are validated
   * against the corresponding schema.
   */
  optionsSchemas?: Record<string, ValidatorOptionsSchema>;
}

export interface FunctionValidator
  extends BaseValidator<'function', Function> {}

export interface SchemaValidator<
  TValidator extends FieldValidator = CoreFieldValidator,
> extends BaseValidator<'schema', Schema<TValidator>> {
  /**
   * The value type.
   */
  type: 'schema';

  /**
   * The validator types which are allowed to appear
   * in the schema. Validator types are unrestricted
   * if omited or left empty.
   */
  allowedTypes?: string[];

  /**
   * The schemas for the options of allowed validators.
   */
  validatorOptionsSchemas?: Record<string, ValidatorOptionsSchema<TValidator>>;

  /**
   * The validators for custom field options.
   * If set, the provided options will be enabled on each
   * of the schema's fields.
   */
  customFieldOptions?: Record<string, FieldValidator>;
}

export interface BaseFieldValidator {
  /**
   * Whether the field is required.
   * Defaults to `false`.
   */
  required?: boolean;

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

export type FieldValidator = Validator & BaseFieldValidator;

export type CoreValidator =
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
  | ValidatorValidator
  | FunctionValidator
  | SchemaValidator
  | MultiTypeValidator<CoreFieldValidator>;

export type CoreFieldValidator = CoreValidator & BaseFieldValidator;

export type ValidatorOptionsSchema<
  TValue extends FieldValidator = CoreFieldValidator,
  TValidator extends FieldValidator = CoreFieldValidator,
> = Record<keyof Omit<TValue, keyof FieldValidator>, TValidator> & {
  type?: never | string[];
};

export type Schema<TValidator extends Validator = CoreValidator> = Record<
  string,
  TValidator & FieldValidator
>;
