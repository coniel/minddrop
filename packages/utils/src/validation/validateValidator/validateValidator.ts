import { InvalidValidatorError } from '../../errors';
import { Validator, ValidatorValidator, Schema } from '../../types';
import { validateObject } from '../validateObject';
import {
  ObjectValidatorOptionsSchema,
  ArrayValidatorOptionsSchema,
  EnumValidatorOptionSchema,
  RecordValidatorOptionsSchema,
  NumberValidatorOptionsSchema,
  SchemaValidatorOptionsSchema,
  SetValidatorOptionsSchema,
  StringValidatorOptionsSchema,
} from '../validator-options-schemas';

const coreValidatorOptionsSchemas = {
  string: StringValidatorOptionsSchema,
  array: ArrayValidatorOptionsSchema,
  object: ObjectValidatorOptionsSchema,
  record: RecordValidatorOptionsSchema,
  set: SetValidatorOptionsSchema,
  enum: EnumValidatorOptionSchema,
  number: NumberValidatorOptionsSchema,
  schema: SchemaValidatorOptionsSchema,
};

/**
 * Validates a valditor object.
 *
 * Throws a `InvalidValidatorError` error if the validator's
 * type does not match the specified type or if the
 * validator's other properties do not conform to the
 * provided options schema.
 *
 * @param validator The validator to validate.
 * @param type The validator type.
 * @param validatorOptionsSchema The schema used to validate the validator's options.
 * @param ignoreExtraneousOptions When `false`, throws if the validator contains options not listed in `optionsSchema`.
 * @param extendedOptionsSchema The schema used to validate options added by a higher level validator.
 */
export function validateValidator(
  validator: ValidatorValidator,
  value: unknown,
): void {
  // Ensure that the value is a non-null object
  if (typeof value !== 'object' || value === null) {
    throw new InvalidValidatorError('validator must be an object');
  }

  const val = value as Validator;
  // Ignore extraneous options, `true` by default
  const ignoreExtraneousOptions =
    typeof validator.ignoreExtraneousOptions === 'undefined'
      ? true
      : validator.ignoreExtraneousOptions;
  // Allow multi-type validator, `false` by default
  const allowMultiType =
    typeof validator.allowMultiType === 'undefined'
      ? true
      : validator.allowMultiType;
  // The option schemas
  const optionsSchemas = validator.optionsSchemas
    ? { ...coreValidatorOptionsSchemas, ...validator.optionsSchemas }
    : coreValidatorOptionsSchemas;
  // The allowed validator types. Unrestricted if empty.
  const allowedTypes = validator.allowedTypes || [];
  // Whether the valdiator is a multi-type validator
  // const isMultiType = Array.isArray(value);

  // Ensure the value has a `type`
  if (!val.type) {
    throw new InvalidValidatorError('validator property `type` is required');
  }

  // If `type` is an array, the validator is mutli-type
  if (Array.isArray(val.type)) {
    // Ensure that multi-type validators are allowed
    if (!allowMultiType) {
      throw new InvalidValidatorError(
        `invalid validator type. Only validators of type '${allowedTypes.join(
          "', '",
        )}' are permitted. Received a multi-type validator.`,
      );
    }

    // Validate each of the validators separately
    (val.type as Validator[]).forEach((nestedValidator) =>
      validateValidator(
        { ...validator, allowMultiType: false },
        nestedValidator,
      ),
    );

    // End here
    return;
  }

  // Ensure that the validator type is allowed
  if (allowedTypes.length && !allowedTypes.includes(val.type as string)) {
    throw new InvalidValidatorError(
      `invalid validator type. Only validators of type '${allowedTypes.join(
        "', '",
      )}' are permitted. Received '${val.type}'`,
    );
  }

  // Get the options schema for the validator type
  const optionsSchema = optionsSchemas[val.type];

  // Validate options if a schema was provided
  if (optionsSchema) {
    try {
      // The validator's options
      let validatorOptions = {};

      if (ignoreExtraneousOptions) {
        // Only validate properties listed in the options schema,
        // ignoring all other properties.
        validatorOptions = Object.keys(optionsSchema).reduce(
          (options, key) => ({ ...options, [key]: val[key] }),
          {},
        );
      } else {
        // Validate all properties other than `type`
        validatorOptions = Object.keys(val)
          .filter((key) => key !== 'type')
          .reduce((options, key) => ({ ...options, [key]: val[key] }), {});
      }

      // Ensure that the validator's options are valid by validating
      // the validator object against it's options schema.
      validateObject(
        { type: 'object', schema: optionsSchema as Schema },
        validatorOptions,
      );
    } catch (error) {
      // Re-throw the validation error as an `InvalidValidatorError`
      throw new InvalidValidatorError(error.message);
    }
  }
}
