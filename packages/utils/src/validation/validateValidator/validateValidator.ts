import { InvalidValidatorError } from '../../errors';
import { Schema, Validator } from '../../types';
import { validateObject } from '..';

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
 * @param optionsSchema The schema used to validate the validator's options.
 * @param ignoreExtraneousOptions When `false`, throws if the validator contains options not listed in `optionsSchema`.
 * @param extendedOptionsSchema The schema used to validate options added by a higher level validator.
 */
export function validateValidator<TValidator extends Validator = Validator>(
  validator: TValidator,
  type: string,
  optionsSchema?: Schema,
  ignoreExtraneousOptions = true,
  extendedOptionsSchema?: Schema,
): void {
  // Ensure the validator has a type matching the given type
  if (validator.type !== type) {
    throw new InvalidValidatorError(
      `invalid type '${validator.type}', expected '${type}'`,
    );
  }

  // Validate options if a schema was provided
  if (optionsSchema) {
    // Merge `extendedOptionsSchema` into `optionsSchema` if present
    const schema = extendedOptionsSchema
      ? { ...optionsSchema, ...extendedOptionsSchema }
      : optionsSchema;

    try {
      // The validator's options
      let validatorOptions = {};

      if (ignoreExtraneousOptions) {
        // Only validate properties listed in the options schema,
        // ignoring all other properties.
        validatorOptions = Object.keys(schema).reduce(
          (options, key) => ({ ...options, [key]: validator[key] }),
          {},
        );
      } else {
        // Validate all properties other than `type`
        validatorOptions = Object.keys(validator)
          .filter((key) => key !== 'type')
          .reduce(
            (options, key) => ({ ...options, [key]: validator[key] }),
            {},
          );
      }

      // Ensure that the validator's options are valid
      validateObject({ type: 'object', schema }, validatorOptions);
    } catch (error) {
      // Re-throw the validation error as an `InvalidValidatorError`
      throw new InvalidValidatorError(error.message);
    }
  }
}
